import { useMemo } from "react";
import { Loader2, Pause } from "lucide-react";

export function ActionHeading({
  title,
  isFetching,
  isLoading,
  isPaused,
  children,
}: {
  title: string;
  isFetching?: boolean;
  isLoading?: boolean;
  isPaused?: boolean;
  children: React.ReactNode;
}) {
  const stateString = useMemo(() => {
    if (isFetching) return "Updating...";
    if (isLoading) return "Loading...";
    if (isPaused) return "Paused";
    return null;
  }, [isFetching, isLoading, isPaused]);

  const icon = useMemo(() => {
    if (isFetching) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isPaused) return <Pause className="h-4 w-4" />;
    return null;
  }, [isFetching, isLoading, isPaused]);

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {stateString}
      </div>
      {children}
    </div>
  );
}
