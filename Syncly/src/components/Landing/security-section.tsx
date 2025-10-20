import { Shield } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent/10 mb-6">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            기업 수준의 보안과 성능
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Syncly는 팀이 안정적으로 협업할 수 있도록 엔터프라이즈 보안과 빠른
            퍼포먼스를 기본으로 제공합니다. 팀의 성장과 미래를 함께합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
