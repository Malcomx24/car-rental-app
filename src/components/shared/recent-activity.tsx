"use client";

import {
  Clock,
  UserPlus,
  Car,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "booking" | "payment" | "user" | "car" | "alert" | "success";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const recentActivityData: ActivityItem[] = [
  {
    id: "1",
    type: "booking",
    title: "New booking confirmed",
    description: "BMW 3 Series reserved by John Smith",
    timestamp: "2 minutes ago",
    user: "John Smith",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment received",
    description: "$1,247.50 payment for booking #BR-2024-0847",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "user",
    title: "New customer registered",
    description: "Sarah Johnson created an account",
    timestamp: "1 hour ago",
    user: "Sarah Johnson",
  },
  {
    id: "4",
    type: "car",
    title: "Vehicle maintenance scheduled",
    description: "Porsche 911 Carrera — Oil change due",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "alert",
    title: "Insurance expiring soon",
    description: "3 vehicles have insurance expiring within 30 days",
    timestamp: "3 hours ago",
  },
  {
    id: "6",
    type: "success",
    title: "Booking completed",
    description: "Tesla Model S returned by Mike Davis",
    timestamp: "4 hours ago",
    user: "Mike Davis",
  },
  {
    id: "7",
    type: "payment",
    title: "Refund processed",
    description: "$350.00 refund for cancelled booking #BR-2024-0831",
    timestamp: "5 hours ago",
  },
  {
    id: "8",
    type: "car",
    title: "Vehicle status updated",
    description: "Range Rover Sport marked as Available",
    timestamp: "6 hours ago",
  },
];

const iconMap = {
  booking: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
  payment: <CreditCard className="h-4 w-4 text-emerald-500" />,
  user: <UserPlus className="h-4 w-4 text-violet-500" />,
  car: <Car className="h-4 w-4 text-amber-500" />,
  alert: <AlertTriangle className="h-4 w-4 text-red-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

const bgMap = {
  booking: "bg-blue-500/10",
  payment: "bg-emerald-500/10",
  user: "bg-violet-500/10",
  car: "bg-amber-500/10",
  alert: "bg-red-500/10",
  success: "bg-emerald-500/10",
};

interface RecentActivityProps {
  data?: ActivityItem[];
}

export function RecentActivity({ data = recentActivityData }: RecentActivityProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest events and actions</p>
        </div>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className={`mt-0.5 rounded-lg p-2 ${bgMap[item.type]}`}>
                {iconMap[item.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
