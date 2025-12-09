import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';

export const CreepyButton = () => {
  return (
    <Link
      to="/live-sports"
      className="group relative inline-flex items-center justify-center overflow-hidden border-2 border-foreground bg-background px-8 py-4 font-bold transition-all hover:bg-foreground hover:text-background"
    >
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="animate-ping absolute h-full w-full bg-foreground/20" />
      </span>
      <span className="relative flex items-center gap-3">
        <Radio className="h-6 w-6 animate-pulse" />
        <span className="text-lg tracking-wider uppercase">Live Sports</span>
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping bg-destructive opacity-75" />
          <span className="relative inline-flex h-3 w-3 bg-destructive" />
        </span>
      </span>
    </Link>
  );
};
