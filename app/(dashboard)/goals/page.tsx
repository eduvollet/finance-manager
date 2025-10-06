"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import CreateGoalDialog from "./_components/CreateGoalDialog";
import { useQuery } from "@tanstack/react-query";
import { Goal } from "@prisma/client";
import GoalCard from "./_components/GoalCard";

function GoalsPage() {
  const [showCreateGoalDialog, setShowCreateGoalDialog] = useState(false);

  const goalsQuery = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: () => fetch("/api/goals").then((res) => res.json()),
  });

  return (
    <>
      <CreateGoalDialog
        open={showCreateGoalDialog}
        setOpen={setShowCreateGoalDialog}
        onSuccess={() => goalsQuery.refetch()}
      />
      <div className="w-full p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Minhas Metas</h1>
          <Button
            variant={"outline"}
            className="gap-2"
            onClick={() => setShowCreateGoalDialog(true)}
          >
            <PlusSquare className="h-4 w-4" />
            Adicionar Meta
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goalsQuery.data?.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {goalsQuery.data?.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-lg text-muted-foreground">
              Você ainda não tem nenhuma meta.
            </p>
            <p className="text-sm text-muted-foreground">
              Crie uma nova meta para começar a acompanhar seus objetivos.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default GoalsPage;
