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

  const stats = await getGoalsProgress(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetGoalsProgressResponseType = Awaited<
  ReturnType<typeof getGoalsProgress>
>;

async function getGoalsProgress(userId: string, from: Date, to: Date) {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      targetAmount: true,
    },
  });

  const transactions = await prisma.transaction.groupBy({
    by: ["goalId"],
    where: {
      userId,
      goalId: {
        in: goals.map((g) => g.id),
      },
      date: {
        gte: from,
        lte: endOfDay(to),
      },
      type: "renda",
    },
    _sum: {
      amount: true,
    },
  });

  const result = goals.map((goal) => {
    const transaction = transactions.find((t) => t.goalId === goal.id);
    return {
      ...goal,
      currentAmount: transaction?._sum.amount || 0,
    };
  });

  return result;
}
