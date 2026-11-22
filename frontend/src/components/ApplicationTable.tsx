import {
  statuses,
  type Application,
} from "../types/application";

type Props = {
  applications: Application[];
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
};

export default function ApplicationTable({
  applications,
  onStatusChange,
  onDelete,
}: Props) {
  if (applications.length === 0) {
    return <p>No matching applications.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Job title</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.company_name}</td>
              <td>{application.job_title}</td>
              <td>{application.location ?? "—"}</td>

              <td>
                <select
                  value={application.status}
                  onChange={(event) =>
                    onStatusChange(
                      application.id,
                      event.target.value
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <button
                  className="delete-button"
                  onClick={() => onDelete(application.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}