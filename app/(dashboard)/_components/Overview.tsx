"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@/lib/generated/prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";
import GoalsStats from "./GoalsStats";

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2 p-8">
        <h2 className="text-3xl font-bold">Visão Geral</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `O tempo de comparação não pode ser maior que ${MAX_DATE_RANGE_DAYS} dias`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <StatsCards
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />

      <CategoriesStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />

      <GoalsStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
    </>
  );
}

export default Overview;
