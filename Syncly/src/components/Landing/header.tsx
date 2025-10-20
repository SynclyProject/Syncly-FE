import { Button } from "../Landing/ui/button";
import { Link2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          <span className="text-xl font-bold">Syncly</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            기능
          </a>
          <a
            href="#solution"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            솔루션
          </a>
          <a
            href="#comparison"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            비교
          </a>
        </nav>
        <Button size="sm">무료로 시작하기</Button>
      </div>
    </header>
  );
}
