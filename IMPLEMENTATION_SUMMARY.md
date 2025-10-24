# Team Note 기능 구현 및 동시편집 안정화 - 변경사항 정리

> 이 문서는 feat/97 브랜치에서 Claude가 구현한 주요 변경사항을 정리합니다.
> 프론트엔드 개발자는 이 문서를 참고하여 개발을 완성할 수 있습니다.

---

## 📋 핵심 변경사항

### 1. UI 변경: contentEditable → textarea
**파일**: `src/components/Note/DetailedNote.tsx`

#### 배경
- contentEditable 요소는 구성 범위(Composition) 처리가 복잡함
- HTML 삽입 위험 (보안 이슈)
- 텍스트 위치 계산이 DOM 트리에 따라 달라짐

#### 변경 내용
```tsx
// 이전: contentEditable div
<div ref={textEditorRef} contentEditable>

// 변경: textarea (순수 텍스트)
<textarea ref={textEditorRef} />
```

#### 장점
✅ 순수 텍스트만 처리하므로 HTML 삽입 불가능
✅ 커서 위치 계산이 간단 (`selectionStart`, `selectionEnd`)
✅ IME 조합 처리가 단순화됨

---

### 2. 동시편집(OT) 엔진 안정화

#### 2.1 Composition 이벤트 처리
**파일**: `src/components/Note/DetailedNote.tsx`

기존 복잡한 로직을 간소화:

**문제점 (기존)**
```tsx
// 복잡한 diff 재계산, Store와 DOM의 불일치 처리, remote edit 감지 등
compositionStartContentRef.current = textEditorRef.current?.textContent || "";
// ... 100+ 줄의 복잡한 로직
```

**개선 (현재)**
```tsx
const handleCompositionEnd = () => {
  isComposingRef.current = false;

  // 다음 tick에서 처리된 텍스트 변화를 감지
  Promise.resolve().then(() => {
    if (textEditorRef.current) {
      const newContent = textEditorRef.current.value;
      if (newContent !== lastContentRef.current) {
        // onChange가 트리거되지 않았으면 수동 처리
        handleTextChange({ currentTarget: textEditorRef.current } as any);
      }
    }
  });
};
```

#### 2.2 Remote Edit 처리 순서 개선
**파일**: `src/components/Note/DetailedNote.tsx`

**핵심 로직**
```tsx
const handleEdit = (payload: TEditPayload) => {
  const currentState = useNoteStore.getState();

  // 로컬 편집/composition 중이면 대기
  if (isLocalEditRef.current || isComposingRef.current) {
    pendingRemoteEditsRef.current.push(payload); // 큐에 저장
    return;
  }

  // 자신의 편집이면 revision 기반으로 처리
  if (payload.operation.workspaceMemberId === memberId) {
    const receivedRevision = payload.operation.revision;
    const newPending = currentState.pendingOperations.filter(
      (op) => op.revision > receivedRevision
    );
    useNoteStore.setState({ pendingOperations: newPending });
    return;
  }

  // 타인의 편집이면 즉시 적용
  handleRemoteEdit(payload.operation);
};
```

#### 2.3 Revision 기반 Pending Operation 처리
**변경사항**
- 위치(position) 기반 매칭 → **Revision 기반 매칭**으로 변경
- 이유: 서버에서 OT 변환 시 operation의 위치가 변할 수 있음
- Revision은 operation 적용 후의 절대적인 상태 버전

---

### 3. 타입 시스템 확장
**파일**: `src/shared/type/note.ts`

```tsx
// Team Note 타입 추가
export interface ITeamNote {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  creatorProfileImage?: string;
  teamId: number;
  revision: number;
  syncStatus: "synced" | "syncing" | "error";
  isEditable: boolean;
  members: Array<{
    memberId: number;
    memberName: string;
    profileImage?: string;
  }>;
}

// Edit operation 타입
export interface TEditPayload {
  operation: {
    type: "insert" | "delete";
    position: number;
    length: number;
    content?: string;
    workspaceMemberId: number;
    revision: number;
    timestamp: string;
  };
}

// Save payload 타입
export type TSavePayload = void;
```

---

### 4. 인증 컨텍스트 개선
**파일**: `src/context/AuthContext.tsx`

**변경사항**
- `jwt-decode` 라이브러리 추가 (^4.0.0)
- Token에서 memberId 안전하게 추출
- 권한 검증 로직 추가

```tsx
import { jwtDecode } from 'jwt-decode';

const memberId = getMemberId();

function getMemberId(): number | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    return decoded.memberId || decoded.sub;
  } catch {
    return null;
  }
}
```

---

### 5. WebSocket 서비스 개선
**파일**: `src/shared/api/webSocketService.ts` (신규 생성)

