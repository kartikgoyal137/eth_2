"use client"

import * as React from "react"
import { UploadPanel } from "@/components/upload-panel"
import { LoadingBar } from "@/components/loading-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function User2Page() {
  const [matchId, setMatchId] = React.useState("")
  const [useText, setUseText] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [text, setText] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)
  const [checkpoints, setCheckpoints] = React.useState(0)
  const [done, setDone] = React.useState(false)

  const canSubmit = !!matchId && ((useText && text.trim()) || (!useText && file))

  const submit = async () => {
    if (!canSubmit) return
    setDone(false)
    setIsUploading(true)
    setCheckpoints(0)

    const t1 = setTimeout(() => setCheckpoints(1), 900)
    const t2 = setTimeout(() => setCheckpoints(2), 1800)
    const t3 = setTimeout(() => setCheckpoints(3), 2700)

    try {
      const fd = new FormData()
      fd.append("matchId", matchId)
      fd.append("role", "user2")
      if (useText) fd.append("text", text)
      else if (file) fd.append("file", file)

      const res = await fetch("/api/duel/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Upload failed")
      setDone(true)
    } catch (e) {
      setDone(false)
    } finally {
      setIsUploading(false)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-balance text-3xl font-semibold">User 2 Upload</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the shared Match ID, upload your code, then wait for the judge.
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Match</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Label htmlFor="match2">Match ID (share this with User 1 and the Judge)</Label>
          <Input
            id="match2"
            placeholder="e.g. demo-123 or any string"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
          />
        </CardContent>
      </Card>

      <UploadPanel
        title="User 2"
        useText={useText}
        setUseText={setUseText}
        onFileChange={setFile}
        onTextChange={setText}
        disabled={isUploading}
        side="right"
      />

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={submit} disabled={!canSubmit || isUploading}>
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
        {done && <span className="text-sm text-muted-foreground">Uploaded. Waiting for judge...</span>}
      </div>

      {isUploading && (
        <div className="mt-6">
          <LoadingBar direction="rtl" active={isUploading} checkpointsReached={checkpoints} />
        </div>
      )}
    </main>
  )
}
