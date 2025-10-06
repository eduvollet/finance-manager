"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Goal } from "@/lib/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onChange: (value: string) => void;
}

function GoalPicker({ onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const goalsQuery = useQuery<Goal[]>({
    queryKey: ["goals", "active"],
    queryFn: () => fetch(`/api/goals`).then((res) => res.json()),
  });

  const selectedGoal = goalsQuery.data?.find((goal) => goal.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedGoal ? (
            <GoalRow goal={selectedGoal} />
          ) : (
            "Selecione uma meta"
          )}
          <ChevronsUpDown className="ml-s h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Pesquisar meta..." />
          <CommandEmpty>
            <p>Nenhuma meta encontrada</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {goalsQuery.data &&
                goalsQuery.data.map((goal) => (
                  <CommandItem
                    key={goal.id}
                    onSelect={() => {
                      setValue(goal.id);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <GoalRow goal={goal} />
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === goal.id && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default GoalPicker;

function GoalRow({ goal }: { goal: Goal }) {
  return (
    <div className="flex items-center gap-2">
      <span>{goal.name}</span>
    </div>
  );
}