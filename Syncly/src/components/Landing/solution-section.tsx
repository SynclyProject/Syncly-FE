import { CheckCircle2 } from "lucide-react";

export function SolutionSection() {
  return (
    <section id="solution" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            싱클리에서 모두 연결됩니다.
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-8">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">하나의 워크스페이스</h3>
                <p className="text-muted-foreground leading-relaxed">
                  싱클리에서는 모든 게 연결되어 있습니다. 하나의
                  워크스페이스에서 URL, 노트, 채팅, 화상통화를 동시에 관리할 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">직관적인 대시보드</h3>
                <p className="text-muted-foreground leading-relaxed">
                  간결한 대시보드에서 탭(링크, 회의록, 채팅, 화면 공유) 간
                  전환이 직관적이고 빠릅니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
