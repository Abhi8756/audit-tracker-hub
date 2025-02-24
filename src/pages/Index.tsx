
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { SidebarNav } from "@/components/SidebarNav";
import { AuditTable } from "@/components/AuditTable";
import { AuditStats } from "@/components/AuditStats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockAudits = [
  {
    id: 1,
    date: "2024-03-15",
    testType: "Soil Compaction",
    result: "Passed",
    maintenanceNeeded: false,
    maintenanceScheduled: null,
    report: "soil-report-1.pdf",
  },
  {
    id: 2,
    date: "2024-03-10",
    testType: "Concrete Strength",
    result: "Failed",
    maintenanceNeeded: true,
    maintenanceScheduled: "2024-03-20",
    report: "concrete-report-1.pdf",
  },
  {
    id: 3,
    date: "2024-03-08",
    testType: "Foundation Analysis",
    result: "Passed",
    maintenanceNeeded: false,
    maintenanceScheduled: null,
    report: "foundation-report-1.pdf",
  },
] as const;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("ongoing");

  // Filter audits based on search query and status
  const filteredAudits = mockAudits.filter((audit) => {
    const matchesSearch = 
      audit.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.result.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || audit.result.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight heading-gradient">Audit Maintenance</h2>
          <div className="flex items-center space-x-2">
            <SearchBar onSearch={setSearchQuery} />
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
            <AuditTable audits={filteredAudits} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
