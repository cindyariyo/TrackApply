import type { Application } from "../types/application";

type Props = {
  applications: Application[];
};

export default function ApplicationStats({ applications }: Props) {
  const total = applications.length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offers = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <h3>Total Applications</h3>
        <p>{total}</p>
      </div>

      <div className="stat-card">
        <h3>Interviews</h3>
        <p>{interviews}</p>
      </div>

      <div className="stat-card">
        <h3>Offers</h3>
        <p>{offers}</p>
      </div>

      <div className="stat-card">
        <h3>Rejected</h3>
        <p>{rejected}</p>
      </div>
    </section>
  );
}