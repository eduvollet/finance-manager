import { GetActiveGoals } from "@/app/(dashboard)/goals/_actions/goals";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const goals = await GetActiveGoals();

  return NextResponse.json(goals);
}