#### 주요 기능
```tsx
// WebSocket 싱글톤 서비스
export class NoteWebSocketService {
  // 연결/구독 관리
  async connect(token: string, onError?: (error: any) => void): Promise<void>
  async disconnect(): Promise<void>

  // 구독 관리
  async subscribeToNoteEnter(noteId: number, handler: (payload: TEnterPayload) => void): Promise<void>
  subscribeToEdits(noteId: number, handler: (payload: TEditPayload) => void): void
  subscribeToSave(noteId: number, handler: (payload: TSavePayload) => void): void
  subscribeToCursors(noteId: number, handler: (payload: TCursorPayload) => void): void

  // 이벤트 발송
  sendEdit(noteId: number, operation: any): void
  saveNote(noteId: number): void
  updateCursor(noteId: number, cursorPos: number): void

  // 정리
  unsubscribeFromNote(noteId: number, callback: () => void): void
}

export function getNoteWebSocketService(): NoteWebSocketService {
  if (!wsServiceInstance) {
    wsServiceInstance = new NoteWebSocketService();
  }
  return wsServiceInstance;
}
```

---

### 6. OT(Operational Transformation) 엔진
**파일**: `src/store/ot-engine.ts` (신규 생성)

#### 핵심 함수
```tsx
/**
 * Local operation을 현재 content에 적용
 * @param content 현재 content
 * @param operation insert/delete operation
 * @returns 변경된 content
 */
export function applyOperation(content: string, operation: any): string

/**
 * Remote operation과 local pending operation 간 충돌 해결
 * @param remoteOp 서버에서 받은 operation
 * @param localOp 아직 확인되지 않은 local operation
 * @returns 충돌 해결된 localOp
 */
export function transformAgainstRemote(remoteOp: any, localOp: any): any
```

#### 동작 원리
1. **Insert 연산 적용**
   ```
   content: "Hello World"
   insert at 5: " beautiful"
   → "Hello beautiful World"
   ```

2. **Delete 연산 적용**
   ```
   content: "Hello beautiful World"
   delete at 6, length 9
   → "Hello World"
   ```

3. **OT 변환** (충돌 해결)
   ```
   Remote: delete at 5, length 5
   Local: insert at 5, length 10

   Result: insert position이 조정됨
   ```

---

### 7. 팀 노트 페이지 구현
**파일**: `src/pages/Team/TeamNotePage.tsx`

#### 주요 컴포넌트 구조
```tsx
<TeamNotePage>
  ├─ NoteList (팀 노트 목록)
  │  ├─ Note (각 노트 아이템)
  │  └─ NoteInput (새 노트 생성)
  └─ DetailedNote (선택된 노트 상세 보기 & 편집)
```

#### 주요 기능
- 팀 멤버들의 실시간 협업 편집
- 동시편집 충돌 자동 해결
- 자동 저장 (5초 주기)
- 편집 상태 표시 (synced/syncing/error)

---

## 🔧 구현 체크리스트

### 기본 설정
- [x] `jwt-decode` 라이브러리 추가 (`package.json`)
- [x] WebSocket 서비스 싱글톤 구현
- [x] OT 엔진 기본 함수 구현
- [x] 타입 정의 확장

### DetailedNote 컴포넌트
- [x] contentEditable → textarea 변경
- [x] Composition 이벤트 처리 단순화
- [x] Remote edit 큐잉 시스템
- [x] Revision 기반 pending operation 처리
- [x] Auto-save 메커니즘
- [x] 커서 위치 보존 로직

### 팀 노트 페이지
- [x] TeamNotePage 구조 구현
- [x] NoteList 레이아웃
- [x] 팀별 노트 필터링
- [x] 권한 확인 로직

---

## 🚀 개발자가 완성해야 할 부분

### 1. UI/UX 개선
- [ ] 팀 노트 스타일링 (Tailwind CSS)
- [ ] 편집 상태 표시 UI (synced/syncing/error 배지)
- [ ] 팀 멤버 표시 (프로필 이미지, 이름)
- [ ] 커서 위치 표시 (다른 사용자의 커서)
- [ ] 토스트 알림 (저장 완료, 오류 등)

### 2. 기능 완성
- [ ] 노트 검색 기능
- [ ] 노트 태그/카테고리 분류
- [ ] 노트 공유 권한 설정
- [ ] 히스토리/버전 관리
- [ ] 댓글/토론 기능

### 3. 성능 최적화
- [ ] Diff 계산 알고리즘 최적화 (대용량 문서)
- [ ] Websocket 메시지 배칭
- [ ] 메모리 누수 테스트
- [ ] 번들 크기 최적화

### 4. 테스트
- [ ] 단위 테스트 (OT 엔진)
- [ ] 통합 테스트 (실시간 편집)
- [ ] E2E 테스트 (여러 클라이언트 동시편집)
- [ ] 에러 처리 테스트

