"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface UploadPanelProps {
  title: string
  useText: boolean
  setUseText: (v: boolean) => void
  onFileChange: (file: File | null) => void
  onTextChange: (text: string) => void
  disabled?: boolean
  side?: "left" | "right"
}

export function UploadPanel({
  title,
  useText,
  setUseText,
  onFileChange,
  onTextChange,
  disabled,
  side = "left",
}: UploadPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <Card className={cn("border-border", side === "right" ? "md:order-3" : "md:order-1")}>
      <CardHeader>
        <CardTitle className="text-balance">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Paste text instead</Label>
          <button
            type="button"
            className={cn(
              "inline-flex h-6 w-11 items-center rounded-full border border-input",
              useText ? "bg-primary" : "bg-muted",
            )}
            aria-pressed={useText}
            onClick={() => setUseText(!useText)}
            disabled={disabled}
          >
            <span
              className={cn(
                "mx-1 h-4 w-4 rounded-full bg-background transition-transform",
                useText ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>

        {!useText ? (
          <div className="space-y-2">
            <Label htmlFor={`${title}-file`} className="text-sm">
              Upload codebase (zip or text file)
            </Label>
            <Input
              id={`${title}-file`}
              ref={fileInputRef}
              type="file"
              accept=".zip,.txt,.js,.ts,.tsx,.json"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              disabled={disabled}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`${title}-text`} className="text-sm">
              Paste code (plain text)
            </Label>
            <textarea
              id={`${title}-text`}
              className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 focus:ring-2"
              placeholder="Paste your code here..."
              onChange={(e) => onTextChange(e.target.value)}
              disabled={disabled}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
