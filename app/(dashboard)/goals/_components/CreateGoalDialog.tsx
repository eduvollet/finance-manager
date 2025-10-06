"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoalSchema, GoalSchemaType } from "@/schema/goals";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateGoal } from "../_actions/goals";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface CreateGoalDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

function CreateGoalDialog({ open, setOpen, onSuccess }: CreateGoalDialogProps) {
  const form = useForm<GoalSchemaType>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      deadline: new Date(),
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateGoal,
    onSuccess: async (data: any) => {
      toast.success(`Meta '${data.name}' criada com sucesso! 🎉`);
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Algo deu errado ao criar a meta.");
    },
  });

  const onSubmit = useCallback(
    (values: GoalSchemaType) => {
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar uma nova
            <span className={cn("m-1", "text-emerald-500")}>Meta</span>
          </DialogTitle>
          <DialogDescription>
            Metas são uma ótima forma de organizar suas finanças.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Comprar um notebook" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Alvo</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => {
              form.reset();
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Criar"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGoalDialog;
