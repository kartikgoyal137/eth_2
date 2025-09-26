"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingBar } from "@/components/loading-bar"
import { JudgePanel, type Result } from "@/components/judge-panel"

export default function JudgePage() {
  const [matchId, setMatchId] = React.useState("")
  const [status, setStatus] = React.useState<{ user1: boolean; user2: boolean; ready: boolean }>({
    user1: false,
    user2: false,
    ready: false,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [checks, setChecks] = React.useState({ u1: 0, u2: 0 })
  const [result, setResult] = React.useState<Result | null>(null)

  const fetchStatus = async () => {
    if (!matchId) return
    const res = await fetch(`/api/duel/status?matchId=${encodeURIComponent(matchId)}`)
    if (!res.ok) return
    const data = (await res.json()) as {
      user1Uploaded: boolean
      user2Uploaded: boolean
      resultReady: boolean
    }
    setStatus({ user1: data.user1Uploaded, user2: data.user2Uploaded, ready: data.resultReady })
  }

  const startCompare = async () => {
    if (!matchId) return
    setIsLoading(true)
    setResult(null)
    setChecks({ u1: 0, u2: 0 })

    const t1 = setTimeout(() => setChecks((c) => ({ ...c, u1: 1 })), 900)
    const t2 = setTimeout(() => setChecks((c) => ({ ...c, u2: 1 })), 1100)
    const t3 = setTimeout(() => setChecks((c) => ({ ...c, u1: 2 })), 1800)
    const t4 = setTimeout(() => setChecks((c) => ({ ...c, u2: 2 })), 2000)
    const t5 = setTimeout(() => setChecks((c) => ({ ...c, u1: 3 })), 2700)
    const t6 = setTimeout(() => setChecks((c) => ({ ...c, u2: 3 })), 2900)

    try {
      const fd = new FormData()
      fd.append("matchId", matchId)
      const res = await fetch("/api/duel/compare", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Compare failed")
      const data = (await res.json()) as Result
      setResult(data)
    } catch (e) {
      // no-op; keep result null
    } finally {
      setIsLoading(false)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      // refresh status
      fetchStatus()
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-balance text-3xl font-semibold">Judge</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the shared Match ID, verify both submissions, then run the comparison.
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Match</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Label htmlFor="matchj">Match ID</Label>
          <div className="flex items-center gap-2">
            <Input
              id="matchj"
              placeholder="Enter the same Match ID the users used"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
            />
            <Button variant="secondary" onClick={fetchStatus} disabled={!matchId || isLoading}>
              Refresh
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-md border p-3">
              <div className="font-medium">User 1</div>
              <div className={status.user1 ? "text-green-600" : "text-muted-foreground"}>
                {status.user1 ? "Uploaded" : "Waiting"}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="font-medium">User 2</div>
              <div className={status.user2 ? "text-green-600" : "text-muted-foreground"}>
                {status.user2 ? "Uploaded" : "Waiting"}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Button onClick={startCompare} disabled={!status.user1 || !status.user2 || isLoading}>
              {isLoading ? "Analyzing..." : "Start Comparison"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User 1 Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingBar direction="ltr" active={isLoading} checkpointsReached={checks.u1} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User 2 Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingBar direction="rtl" active={isLoading} checkpointsReached={checks.u2} />
            </CardContent>
          </Card>
        </section>
      )}

      {result && (
        <section className="mt-6">
          <JudgePanel result={result} />
        </section>
      )}
    </main>
  )
}
