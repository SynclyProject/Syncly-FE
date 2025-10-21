export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="h-10 w-10" />
            <span className="font-bold">Syncly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Syncly. 모든 권리 보유
          </p>
          <a
            href="/privacy-policy"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}
