import { Seo } from "../../../components/Seo";
import { EmptyState, ErrorState, PageLoading } from "../../../components/ui";
import { RequestStatusModal } from "./components/RequestStatusModal";
import { RequestsFilters } from "./components/RequestsFilters";
import { RequestsMobileList } from "./components/RequestsMobileList";
import { RequestsPageHeader } from "./components/RequestsPageHeader";
import { RequestsPagination } from "./components/RequestsPagination";
import { RequestsTable } from "./components/RequestsTable";
import { RequestsPanel } from "./components/requestsUi";
import { useRequestsPage } from "./hooks/useRequestsPage";

export function RequestsPage() {
  const page = useRequestsPage();
  const requestsData = page.requests.data;

  return (
    <>
      <Seo
        title="طلبات الخدمة | KING CLEAN"
        description="إدارة طلبات الخدمة"
        noIndex
      />

      <RequestsPageHeader totalCount={requestsData?.totalCount || 0} />

      <RequestsFilters
        areaId={page.query.areaId}
        areas={page.areas.data}
        from={page.query.from}
        hasFilters={page.hasFilters}
        search={page.search}
        serviceId={page.query.serviceId}
        services={page.services.data}
        status={page.query.status || ""}
        to={page.query.to}
        onClear={page.clearFilters}
        onFilterChange={page.setFilter}
        onSearchChange={page.setSearch}
      />

      <RequestsPanel>
        {page.requests.isLoading ? (
          <div className="p-5">
            <PageLoading />
          </div>
        ) : page.requests.isError ? (
          <div className="p-5">
            <ErrorState
              error={page.requests.error}
              retry={() => void page.requests.refetch()}
            />
          </div>
        ) : requestsData?.items.length ? (
          <>
            <RequestsTable
              items={requestsData.items}
              onStatusClick={page.openStatusModal}
            />
            <RequestsMobileList
              items={requestsData.items}
              onStatusClick={page.openStatusModal}
            />
            <RequestsPagination
              page={requestsData.page}
              totalPages={requestsData.totalPages}
              onPageChange={page.setPage}
            />
          </>
        ) : (
          <div className="p-5">
            <EmptyState
              title="لا توجد طلبات مطابقة"
              description="غيّر الفلاتر أو انتظر وصول طلبات جديدة."
            />
          </div>
        )}
      </RequestsPanel>

      <RequestStatusModal
        busy={page.statusBusy}
        target={page.statusTarget}
        onChange={page.updateStatusTarget}
        onClose={page.closeStatusModal}
        onSubmit={page.submitStatus}
      />
    </>
  );
}
