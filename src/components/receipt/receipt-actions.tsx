"use client";

import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReceiptActions() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="receipt-actions no-print flex items-center justify-end gap-3 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-1.5"
      >
        <Printer className="w-4 h-4" strokeWidth={1.5} />
        Print
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={handleDownloadPDF}
        className="gap-1.5"
      >
        <Download className="w-4 h-4" strokeWidth={1.5} />
        Download PDF
      </Button>
    </div>
  );
}