### 5. 문서화
- [ ] API 문서 작성
- [ ] 컴포넌트 props 문서화
- [ ] WebSocket 메시지 스펙 정리

---

## 📝 주요 파일 가이드

### 신규 파일
| 파일 | 설명 |
|------|------|
| `src/shared/api/webSocketService.ts` | WebSocket 싱글톤 서비스 |
| `src/store/ot-engine.ts` | OT 연산 구현 |
| `src/shared/api/note.ts` | 노트 API 호출 함수 |

### 수정 파일
| 파일 | 변경 사항 |
|------|---------|
| `src/components/Note/DetailedNote.tsx` | 543줄 정리, textarea 변경, OT 로직 개선 |
| `src/components/Note/NoteInput.tsx` | 팀 노트 입력 UI 추가 |
| `src/components/Note/NoteList.tsx` | 팀 노트 목록 표시 기능 |
| `src/components/Note/Note.tsx` | 팀 노트 아이템 렌더링 |
| `src/pages/Team/TeamNotePage.tsx` | 팀 노트 페이지 구현 |
| `src/shared/type/note.ts` | 타입 정의 확장 |
| `src/context/AuthContext.tsx` | memberId 추출 로직 추가 |
| `Syncly/package.json` | jwt-decode 라이브러리 추가 |

### 삭제 파일
| 파일 | 이유 |
|------|-----|
| `src/components/Note/mock/data.ts` | 실제 API 사용으로 대체 |

---

## 🔍 동작 흐름 (User Story)

### 시나리오: 팀 멤버 A와 B가 동시에 노트를 편집

```
1. A가 노트 진입
   → TeamNotePage에서 노트 선택
   → DetailedNote에서 WebSocket 연결
   → noteEnter 이벤트 → 초기 content 로드

2. A가 "Hello" 입력
   → handleTextChange 트리거
   → calculateDiff로 operation 생성: insert(0, "Hello")
   → applyLocalOperation으로 store 업데이트
   → isLocalEditRef = true로 설정
   → WebSocket으로 operation 발송
   → pending operation에 추가

3. B가 "World" 입력 (동시에 같은 위치)
   → B의 operation 발송: insert(0, "World")

4. A의 클라이언트가 B의 operation 받음
   → handleEdit 트리거
   → isLocalEditRef = true이므로 큐에 저장
   → A의 전송 확인 대기

5. A의 operation 확인 응답
   → revision 업데이트
   → pendingOperations 정리
   → 큐의 B operation 이제 처리 가능

6. B의 operation 적용
   → OT 변환: B의 position 조정
   → transformAgainstRemote 실행
   → content 업데이트: "HelloWorld"

7. B의 클라이언트도 동일한 과정
   → A의 operation 수신
   → 큐 처리
   → OT 변환 후 적용
   → content 동일: "HelloWorld"

8. 5초 경과 후 자동 저장
   → saveNote() 호출
   → 저장 완료 이벤트
   → "saved" 배지 표시 → 3초 후 사라짐
```

---

## 🐛 알려진 제한사항 및 주의사항

### 1. 커서 위치
- 현재는 커서 위치를 서버에 전송하지 않음
- 향후 구현 시 다른 사용자의 커서를 오버레이로 표시 권장

### 2. Undo/Redo
- 현재 미구현
- Store에 히스토리 추가하여 구현 가능

### 3. 대용량 문서
- Diff 계산이 O(n) 복잡도
- 매우 큰 문서에서는 성능 최적화 필요

### 4. 오프라인 모드
- 인터넷 연결 끊김 시 pending operation이 전송되지 않음
- 재연결 시 동기화 필요

---

## 📞 문의 및 이슈

### 발생 가능한 이슈
1. **OT 충돌 409 에러**
   - 처리: `handleWebSocketError`에서 자동 복구
   - 서버 state로 강제 동기화

2. **IME 입력 손실**
   - 원인: composition 처리 중 DOM 업데이트
   - 처리: isComposingRef로 DOM 업데이트 차단

3. **WebSocket 연결 끊김**
   - 처리: 자동 재연결 (향후 구현 필요)
   - 현재: 수동 새로고침 필요

---

## 🎯 최종 검증 체크리스트

- [ ] 단일 사용자 편집 정상 동작
- [ ] 2명 동시편집 충돌 자동 해결
- [ ] 3명 이상 동시편집 동작
- [ ] IME(한글, 일본어 등) 입력 정상
- [ ] 자동 저장 5초 주기 정상
- [ ] WebSocket 끊김 후 재연결
- [ ] 페이지 새로고침 후 content 복구
- [ ] 팀 멤버 권한 확인
- [ ] 브라우저 콘솔에 에러 없음
- [ ] 성능: 대용량 문서(1MB) 편집 가능

---

**마지막 수정**: 2025-10-25
**작성자**: Claude AI
