"use client";

import { GetGoalsProgressResponseType } from "@/app/api/stats/goals-progress/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSettings } from "@/lib/generated/prisma/client";
import { DateToUTC, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function GoalsStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetGoalsProgressResponseType>({
    queryKey: ["overview", "stats", "goals-progress", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/goals-progress?from=${DateToUTC(from)}&to=${DateToUTC(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap py-6 px-8">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <GoalsCard formatter={formatter} data={statsQuery.data || []} />
      </SkeletonWrapper>
    </div>
  );
}

export default GoalsStats;

function GoalsCard({
  data,
  formatter,
}: {
  formatter: Intl.NumberFormat;
  data: GetGoalsProgressResponseType;
}) {
  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle
          className="grid grid-flow-row justify-between
        gap-2 text-muted-foreground md:grid-flow-col"
        >
          Progresso das Metas
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {data.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            Sem metas para o período selecionado.
            <p className="text-sm text-muted-foreground">
              Tente seleconar um período diferente ou tente adicionar uma nova meta.
            </p>
          </div>
        )}

        {data.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {data.map((item) => {
                const percentage = (item.currentAmount * 100) / item.targetAmount;

                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center !text-gray-400">
                        {item.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(2)}%)
                        </span>
                      </span>
                      <span className="text-sm !text-gray-400">
                        {formatter.format(item.currentAmount)} /{" "}
                        {formatter.format(item.targetAmount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator="!bg-yellow-500"
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
