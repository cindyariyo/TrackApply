import { useState, type FormEvent } from "react";
import {
  statuses,
  type Application,
  type ApplicationInput,
} from "../types/application";

type Props = {
  application: Application;
  onSave: (id: number, changes: ApplicationInput) => Promise<void>;
  onCancel: () => void;
};

export default function ApplicationEditor({
  application,
  onSave,
  onCancel,
}: Props) {
  const [company, setCompany] = useState(application.company_name);
  const [jobTitle, setJobTitle] = useState(application.job_title);
  const [status, setStatus] = useState(application.status);
  const [location, setLocation] = useState(application.location ?? "");
  const [dateApplied, setDateApplied] = useState(
    application.date_applied ?? ""
  );
  const [jobUrl, setJobUrl] = useState(application.job_url ?? "");
  const [salaryRange, setSalaryRange] = useState(
    application.salary_range ?? ""
  );
  const [notes, setNotes] = useState(application.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await onSave(application.id, {
        company_name: company,
        job_title: jobTitle,
        status,
        location: location || null,
        date_applied: dateApplied || null,
        job_url: jobUrl || null,
        salary_range: salaryRange || null,
        notes: notes || null,
      });
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2>Edit application</h2>

      <form onSubmit={handleSubmit}>
        <label>Company</label>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />

        <label>Job title</label>
        <input
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          required
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label>Location</label>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <label>Date applied</label>
        <input
          type="date"
          value={dateApplied}
          onChange={(event) => setDateApplied(event.target.value)}
        />

        <label>Job URL</label>
        <input
          type="url"
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
        />

        <label>Salary range</label>
        <input
          value={salaryRange}
          onChange={(event) => setSalaryRange(event.target.value)}
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
        />

        {error && <p className="error">{error}</p>}

        <div className="editor-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}