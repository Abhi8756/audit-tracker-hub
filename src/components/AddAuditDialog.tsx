
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auditService } from "@/services/auditService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import type { Audit } from "@/types/audit";

export function AddAuditDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [newAudit, setNewAudit] = useState({
    test_type: "",
    result: "Passed",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAuditMutation = useMutation({
    mutationFn: async (audit: Omit<Audit, 'id' | 'created_at'>) => {
      return auditService.createAudit(audit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      toast({
        title: "Success",
        description: "New audit has been created",
      });
      setIsOpen(false);
      setNewAudit({ test_type: "", result: "Passed" });
      setSelectedFile(null);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddAudit = async () => {
    if (!newAudit.test_type) {
      toast({
        title: "Error",
        description: "Please enter a test type",
        variant: "destructive",
      });
      return;
    }

    try {
      let report_url = null;
      if (selectedFile) {
        report_url = await auditService.uploadReport(selectedFile);
      }

      const audit = {
        date: new Date().toISOString().split('T')[0],
        test_type: newAudit.test_type,
        result: newAudit.result,
        maintenance_needed: newAudit.result === "Failed",
        maintenance_scheduled: null,
        report_url,
        completed: false,
      };

      await createAuditMutation.mutateAsync(audit);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create audit",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Audit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Audit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Test Type</label>
            <Input
              value={newAudit.test_type}
              onChange={(e) => setNewAudit({ ...newAudit, test_type: e.target.value })}
              placeholder="Enter test type..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Result</label>
            <Select
              value={newAudit.result}
              onValueChange={(value) => setNewAudit({ ...newAudit, result: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Upload Report</label>
            <Input
              type="file"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>
          <Button onClick={handleAddAudit} className="w-full">Add Audit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
