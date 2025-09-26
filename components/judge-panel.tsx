import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type Result = {
  user1: { name: string; scores: { quality: number; performance: number; style: number }; total: number }
  user2: { name: string; scores: { quality: number; performance: number; style: number }; total: number }
  decision: "User 1" | "User 2" | "Tie"
}

export function JudgePanel({ result }: { result: Result }) {
  const { user1, user2, decision } = result
  const scoreRow = (label: string, a: number, b: number) => (
    <div className="grid grid-cols-3 gap-4 text-sm" key={label}>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-mono">{a}</div>
      <div className="font-mono">{b}</div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-balance">Judge Decision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div />
          <div className="font-medium">User 1</div>
          <div className="font-medium">User 2</div>
        </div>
        <div className="rounded-md border p-4">
          <div className="mb-2 grid grid-cols-3 gap-4 text-sm">
            <div className="text-muted-foreground">Submission</div>
            <div className="truncate">{user1.name}</div>
            <div className="truncate">{user2.name}</div>
          </div>
          {scoreRow("Quality", user1.scores.quality, user2.scores.quality)}
          {scoreRow("Performance", user1.scores.performance, user2.scores.performance)}
          {scoreRow("Style", user1.scores.style, user2.scores.style)}
          <div className="mt-3 grid grid-cols-3 gap-4 border-t pt-3 text-sm">
            <div className="font-medium">Total</div>
            <div className="font-mono">{user1.total}</div>
            <div className="font-mono">{user2.total}</div>
          </div>
        </div>

        <div className="rounded-md border bg-card p-4">
          <p className="text-pretty text-center text-lg">
            Decision: <span className="font-semibold">{decision}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
