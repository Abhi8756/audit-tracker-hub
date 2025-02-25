
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { SidebarNav } from "@/components/SidebarNav";
import { AuditTable } from "@/components/AuditTable";
import { AuditStats } from "@/components/AuditStats";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditService } from "@/services/auditService";
import { AddAuditDialog } from "@/components/AddAuditDialog";
import { AuditFilters } from "@/components/AuditFilters";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("ongoing");
  const queryClient = useQueryClient();

  const { data: audits = [] } = useQuery({
    queryKey: ['audits'],
    queryFn: auditService.getAudits,
  });

  const updateAuditMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Audit> }) => {
      return auditService.updateAudit(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
  });

  const handleMaintenanceChange = (id: number, checked: boolean) => {
    updateAuditMutation.mutate({
      id,
      updates: { maintenance_needed: checked }
    });
  };

  const handleMaintenanceScheduleChange = (id: number, date: string | null) => {
    updateAuditMutation.mutate({
      id,
      updates: { maintenance_scheduled: date }
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
              <AddAuditDialog />
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-4">
            <AuditFilters
              currentTab={currentTab}
              statusFilter={statusFilter}
              onTabChange={setCurrentTab}
              onStatusFilterChange={setStatusFilter}
              onSearchChange={setSearchQuery}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <AuditStats audits={filteredAudits} />
            </div>

            <div className="rounded-md border">
              <AuditTable 
                audits={filteredAudits}
                onMaintenanceChange={handleMaintenanceChange}
                onMaintenanceScheduleChange={handleMaintenanceScheduleChange}
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
