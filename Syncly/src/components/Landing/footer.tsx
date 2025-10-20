import { Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            <span className="font-bold">Syncly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Syncly. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  );
}
