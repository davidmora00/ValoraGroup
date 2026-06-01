import {
  RefreshCw,
  MessagesSquare,
  MoonStar,
  Unplug,
  Timer,
  Repeat2,
  Bot,
  TrendingUp,
  Workflow,
  Network,
  FileSearch,
  Puzzle,
  Target,
  Layers,
  Boxes,
  Gauge,
  Sparkles,
  MonitorSmartphone,
  Building2,
  Globe,
  Code,
  Cpu,
  Languages,
  ShieldCheck,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

// String -> icon component map. Content (messages/*.json) references icons by
// name; this keeps the JSON free of imports and guards against typos by falling
// back to a neutral icon instead of crashing.
const MAP: Record<string, ComponentType<LucideProps>> = {
  RefreshCw,
  MessagesSquare,
  MoonStar,
  Unplug,
  Timer,
  Repeat2,
  Bot,
  TrendingUp,
  Workflow,
  Network,
  FileSearch,
  Puzzle,
  Target,
  Layers,
  Boxes,
  Gauge,
  Sparkles,
  MonitorSmartphone,
  Building2,
  Globe,
  Code,
  Cpu,
  Languages,
  ShieldCheck,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
