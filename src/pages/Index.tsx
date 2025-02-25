import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { SidebarNav } from "@/components/SidebarNav";
import { AuditTable } from "@/components/AuditTable";
import { AuditStats } from "@/components/AuditStats";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditService } from "@/services/auditService";
import type { Audit } from "@/types/audit";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("ongoing");
  const [newAudit, setNewAudit] = useState({
    test_type: "",
    result: "Passed",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: audits = [] } = useQuery({
    queryKey: ['audits'],
    queryFn: auditService.getAudits,
  });

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
      setIsDialogOpen(false);
      setNewAudit({ test_type: "", result: "Passed" });
      setSelectedFile(null);
    },
  });

  const updateAuditMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Audit> }) => {
      return auditService.updateAudit(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
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

  const handleMaintenanceChange = (id: number, checked: boolean) => {
    updateAuditMutation.mutate({
      id,
      updates: { maintenance_needed: checked }
    });
  };

  const handleMaintenanceScheduleChange = (id: number, date: Date | undefined) => {
    updateAuditMutation.mutate({
      id,
      updates: { maintenance_scheduled: date?.toISOString().split('T')[0] || null }
    });
  };

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch = 
      audit.test_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.result.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || audit.result.toLowerCase() === statusFilter.toLowerCase();
    const matchesTab = currentTab === "ongoing" ? !audit.completed : audit.completed;
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarNav />
        <div className="flex-1 space-y-8 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight heading-gradient">Audit Maintenance</h2>
            <div className="flex items-center space-x-2">
              <SearchBar onSearch={setSearchQuery} />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Tabs defaultValue={currentTab} className="w-[400px]" onValueChange={setCurrentTab}>
                <TabsList>
                  <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <AuditStats audits={filteredAudits} />
            </div>

            <div className="rounded-md border">
              <AuditTable 
                audits={filteredAudits}
                onMaintenanceChange={handleMaintenanceChange}
                onMaintenanceScheduleChange={handleMaintenanceScheduleChange}
                onFileUpload={handleFileUpload}
              />
            </div>

            <Button 
              className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => window.open('https://chat.openai.com', '_blank')}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
