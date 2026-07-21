import { Mail, Phone, Globe, Heart } from "lucide-react";
import type { ReceiptCompany } from "./receipt-data";

interface ReceiptFooterProps {
  company: ReceiptCompany;
}

export function ReceiptFooter({ company }: ReceiptFooterProps) {
  return (
    <footer className="receipt-footer">
      {/* Top Divider */}
      <div className="border-t border-gray-200 print:border-gray-200 mb-5" />

      {/* Thank You Message */}
      <div className="text-center mb-4">
        <p className="text-[13px] text-gray-500 font-medium">
          Thank you for choosing{" "}
          <span className="font-semibold text-black">{company.name}</span>.
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          For assistance, please contact us:
        </p>
      </div>

      {/* Contact Info */}
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <a
          href={`mailto:${company.email}`}
          className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-black transition-colors no-underline"
        >
          <Mail className="w-3 h-3" strokeWidth={2} />
          {company.email}
        </a>
        <a
          href={`tel:${company.phone}`}
          className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-black transition-colors no-underline"
        >
          <Phone className="w-3 h-3" strokeWidth={2} />
          {company.phone}
        </a>
        <a
          href={`https://${company.website}`}
          className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-black transition-colors no-underline"
        >
          <Globe className="w-3 h-3" strokeWidth={2} />
          {company.website}
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4 pt-4 border-t border-gray-100 print:border-gray-100">
        <p className="text-[10px] text-gray-300 flex items-center justify-center gap-1">
          &copy; 2026 {company.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
