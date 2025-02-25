
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";
import { Audit } from "@/types/audit";

interface AuditStatsProps {
  audits: Audit[];
}

export function AuditStats({ audits }: AuditStatsProps) {
  const totalAudits = audits.length;
  const passedAudits = audits.filter((audit) => audit.result === "Passed").length;
  const failedAudits = audits.filter((audit) => audit.result === "Failed").length;
  const pendingMaintenance = audits.filter(
    (audit) => audit.maintenance_needed && !audit.maintenance_scheduled
  ).length;

  const stats = [
    {
      title: "Pass Rate",
      value: totalAudits ? Math.round((passedAudits / totalAudits) * 100) : 0,
      unit: "%",
      icon: CheckCircle,
      description: "Of all audits passed",
      className: "text-green-500",
    },
    {
      title: "Failed Tests",
      value: failedAudits,
      icon: AlertCircle,
      description: "Tests requiring attention",
      className: "text-red-500",
    },
    {
      title: "Scheduled",
      value: audits.filter((a) => a.maintenance_scheduled).length,
      icon: Calendar,
      description: "Maintenance appointments",
      className: "text-blue-500",
    },
    {
      title: "Pending",
      value: pendingMaintenance,
      icon: Clock,
      description: "Awaiting scheduling",
      className: "text-yellow-500",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value}
              {stat.unit}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
