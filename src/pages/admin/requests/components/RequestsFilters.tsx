import { Filter, Search } from "lucide-react";

import type { AdminAreaDto, AdminServiceDto } from "../../../../types/api";
import { requestStatuses } from "../../../../lib/status";
import { requestStatusLabels } from "../utils/requestConstants";
import type { RequestFilterKey } from "../types";
import { RequestsPanel } from "./requestsUi";

type RequestsFiltersProps = {
  search: string;
  status?: string;
  serviceId?: number;
  areaId?: number;
  from?: string;
  to?: string;
  services?: AdminServiceDto[];
  areas?: AdminAreaDto[];
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: RequestFilterKey, value?: string) => void;
  onClear: () => void;
};

const inputClass =
  "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-bold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-gold)_18%,transparent)]";

export function RequestsFilters({
  search,
  status,
  serviceId,
  areaId,
  from,
  to,
  services,
  areas,
  hasFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: RequestsFiltersProps) {
  return (
    <RequestsPanel className="mb-5 p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        <div className="relative xl:col-span-2">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            size={18}
          />
          <input
            className={`${inputClass} pr-10`}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="بحث بالاسم أو الهاتف..."
          />
        </div>

        <select
          className={inputClass}
          aria-label="الحالة"
          value={status || ""}
          onChange={(event) => onFilterChange("status", event.target.value)}
        >
          <option value="">كل الحالات</option>
          {requestStatuses.map((item) => (
            <option key={item} value={item}>
              {requestStatusLabels[item]}
            </option>
          ))}
        </select>

        <select
          className={inputClass}
          aria-label="الخدمة"
          value={serviceId || ""}
          onChange={(event) => onFilterChange("serviceId", event.target.value)}
        >
          <option value="">كل الخدمات</option>
          {services?.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <select
          className={inputClass}
          aria-label="المنطقة"
          value={areaId || ""}
          onChange={(event) => onFilterChange("areaId", event.target.value)}
        >
          <option value="">كل المناطق</option>
          {areas?.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <input
          className={inputClass}
          aria-label="من تاريخ"
          type="date"
          value={from || ""}
          onChange={(event) => onFilterChange("from", event.target.value)}
        />

        <input
          className={inputClass}
          aria-label="إلى تاريخ"
          type="date"
          value={to || ""}
          onChange={(event) => onFilterChange("to", event.target.value)}
        />
      </div>

      {hasFilters && (
        <button
          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-xs font-black text-[var(--color-text)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
          type="button"
          onClick={onClear}
        >
          <Filter size={16} />
          مسح الفلاتر
        </button>
      )}
    </RequestsPanel>
  );
}
