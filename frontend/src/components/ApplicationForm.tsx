import { useState, type FormEvent } from "react";
import {
  statuses,
  type ApplicationInput,
} from "../types/application";

type Props = {
  onAdd: (application: ApplicationInput) => Promise<void>;
};

export default function ApplicationForm({ onAdd }: Props) {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("Interested");
  const [location, setLocation] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onAdd({
      company_name: company,
      job_title: jobTitle,
      status,
      location: location || null,
      date_applied: dateApplied || null,
      job_url: jobUrl || null,
      salary_range: salaryRange || null,
      notes: notes || null,
    });

    setCompany("");
    setJobTitle("");
    setStatus("Interested");
    setLocation("");
    setDateApplied("");
    setJobUrl("");
    setSalaryRange("");
    setNotes("");
  }

  return (
    <section className="panel">
      <h2>Add application</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Company name"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />

        <input
          placeholder="Job title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          required
        />

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

        <input
          placeholder="Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <input
          type="date"
          value={dateApplied}
          onChange={(event) => setDateApplied(event.target.value)}
        />

        <input
          type="url"
          placeholder="Job posting URL"
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
        />

        <input
          placeholder="Salary range"
          value={salaryRange}
          onChange={(event) => setSalaryRange(event.target.value)}
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        <button type="submit">Add application</button>
      </form>
    </section>
  );
}