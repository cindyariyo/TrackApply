export type Application = {
  id: number;
  company_name: string;
  job_title: string;
  status: string;
  date_applied: string | null;
  job_url: string | null;
  location: string | null;
  salary_range: string | null;
  notes: string | null;
};

export const statuses = [
  "Interested",
  "Applied",
  "Online Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

export type ApplicationInput = Omit<Application, "id">;