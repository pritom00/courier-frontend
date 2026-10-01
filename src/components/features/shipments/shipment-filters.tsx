import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { STATUS_LABEL, SHIPMENT_STATUSES, SORT_OPTIONS } from "@/lib/constants";

export function ShipmentFilters({ showSort = true }: { showSort?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchInput param="q" placeholder="Search by tracking code, receiver, or address…" label="Search shipments" />
      <FilterSelect
        param="status"
        label="Filter by status"
        allLabel="All statuses"
        className="w-full sm:w-56"
        options={SHIPMENT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
      />
      {showSort && (
        <FilterSelect
          param="sort"
          label="Sort by"
          allLabel="Sort: newest first"
          className="w-full sm:w-56"
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      )}
    </div>
  );
}
