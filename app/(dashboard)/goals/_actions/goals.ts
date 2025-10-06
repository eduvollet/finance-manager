"use server";

import { GoalSchema } from "@/schema/goals";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function CreateGoal(form: any) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsedBody = GoalSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const { name, targetAmount, deadline } = parsedBody.data;

  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      name,
      targetAmount,
      deadline,
    },
  });

  return goal;
}

export async function DeleteGoal(id: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.goal.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  return { success: true };
}

export async function GetActiveGoals() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const goals = await prisma.goal.findMany({
    where: {
      userId: user.id,
      deadline: {
        gte: new Date(),
      },
    },
  });

  return goals;
}
