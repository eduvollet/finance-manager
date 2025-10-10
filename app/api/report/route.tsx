
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { ReportPdfDocument } from "@/app/(dashboard)/_components/ReportPdfDocument";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return new Response("Missing 'from' or 'to' date", { status: 400 });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "renda")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "gasto")
    .reduce((sum, t) => sum + t.amount, 0);

  const data = {
    transactions,
    from: fromDate,
    to: toDate,
    totalIncome,
    totalExpense,
  };

  try {
    const stream = await renderToStream(<ReportPdfDocument data={data} />);

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="relatorio_financeiro_${new Date().toISOString().split('T')[0]}.pdf"`,
    });

    return new Response(stream as any, { headers });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Error generating PDF", { status: 500 });
  }
}
