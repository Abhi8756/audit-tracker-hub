
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
import { Audit } from "@/types/audit";

interface AuditTableProps {
  audits: Audit[];
  onMaintenanceChange: (id: number, checked: boolean) => void;
  onMaintenanceScheduleChange: (id: number, date: string | null) => void;
}

export function AuditTable({ audits, onMaintenanceChange, onMaintenanceScheduleChange }: AuditTableProps) {
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
              <TableCell>{audit.test_type}</TableCell>
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
                  checked={audit.maintenance_needed}
                  onCheckedChange={(checked) => onMaintenanceChange(audit.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={
                        !audit.maintenance_scheduled ? "text-muted-foreground" : ""
                      }
                      disabled={!audit.maintenance_needed}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {audit.maintenance_scheduled
                        ? format(new Date(audit.maintenance_scheduled), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        audit.maintenance_scheduled
                          ? new Date(audit.maintenance_scheduled)
                          : undefined
                      }
                      onSelect={(date) => 
                        onMaintenanceScheduleChange(audit.id, date ? date.toISOString().split('T')[0] : null)
                      }
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                {audit.report_url ? (
                  <Button variant="ghost" size="sm" onClick={() => window.open(audit.report_url!, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                ) : (
                  <div className="flex items-center">
                    <label className="cursor-pointer">
                      <Button variant="ghost" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Report
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
