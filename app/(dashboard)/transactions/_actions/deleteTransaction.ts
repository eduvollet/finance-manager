"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
  if (!transaction) {
    throw new Error("bad request");
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    await prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "gasto" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "renda" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    });

    await prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "gasto" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "renda" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    });

    if (transaction.type === "renda" && transaction.goalId) {
      await prisma.goal.update({
        where: {
          id: transaction.goalId,
          userId: user.id,
        },
        data: {
          currentAmount: {
            decrement: transaction.amount,
          },
        },
      });
    }
  });

  revalidatePath("/goals");
}
