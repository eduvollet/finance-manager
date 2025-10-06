"use client";

import { Goal } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteGoal } from "../_actions/goals";

interface Props {
  trigger: React.ReactNode;
  goal: Goal;
}

function DeleteGoalDialog({ goal, trigger }: Props) {
  const goalIdentifier = `goal-${goal.id}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteGoal,
    onSuccess: async () => {
      toast.success("Meta deletada com sucesso", {
        id: goalIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
    },
    onError: () => {
      toast.error("Erro ao deletar meta", {
        id: goalIdentifier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá deletar a meta
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deletando meta...", {
                id: goalIdentifier,
              });
              deleteMutation.mutate(goal.id);
            }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteGoalDialog;