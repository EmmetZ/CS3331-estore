import React from "react";
import { Button } from "@/components/ui/button";

export interface Props {
  message: string;
  onRetry: () => void;
}

const FullScreenError: React.FC<Props> = ({ message, onRetry }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
    <div>
      <p className="text-xl font-semibold">无法加载用户信息</p>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
    <Button onClick={onRetry}>重试</Button>
  </div>
);

export default FullScreenError;
