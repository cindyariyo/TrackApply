import { statuses } from "../types/application";

type Props = {
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
};

export default function ApplicationFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="filters">
      <input
        placeholder="Search company or job title..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusFilterChange(event.target.value)
        }
      >
        <option value="All">All statuses</option>

        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}