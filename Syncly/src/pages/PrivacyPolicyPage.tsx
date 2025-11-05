import { Footer } from "../components/Landing/footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background w-full min-h-screen mx-[74px] flex flex-col items-center gap-5 font-sans antialiased">
      <section className="relative overflow-hidden py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            개인정보처리방침
          </h1>
          <div className="grid gap-3 mt-8 p-8 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex justify-center items-center gap-2 text-sm md:text-base text-muted-foreground">
              <strong className="text-foreground font-semibold">
                시행일자:
              </strong>{" "}
              2025년 11월 5일
            </div>
            <div className="flex justify-center items-center gap-2 text-sm md:text-base text-muted-foreground">
              <strong className="text-foreground font-semibold">
                서비스명:
              </strong>{" "}
              Syncly Tab Extension ("Syncly")
            </div>
            <div className="flex justify-center items-center gap-2 text-sm md:text-base text-muted-foreground">
              <strong className="text-foreground font-semibold">운영자:</strong>{" "}
              Syncly 팀 (대표: 김희재)
            </div>
            <div className="flex justify-center items-center gap-2 text-sm md:text-base text-muted-foreground">
              <strong className="text-foreground font-semibold">연락처:</strong>{" "}
              syncly.smu@gmail.com
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="p-6 mb-12 bg-card border border-border border-l-4 border-l-accent rounded-lg leading-relaxed">
          본 개인정보처리방침은 당사가 제공하는 크롬 확장 프로그램 "Syncly Tab
          Extension"과 관련하여, 이용자의 개인정보 또는 개인정보에 해당할 수
          있는 정보(예: 방문 URL)에 대한 수집, 이용, 보관, 제공, 보호에 관한
          사항을 설명합니다.
        </div>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            1. 수집하는 정보와 방법
          </h2>

          <h3 className="text-xl font-semibold mb-4 mt-6">1) 수집 항목</h3>
          <ul className="space-y-3 mb-6">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">탭/URL 정보:</strong> 현재
              활성 탭의 URL, 페이지 제목, 수집 시각(타임스탬프)
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">확장 동작 로그(선택):</strong>{" "}
              확장 명령(SAVE_TABS/OPEN_LINKS/CHECK_TABS 등) 실행 시점과 결과
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">계정/인증(선택):</strong> JWT
              토큰(저장·전송 시 암호화), 워크스페이스/탭 ID(숫자 식별자)
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">기술 정보(선택):</strong>{" "}
              브라우저/OS 버전, 오류 로그(크래시/네트워크 실패 등)
            </li>
          </ul>
          <div className="bg-muted p-5 rounded-lg border-l-[3px] border-l-accent my-6 font-medium">
            ※ 당사는 민감정보(건강/정치/종교 등)를 수집·처리하지 않습니다. 다만
            URL에 민감한 키워드가 포함될 수 있으므로, 저장 전 미리 보시고 원치
            않는 URL은 제외하시기 바랍니다.
          </div>

          <h3 className="text-xl font-semibold mb-4 mt-6">2) 수집 방법</h3>
          <ul className="space-y-3">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              사용자가 확장 버튼 또는 UI에서 "저장" 등 기능을 실행할 때 브라우저
              권한(tabs)을 통해 현재 창의 URL을 읽습니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              사용 환경에 따라,
              <ul className="ml-8 mt-2 space-y-2">
                <li className="pl-7 relative">
                  <span className="absolute left-2 text-accent">-</span>
                  <strong className="text-foreground">로컬 모드:</strong>{" "}
                  브라우저 내 저장소(storage) 또는 세션 메모리에서만 처리
                </li>
                <li className="pl-7 relative">
                  <span className="absolute left-2 text-accent">-</span>
                  <strong className="text-foreground">
                    서버 연동 모드:
                  </strong>{" "}
                  https://api.syncly-io.com 백엔드 API로 전송
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            2. 이용 목적
          </h2>
          <ul className="space-y-3 mb-6">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              사용자가 선택한 탭/페이지 URL을 정리·보관하고, 이후 다시
              열기/검색/공유 기능 제공
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              동기화(워크스페이스/탭 분류) 및 팀 협업 기능 제공(선택)
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              서비스 품질 개선(에러 분석, 성능 최적화)
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              법적 의무 이행(보안, 로그 보관 등)
            </li>
          </ul>
          <div className="bg-muted p-5 rounded-lg border-l-[3px] border-l-accent font-medium">
            <strong>
              광고/프로파일링 목적의 URL 분석·판매를 하지 않습니다.
            </strong>
          </div>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            3. 처리 및 보관 기간
          </h2>
          <ul className="space-y-3">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">로컬 모드:</strong> 브라우저
              내 저장소에 보관되며, 사용자가 삭제 시 즉시 삭제됩니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">서버 연동 모드:</strong>{" "}
              워크스페이스/탭에 저장된 URL은 사용자가 삭제하거나 계정 삭제
              시점까지 보관합니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              법령상 보존 의무가 있는 경우(분쟁 해결/보안 로그 등) 해당 기간
              동안 최소한의 데이터만 별도 보관할 수 있습니다.
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            4. 제3자 제공 및 국외 이전
          </h2>
          <ul className="space-y-3 mb-4">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              당사는 원칙적으로 이용자 정보를 판매하거나 무단으로 제3자에게
              제공하지 않습니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              서비스 제공을 위해 다음 수탁업체를 이용할 수 있습니다:
              <ul className="ml-8 mt-2 space-y-2">
                <li className="pl-7 relative">
                  <span className="absolute left-2 text-accent">-</span>
                  <strong className="text-foreground">
                    호스팅/인프라:
                  </strong>{" "}
                  Amazon Web Services (AWS), 데이터가 저장·처리되는 지역:
                  한국(ap-northeast-2)
                </li>
                <li className="pl-7 relative">
                  <span className="absolute left-2 text-accent">-</span>
                  <strong className="text-foreground">
                    로그/모니터링:
                  </strong>{" "}
                  SigNoz
                </li>
              </ul>
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              국외 이전이 필요한 경우, 관련 법령(GDPR/개인정보보호법)에 따른
              적정성 결정/표준계약조항(SCC) 등을 준수합니다.
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            5. 이용자의 선택권과 통제
          </h2>
          <ul className="space-y-3">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">수집 동의 철회:</strong> 확장
              옵션에서 서버 동기화를 끄거나, 권한(탭 접근)을 해제할 수 있습니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">열람/정정/삭제:</strong>{" "}
              마이페이지/워크스페이스 UI에서 URL/탭을 직접 삭제할 수 있습니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">계정 삭제:</strong> [계정
              설정] → 계정 삭제를 요청하면 관련 서버 데이터는 지연 없이
              삭제되며, 법적 의무 보존분을 제외합니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">요청 방법:</strong> 아래
              연락처를 통해 접근권, 정정권, 삭제권, 처리 제한권 등을 행사할 수
              있습니다.
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            6. 보안조치
          </h2>
          <ul className="space-y-3">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">전송 구간 암호화:</strong>{" "}
              HTTPS/TLS
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">저장 암호화(서버):</strong>{" "}
              토큰·민감값 암호화/해싱
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">접근 통제:</strong> 최소 권한
              원칙, 접근 로그, 비정상 접근 탐지
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">개발/운영 보안:</strong> 키
              관리, 취약점 점검, 데이터 접근 승인 절차
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            7. 아동의 개인정보
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            본 서비스는 만 14세 미만(또는 거주지 법령상 미성년자)을 대상으로
            하지 않습니다. 해당 연령 미만으로 확인되는 경우 계정 제한 또는 즉시
            삭제될 수 있습니다.
          </p>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            8. 법적 근거
          </h2>
          <ul className="space-y-3">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              대한민국 「개인정보보호법」
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">GDPR(해당 시):</strong> 처리의
              법적 근거는 계약의 이행(서비스 제공), 동의, 정당한 이익(서비스
              품질/보안) 중 해당하는 범위입니다.
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">CCPA/CPRA(해당 시):</strong>{" "}
              당사는 개인정보를 판매하지 않으며, 공유(SHARE)하지 않습니다.
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            9. 권한 및 브라우저 정책 고지
          </h2>
          <ul className="space-y-3">
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">요청 권한:</strong> tabs,
              storage, host_permissions (api.syncly-io.com)
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">이용 목적:</strong> 탭 URL
              읽기/저장, 토큰 저장/조회, API 통신
            </li>
            <li className="pl-7 relative text-muted-foreground leading-relaxed">
              <span className="absolute left-2 text-accent font-bold text-xl">
                •
              </span>
              <strong className="text-foreground">
                Chrome Web Store 정책 준수:
              </strong>{" "}
              사용자 데이터는 기능 제공 외 목적으로 사용하지 않으며, 민감한
              범주의 제한 사용을 따릅니다.
            </li>
          </ul>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            10. 데이터 자동 수집 기술(쿠키 등)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            웹 대시보드(선택)를 이용할 경우 로그인 유지/보안 목적으로 쿠키·웹
            저장소를 사용할 수 있습니다. 브라우저 설정에서 차단할 수 있으나,
            일부 기능이 제한될 수 있습니다.
          </p>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            11. 개인정보 보호책임자 및 문의
          </h2>
          <div className="bg-muted/50 p-8 rounded-xl mb-4">
            <ul className="space-y-2 text-muted-foreground">
              <li className="py-2">
                <strong className="text-foreground inline-block min-w-[100px]">
                  책임자:
                </strong>{" "}
                김희재 (팀장)
              </li>
              <li className="py-2">
                <strong className="text-foreground inline-block min-w-[100px]">
                  이메일:
                </strong>{" "}
                syncly.smu@gmail.com
              </li>
              <li className="py-2">
                <strong className="text-foreground inline-block min-w-[100px]">
                  웹사이트:
                </strong>{" "}
                https://syncly-io.com
              </li>
              <li className="py-2">
                <strong className="text-foreground inline-block min-w-[100px]">
                  전화:
                </strong>{" "}
                이메일로 문의 바랍니다
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            개인정보 열람·정정·삭제·처리정지·이의제기 요청은 위 연락처로 보내
            주십시오.
          </p>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            12. 고지 및 개정
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            본 방침은 수시로 개정될 수 있으며, 중요한 변경이 있는 경우 앱 내
            공지/웹 공지 및 이메일로 고지합니다. 변경 사항은 공지일 또는 명시된
            시행일부터 효력이 발생합니다.
          </p>
        </section>

        <section className="bg-card p-10 mb-8 border border-border/50 rounded-2xl transition-colors hover:border-accent/50">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            부록 A. 데이터 항목별 보관/처리 요약
          </h2>
          <div className="overflow-x-auto my-8 rounded-xl border border-border">
            <table className="w-full border-collapse bg-card">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-center font-semibold text-sm border-b border-border">
                    항목
                  </th>
                  <th className="p-4 text-center font-semibold text-sm border-b border-border">
                    수집 시점
                  </th>
                  <th className="p-4 text-center font-semibold text-sm border-b border-border">
                    보관 위치
                  </th>
                  <th className="p-4 text-center font-semibold text-sm border-b border-border">
                    목적
                  </th>
                  <th className="p-4 text-center font-semibold text-sm border-b border-border">
                    보관 기간
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    활성 탭 URL/제목
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    저장 실행 시
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    로컬/서버
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    북마크/세션 저장
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    삭제 시까지
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    JWT 토큰
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    로그인/연동 시
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    Chrome Storage/서버
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    인증/인가
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    로그아웃 또는 만료
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    워크스페이스/탭 ID
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    저장/열람 시
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    서버
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    분류/동기화
                  </td>
                  <td className="p-4 text-center border-b border-border text-muted-foreground text-sm">
                    삭제 시까지
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-center text-muted-foreground text-sm">
                    실행 로그(선택)
                  </td>
                  <td className="p-4 text-center text-muted-foreground text-sm">
                    기능 사용 시
                  </td>
                  <td className="p-4 text-center text-muted-foreground text-sm">
                    서버
                  </td>
                  <td className="p-4 text-center text-muted-foreground text-sm">
                    오류 분석/보안
                  </td>
                  <td className="p-4 text-center text-muted-foreground text-sm">
                    90일
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
