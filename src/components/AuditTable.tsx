
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

type Audit = {
  id: number;
  date: string;
  testType: string;
  result: string;
  maintenanceNeeded: boolean;
  maintenanceScheduled: string | null;
  report: string | null;
  completed: boolean;
};

interface AuditTableProps {
  audits: Audit[];
  onMaintenanceChange: (id: number, checked: boolean) => void;
  onMaintenanceScheduleChange: (id: number, date: Date | undefined) => void;
  onFileUpload: (id: number, file: File) => void;
}

export function AuditTable({ audits, onMaintenanceChange, onMaintenanceScheduleChange, onFileUpload }: AuditTableProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, auditId: number) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(auditId, file);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type of Test</TableHead>
            <TableHead>Results</TableHead>
            <TableHead>Maintenance Needed</TableHead>
            <TableHead>Maintenance Scheduled</TableHead>
            <TableHead>Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell>{format(new Date(audit.date), "PPP")}</TableCell>
              <TableCell>{audit.testType}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    audit.result === "Passed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {audit.result}
                </span>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={audit.maintenanceNeeded}
                  onCheckedChange={(checked) => onMaintenanceChange(audit.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={
                        !audit.maintenanceScheduled ? "text-muted-foreground" : ""
                      }
                      disabled={!audit.maintenanceNeeded}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {audit.maintenanceScheduled
                        ? format(new Date(audit.maintenanceScheduled), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        audit.maintenanceScheduled
                          ? new Date(audit.maintenanceScheduled)
                          : undefined
                      }
                      onSelect={(date) => onMaintenanceScheduleChange(audit.id, date)}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                {audit.report ? (
                  <Button variant="ghost" size="sm" onClick={() => window.open(audit.report!, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                ) : (
                  <div className="flex items-center">
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, audit.id)}
                      className="hidden"
                      id={`file-upload-${audit.id}`}
                    />
                    <label htmlFor={`file-upload-${audit.id}`}>
                      <Button variant="ghost" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Report
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
