
import { Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AuditCardProps {
  title: string;
  status: "ongoing" | "completed" | "scheduled";
  progress: number;
  date: string;
  testType: string;
}

export function AuditCard({ title, status, progress, date, testType }: AuditCardProps) {
  const statusColors = {
    ongoing: "text-blue-500",
    completed: "text-green-500",
    scheduled: "text-orange-500",
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Circle className={`h-3 w-3 fill-current ${statusColors[status]}`} />
          <span className="text-sm text-muted-foreground capitalize">{status}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Test Type</p>
              <p className="font-medium">{testType}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
