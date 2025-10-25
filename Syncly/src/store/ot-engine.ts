import { TEditOperation } from "../shared/type/note";

/**
 * OT(Operational Transformation) 엔진
 * 동시편집 환경에서 충돌하는 연산을 변환하는 알고리즘 구현
 */

/**
 * 두 연산을 변환합니다.
 * 예: transformAgainstRemote(myOp, remoteOp)
 *    → myOp을 remoteOp 이후의 상태에서도 유효하도록 변환
 *
 * @param op1 기준 연산 (로컬)
 * @param op2 적용할 원격 연산
 * @returns 변환된 op1
 */
export const transformAgainstRemote = (
  op1: TEditOperation,
  op2: TEditOperation
): TEditOperation => {
  const transformedOp = { ...op1 };

  // op2가 insert 연산인 경우
  if (op2.type === "insert") {
    // Case 1: op1이 insert이고, 같은 위치에 insert
    if (op1.type === "insert" && op1.position === op2.position) {
      // workspaceMemberId가 작은 쪽이 먼저 삽입 (규칙: 충돌 해결)
      if (op1.workspaceMemberId > op2.workspaceMemberId) {
        transformedOp.position += op2.length;
      }
    }
    // Case 2: op1이 insert이고, op2가 op1 앞에 insert
    else if (op1.type === "insert" && op1.position > op2.position) {
      transformedOp.position += op2.length;
    }
    // Case 3: op1이 delete이고, op2가 delete 범위 전에 insert
    else if (op1.type === "delete" && op1.position > op2.position) {
      transformedOp.position += op2.length;
    }
    // Case 4: op1이 delete이고, op2가 delete 범위 내에 insert
    else if (
      op1.type === "delete" &&
      op2.position > op1.position &&
      op2.position < op1.position + op1.length
    ) {
      transformedOp.length += op2.length;
    }
  }
  // op2가 delete 연산인 경우
  else if (op2.type === "delete") {
    const deleteStart = op2.position;
    const deleteEnd = op2.position + op2.length;

    // Case 1: op1이 insert이고, op2 delete 범위 전에 위치
    if (op1.type === "insert" && op1.position <= deleteStart) {
      // 변화 없음
    }
    // Case 2: op1이 insert이고, op2 delete 범위 내에 위치
    else if (
      op1.type === "insert" &&
      op1.position > deleteStart &&
      op1.position < deleteEnd
    ) {
      // op1의 위치를 delete 시작점으로 조정
      transformedOp.position = deleteStart;
    }
    // Case 3: op1이 insert이고, op2 delete 범위 후에 위치
    else if (op1.type === "insert" && op1.position >= deleteEnd) {
      transformedOp.position -= op2.length;
    }
    // Case 4: op1이 delete이고, op2 delete와 겹치는 경우
    else if (op1.type === "delete") {
      const op1End = op1.position + op1.length;

      // delete 범위가 겹치지 않는 경우
      if (op1End <= deleteStart) {
        // op1이 op2 앞에 있으므로 변화 없음
      } else if (op1.position >= deleteEnd) {
        // op1이 op2 뒤에 있으므로 위치 조정
        transformedOp.position -= op2.length;
      } else {
        // delete 범위가 겹치는 경우
        const overlapStart = Math.max(op1.position, deleteStart);
        const overlapEnd = Math.min(op1End, deleteEnd);
        const overlapLength = overlapEnd - overlapStart;

        // 겹치는 부분만큼 op1의 length 감소
        transformedOp.length -= overlapLength;

        // op1 시작점이 op2 뒤에 있으면 위치 조정
        if (op1.position > deleteStart) {
          transformedOp.position = deleteStart;
        }
      }
    }
  }

  return transformedOp;
};

/**
 * 연산을 컨텐츠에 적용합니다.
 * @param content 현재 컨텐츠
 * @param operation 적용할 연산
 * @returns 변경된 컨텐츠
 */
export const applyOperation = (
  content: string,
  operation: TEditOperation
): string => {
  if (operation.type === "insert") {
    if (!operation.content) {
      console.warn("INSERT 연산에 content가 없습니다");
      return content;
    }

    // position이 범위를 벗어나면 끝에 추가
    const pos = Math.min(operation.position, content.length);

    // ⚠️ Position clipping 감지 (버그의 신호)
    if (operation.position > content.length) {
      console.warn("❌ INSERT position이 clamp됨:", {
        original: operation.position,
        clamped: pos,
        contentLength: content.length,
        content: content.substring(0, 100),
      });
    }

    return (
      content.substring(0, pos) + operation.content + content.substring(pos)
    );
  } else if (operation.type === "delete") {
    const start = Math.min(operation.position, content.length);
    const end = Math.min(operation.position + operation.length, content.length);

    if (start >= end) {
      return content;
    }

    return content.substring(0, start) + content.substring(end);
  }

  return content;
};

/**
 * 연산이 유효한지 검증합니다.
 * @param content 현재 컨텐츠
 * @param operation 검증할 연산
 * @returns 유효 여부
 */
export const validateOperation = (
  content: string,
  operation: TEditOperation
): boolean => {
  // position이 음수가 아니어야 함
  if (operation.position < 0) {
    console.warn("연산 position이 음수입니다");
    return false;
  }

  if (operation.type === "insert") {
    // position이 컨텐츠 길이를 초과하면 안 됨
    if (operation.position > content.length) {
      console.warn("INSERT position이 컨텐츠 길이를 초과합니다");
      return false;
    }
    // content가 없으면 안 됨
    if (!operation.content) {
      console.warn("INSERT에 content가 없습니다");
      return false;
    }
  } else if (operation.type === "delete") {
    // delete 범위가 컨텐츠 범위를 초과하면 안 됨
    if (operation.position + operation.length > content.length) {
      console.warn("DELETE 범위가 컨텐츠를 초과합니다");
      return false;
    }
  }

  return true;
};

/**
 * 여러 연산을 순서대로 변환합니다.
 * @param operation 변환할 연산
 * @param history 이전 연산 목록 (최신순)
 * @returns 변환된 연산
 */
export const transformAgainstHistory = (
  operation: TEditOperation,
  history: TEditOperation[]
): TEditOperation => {
  let transformed = { ...operation };

  // 역순으로 진행 (최신부터 오래된 순서로)
  for (const historyOp of history) {
    transformed = transformAgainstRemote(transformed, historyOp);
  }

  return transformed;
};

/**
 * 여러 로컬 연산을 원격 연산 목록에 대해 변환합니다.
 * (conflict resolution을 위해 여러 로컬 연산이 있을 때)
 * @param operations 변환할 연산 목록
 * @param remoteOperations 원격 연산 목록
 * @returns 변환된 연산 목록
 */
export const transformAgainstMultiple = (
  operations: TEditOperation[],
  remoteOperations: TEditOperation[]
): TEditOperation[] => {
  return operations.map((op) => transformAgainstHistory(op, remoteOperations));
};
