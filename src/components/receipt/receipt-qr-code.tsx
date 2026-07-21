"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface ReceiptQRCodeProps {
  bookingNumber: string;
  customerName: string;
  vehicle: string;
  pickupDate: string;
  returnDate: string;
}

export function ReceiptQRCode({
  bookingNumber,
  customerName,
  vehicle,
  pickupDate,
  returnDate,
}: ReceiptQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const qrData = JSON.stringify({
      booking: bookingNumber,
      customer: customerName,
      vehicle,
      pickup: pickupDate,
      return: returnDate,
    });

    QRCode.toCanvas(canvasRef.current, qrData, {
      width: 128,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    }).catch(() => {});
  }, [bookingNumber, customerName, vehicle, pickupDate, returnDate]);

  return (
    <div className="flex items-center gap-3">
      <canvas ref={canvasRef} className="rounded-lg" />
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
          Scan to verify
        </p>
        <p className="text-[11px] font-mono text-gray-500">{bookingNumber}</p>
      </div>
    </div>
  );
}
