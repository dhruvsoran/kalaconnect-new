"use client";

import { useTTS } from "@/hooks/use-tts";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TTSButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function TTSButton({ text, className, variant = "ghost", size = "icon" }: TTSButtonProps) {
  const { speak, stop, isSpeaking } = useTTS();

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(className, isSpeaking && "text-primary")}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
      disabled={!text.trim()}
    >
      {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );
}

