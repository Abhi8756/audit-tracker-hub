
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { AuditCard } from "@/components/AuditCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockAudits = [
  {
    id: 1,
    title: "Highway Bridge Construction",
    status: "ongoing",
    progress: 75,
    date: "2024-03-15",
    testType: "Soil Compaction",
  },
  {
    id: 2,
    title: "City Park Renovation",
    status: "completed",
    progress: 100,
    date: "2024-03-10",
    testType: "Concrete Strength",
  },
  {
    id: 3,
    title: "Municipal Building",
    status: "scheduled",
    progress: 0,
    date: "2024-03-20",
    testType: "Foundation Analysis",
  },
] as const;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAudits = mockAudits.filter((audit) => {
    const matchesSearch = audit.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold heading-gradient">Audit Tracker</h1>
          <ThemeToggle />
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar onSearch={setSearchQuery} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudits.map((audit) => (
            <AuditCard
              key={audit.id}
              title={audit.title}
              status={audit.status}
              progress={audit.progress}
              date={audit.date}
              testType={audit.testType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
