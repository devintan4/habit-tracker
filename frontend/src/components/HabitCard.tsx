import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { HabitDto } from "../types/habit";

export default function HabitCard({ habit }: { habit: HabitDto }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Frequency: {habit.frequency}×/day</p>
        <p>
          Streak: {habit.currentStreak} (longest {habit.longestStreak})
        </p>
      </CardContent>
      <div className="p-4 pt-0 flex justify-end">
        <Button variant="link" size="sm" asChild>
          <a href={`/habits/${habit.id}`}>View →</a>
        </Button>
      </div>
    </Card>
  );
}
