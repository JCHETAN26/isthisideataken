import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-black">
            IT
          </div>
          <span className="text-sm font-semibold text-foreground">IdeaTaken</span>
          <span className="text-xs text-muted-foreground ml-2">Know before you build.</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>© 2026 IdeaTaken</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
