import { AlertCircle } from "lucide-react";
import { ReceiptSectionCard } from "./receipt-section-card";

interface ImportantNotesProps {
  notes: string[];
}

export function ImportantNotes({ notes }: ImportantNotesProps) {
  return (
    <ReceiptSectionCard title="Important Notes" subtitle="Terms & Conditions">
      <div className="space-y-0">
        {notes.map((note, index) => (
          <div
            key={index}
            className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0 print:border-gray-100"
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center print:bg-gray-100">
                <span className="text-[10px] font-bold text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
            <p className="text-[12px] text-gray-600 leading-relaxed">{note}</p>
          </div>
        ))}
      </div>
    </ReceiptSectionCard>
  );
}
