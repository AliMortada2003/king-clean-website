import { X } from "lucide-react";
import { useAreas, useServices } from "../../../api/hooks";
import {
  filterBarClass,
  ghostButtonClass,
  inputClass,
  smallButtonClass,
} from "../../../components/public/PublicPrimitives";
import { MediaFilters } from "../../../types/api";

export function MediaFiltersBar({
  filters,
  setFilters,
}: {
  filters: MediaFilters;
  setFilters: (filters: MediaFilters) => void;
}) {
  const services = useServices();
  const areas = useAreas();

  return (
    <div className={filterBarClass}>
      <select
        className={`${inputClass} sm:max-w-xs`}
        aria-label="الخدمة"
        value={filters.serviceId || ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            serviceId: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      >
        <option value="">كل الخدمات</option>
        {services.data?.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      <select
        className={`${inputClass} sm:max-w-xs`}
        aria-label="المنطقة"
        value={filters.areaId || ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            areaId: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      >
        <option value="">كل المناطق</option>
        {areas.data?.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>

      {(filters.serviceId || filters.areaId) && (
        <button
          className={`${ghostButtonClass} ${smallButtonClass}`}
          type="button"
          onClick={() => setFilters({})}
        >
          <X size={16} />
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}
