"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Goal } from "@prisma/client";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import DeleteGoalDialog from "./DeleteGoalDialog";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: Goal;
}

function GoalCard({ goal }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{goal.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Prazo: {format(new Date(goal.deadline), "dd/MM/yyyy")}
          </span>
          <DeleteGoalDialog
            goal={goal}
            trigger={
              <Button variant={"ghost"} size={"icon"}>
                <Trash className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Progresso: {progress.toFixed(0)}%
          </span>
          <span className="text-sm text-muted-foreground">
            {goal.currentAmount} / {goal.targetAmount}
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>
    </div>
  );
}

export default GoalCard;
