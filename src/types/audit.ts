
export interface Audit {
  id: number;
  date: string;
  test_type: string;
  result: string;
  maintenance_needed: boolean;
  maintenance_scheduled: string | null;
  report_url: string | null;
  completed: boolean;
  created_at: string;
}
