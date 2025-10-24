import { AlertCircle } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            협업은 단순해야 합니다.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Note, URL, Chat, Video, File 등 여러 도구들을 한 곳에서 연결해
            보세요.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">
                팀의 협업, 여기저기 흩어져 있나요?
              </h3>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                팀원들은 슬랙에서 얘기하고, 줌에서 회의하며, 노션에서 문서를
                작성하고, 드라이브에서 파일을 찾고 있지 않나요?
              </p>
              <p>
                각각의 앱이 흩어져 있으면 커뮤니케이션은 단절되고 업무의 흐름이
                자주 멈춥니다.
              </p>
              <p className="font-medium text-foreground">
                Syncly는 Slack, Zoom, Notion, Drive 앱을 한 공간에서 연결하는
                문제를 해결합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
