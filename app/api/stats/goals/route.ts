import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { endOfDay } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const stats = await getGoalsStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetGoalsStatsResponseType = Awaited<
  ReturnType<typeof getGoalsStats>
>;

async function getGoalsStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.aggregate({
    where: {
      userId,
      date: {
        gte: from,
        lte: endOfDay(to),
      },
      goalId: {
        not: null,
      },
      type: "renda",
    },
    _sum: {
      amount: true,
    },
  });

  return {
    goals: totals._sum.amount || 0,
  };
}
