import React from "react";
import { Spinner } from "@/components/ui/spinner";

const FullScreenLoader: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3">
    <Spinner className="size-6" />
    <p className="text-muted-foreground text-sm">正在加载...</p>
  </div>
);

export default FullScreenLoader;
