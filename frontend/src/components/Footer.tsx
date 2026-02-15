import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-semibold text-foreground">IsThisIdeaTaken</span>
          <span className="text-xs text-muted-foreground ml-2">Know before you build.</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link to="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>© 2026 IsThisIdeaTaken</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
