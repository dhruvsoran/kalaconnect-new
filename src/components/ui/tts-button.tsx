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

interface TTSControlsProps {
  text: string;
  className?: string;
}

export function TTSControls({ text, className }: TTSControlsProps) {
  const { speak, stop, pause, resume, isSpeaking, rate, setRate, pitch, setPitch, volume, setVolume, voices, selectedVoice, setSelectedVoice } = useTTS();

  const handleSpeak = () => speak(text);
  const handleStop = () => stop();

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted/50 rounded-lg", className)}>
      <Button variant="outline" size="sm" onClick={handleSpeak} disabled={isSpeaking || !text.trim()}>
        <Volume2 className="h-4 w-4 mr-1" /> Speak
      </Button>
      <Button variant="outline" size="sm" onClick={handleStop} disabled={!isSpeaking}>
        <VolumeX className="h-4 w-4 mr-1" /> Stop
      </Button>
      
      {isSpeaking && (
        <>
          <Button variant="outline" size="icon" onClick={pause} aria-label="Pause">
            <span className="text-xs">⏸</span>
          </Button>
          <Button variant="outline" size="icon" onClick={resume} aria-label="Resume">
            <span className="text-xs">▶</span>
          </Button>
        </>
      )}

      <div className="flex items-center gap-1 ml-2 border-l pl-2">
        <label className="text-xs text-muted-foreground">Rate</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-20"
          aria-label="Speech rate"
        />
      </div>

      <div className="flex items-center gap-1 border-l pl-2">
        <label className="text-xs text-muted-foreground">Pitch</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-20"
          aria-label="Speech pitch"
        />
      </div>

      <div className="flex items-center gap-1 border-l pl-2">
        <label className="text-xs text-muted-foreground">Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20"
          aria-label="Speech volume"
        />
      </div>

      {voices.length > 1 && (
        <div className="border-l pl-2">
          <label className="text-xs text-muted-foreground">Voice</label>
          <select
            value={selectedVoice?.name || ""}
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
            className="text-xs bg-background border rounded px-2 py-1"
            aria-label="Select voice"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}