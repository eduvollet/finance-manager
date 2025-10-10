"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ReactNode, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface Props {
  trigger: ReactNode;
}

export function ReportDialog({ trigger }: Props) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDownload = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Por favor, selecione um período para o relatório.");
      return;
    }

    toast.loading("Gerando relatório...", { id: "report-toast" });

    try {
      const url = `/api/report?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Falha ao gerar o relatório.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Relatório baixado com sucesso!", { id: "report-toast" });
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar o relatório.", { id: "report-toast" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Relatório em PDF</DialogTitle>
          <DialogDescription>
            Selecione o período desejado para gerar o relatório de transações.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Período:</span>
              <DateRangePicker onUpdate={(values) => setDateRange(values.range)} />
            </div>
          </div>
        </div>
        <Button onClick={handleDownload} className="w-full">
          Download do Relatório
        </Button>
      </DialogContent>
    </Dialog>
  );
}