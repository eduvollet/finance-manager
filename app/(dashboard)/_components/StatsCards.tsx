"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { UserSettings } from "@/lib/generated/prisma/client";
import { DateToUTC, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTC(from)}&to=${DateToUTC(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap py-6 px-8">
      <SkeletonWrapper isLoading={!statsQuery.data}>
        <StatsCard
          formatter={formatter}
          value={income}
          title="Renda"
          icon={
            <TrendingUp
              className="h-12 w-12 items-center rounded-lg p-2 !text-emerald-500 
              !bg-emerald-400/10"
            />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={!statsQuery.data}>
        <StatsCard
          formatter={formatter}
          value={expense}
          title="Gastos"
          icon={
            <TrendingDown
              className="h-12 w-12 items-center rounded-lg p-2 !text-red-500 
              !bg-red-400/10"
            />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={!statsQuery.data}>
        <StatsCard
          formatter={formatter}
          value={balance}
          title="Saldo"
          icon={
            <Wallet
              className="h-12 w-12 items-center  rounded-lg p-2 !text-violet-500 
              !bg-violet-400/10"
            />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatsCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-center gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
