import { Button } from "../Landing/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-balance mb-6">
            모든 파일과 링크를
            <br />
            <span className="text-foreground">연결하다</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed">
            Syncly는 URL, 파일, 회의록, 화상통화, 채팅을 한 곳에서 실시간으로
            관리, 공유, 실행하는 스마트 협업 플랫폼입니다.
          </p>
          <Button
            size="lg"
            className="gap-2 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            무료로 시작하기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-accent" />
        </div>
      </div>
    </section>
  );
}
