import { useEffect, useState } from "react";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationTable from "./components/ApplicationTable";
import ApplicationEditor from "./components/ApplicationEditor";
import ApplicationStats from "./components/ApplicationStats";
import {
  type Application,
  type ApplicationInput,
} from "./types/application";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  async function fetchApplications() {
    try {
      const response = await fetch(`${API_URL}/applications`);

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data: Application[] = await response.json();
      setApplications(data);
      setError("");
    } catch {
      setError("Could not connect to the backend.");
    }
  }

  useEffect(() => {
    void fetchApplications();
  }, []);

  async function addApplication(application: ApplicationInput) {
    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });

    if (!response.ok) {
      setError("Could not create application.");
      throw new Error("Failed to create application");
    }

    await fetchApplications();
  }

  async function updateStatus(id: number, status: string) {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      await fetchApplications();
    } catch {
      setError("Could not update application.");
    }
  }

  async function deleteApplication(id: number) {
    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      await fetchApplications();
    } catch {
      setError("Could not delete application.");
    }
  }

  async function saveApplication(
    id: number,
    changes: ApplicationInput
  ) {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    });

    if (!response.ok) {
      const errorData = await response.json();

      console.error(
        "PATCH validation error:",
        JSON.stringify(errorData, null, 2)
      );
      console.error("Data sent:", changes);

      throw new Error(`PATCH failed: ${response.status}`);
    }

    await fetchApplications();
    setEditingApplication(null);
  }

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.company_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      application.job_title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="container">
      <header>
        <h1>TrackApply</h1>
        <p>Your job application dashboard</p>
      </header>

      {error && <p className="error">{error}</p>}

      <ApplicationStats applications={applications} />
      
      <ApplicationForm onAdd={addApplication} />

      <section className="panel">
        <h2>Applications ({applications.length})</h2>

        <ApplicationFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
        />

        <ApplicationTable
          applications={filteredApplications}
          onStatusChange={updateStatus}
          onDelete={deleteApplication}
          onEdit={setEditingApplication}
        />
        {editingApplication && (
          <ApplicationEditor
            key={editingApplication.id}
            application={editingApplication}
            onSave={saveApplication}
            onCancel={() => setEditingApplication(null)}
          />
        )}
      </section>
    </main>
  );
}

export default App;