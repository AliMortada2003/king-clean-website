import {
  keepPreviousData,
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminApi, clientApi, publicApi, type AdminListMap } from "./endpoints";
import { keys } from "./query-keys";
import { shouldRetry } from "../lib/api-client";
import type {
  AdminResourceName,
  AdminServiceRequestQueryDto,
  ClientResendConfirmationRequestDto,
  ClientRegisterRequestDto,
  CreateServiceRequestDto,
  MediaFilters,
  ReplyToServiceRequestDto,
  SiteSettingDto,
  UpsertAreaDto,
  UpsertGalleryItemDto,
  UpsertReviewDto,
  UpsertServiceDto,
  UpsertSiteSectionDto,
  UpsertVideoItemDto,
  UpdateServiceRequestDto,
  UpdateServiceRequestStatusDto,
} from "../types/api";

const queryDefaults = { retry: shouldRetry };
type QueryKeyLike = readonly unknown[];

async function invalidateQueries(
  queryClient: QueryClient,
  queryKeys: QueryKeyLike[],
) {
  await Promise.all(
    queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}

const invalidateAdminServices = (queryClient: QueryClient, id?: number) =>
  invalidateQueries(queryClient, [
    keys.adminServices,
    ...(id ? [keys.adminService(id)] : []),
    keys.dashboardStats,
    ["public", "services"] as const,
    ["public", "service"] as const,
    ["public", "areas"] as const,
    ["public", "area"] as const,
  ]);

const invalidateAdminAreas = (queryClient: QueryClient, id?: number) =>
  invalidateQueries(queryClient, [
    keys.adminAreas,
    ...(id ? [keys.adminArea(id)] : []),
    keys.dashboardStats,
    ["public", "areas"] as const,
    ["public", "area"] as const,
    ["public", "services"] as const,
    ["public", "service"] as const,
  ]);

const invalidateAdminGallery = (queryClient: QueryClient, id?: number) =>
  invalidateQueries(queryClient, [
    keys.adminGallery,
    ...(id ? [keys.adminGalleryItem(id)] : []),
    ["public", "gallery"] as const,
    ["public", "service"] as const,
  ]);

const invalidateAdminVideos = (queryClient: QueryClient, id?: number) =>
  invalidateQueries(queryClient, [
    keys.adminVideos,
    ...(id ? [keys.adminVideo(id)] : []),
    ["public", "videos"] as const,
    ["public", "service"] as const,
  ]);

const invalidateAdminReviews = (queryClient: QueryClient, id?: number) =>
  invalidateQueries(queryClient, [
    keys.adminReviews,
    ...(id ? [keys.adminReview(id)] : []),
    keys.reviews,
  ]);

const invalidateAdminSections = (queryClient: QueryClient, id?: number) =>
  invalidateQueries(queryClient, [
    keys.adminSections,
    ...(id ? [keys.adminSection(id)] : []),
    ["public", "sections"] as const,
    ["public", "section"] as const,
  ]);

export const useHealth = () =>
  useQuery({
    queryKey: keys.health,
    queryFn: ({ signal }) => publicApi.health(signal),
    ...queryDefaults,
  });
export const useSettings = () =>
  useQuery({
    queryKey: keys.settings,
    queryFn: ({ signal }) => publicApi.settings(signal),
    staleTime: 300_000,
    ...queryDefaults,
  });
export const useServices = (areaSlug?: string) =>
  useQuery({
    queryKey: keys.services(areaSlug),
    queryFn: ({ signal }) => publicApi.services(areaSlug, signal),
    ...queryDefaults,
  });
export const useService = (slug: string) =>
  useQuery({
    queryKey: keys.service(slug),
    queryFn: ({ signal }) => publicApi.service(slug, signal),
    enabled: !!slug,
    ...queryDefaults,
  });
export const useAreas = () =>
  useQuery({
    queryKey: keys.areas,
    queryFn: ({ signal }) => publicApi.areas(signal),
    staleTime: 300_000,
    ...queryDefaults,
  });
export const useArea = (slug: string) =>
  useQuery({
    queryKey: keys.area(slug),
    queryFn: ({ signal }) => publicApi.area(slug, signal),
    enabled: !!slug,
    ...queryDefaults,
  });
export const useGallery = (filters?: MediaFilters) =>
  useQuery({
    queryKey: keys.gallery(filters),
    queryFn: ({ signal }) => publicApi.gallery(filters, signal),
    ...queryDefaults,
  });
export const useVideos = (filters?: MediaFilters) =>
  useQuery({
    queryKey: keys.videos(filters),
    queryFn: ({ signal }) => publicApi.videos(filters, signal),
    ...queryDefaults,
  });
export const useReviews = () =>
  useQuery({
    queryKey: keys.reviews,
    queryFn: ({ signal }) => publicApi.reviews(signal),
    ...queryDefaults,
  });
export const useSections = (page?: string) =>
  useQuery({
    queryKey: keys.sections(page),
    queryFn: ({ signal }) => publicApi.sections(page, signal),
    ...queryDefaults,
  });
export const useSection = (key: string) =>
  useQuery({
    queryKey: keys.section(key),
    queryFn: ({ signal }) => publicApi.section(key, signal),
    enabled: !!key,
    retry: false,
  });
export const useCreateRequest = () =>
  useMutation({
    mutationFn: (body: CreateServiceRequestDto) =>
      publicApi.createRequest(body),
  });
export const useCreateClientRequest = () =>
  useMutation({
    mutationFn: (body: CreateServiceRequestDto) =>
      clientApi.createRequest(body),
  });


export const useClientRequests = () =>
  useQuery({
    queryKey: keys.clientRequests,
    queryFn: ({ signal }) => clientApi.requests(signal),
    ...queryDefaults,
  });


export const useClientRequest = (id: number) =>
  useQuery({
    queryKey: keys.clientRequest(id),
    queryFn: ({ signal }) => clientApi.request(id, signal),
    enabled: id > 0,
    ...queryDefaults,
  });


export const useDashboardStats = () =>
  useQuery({
    queryKey: keys.dashboardStats,
    queryFn: ({ signal }) => adminApi.dashboardStats(signal),
    ...queryDefaults,
  });
export const useDashboardCharts = (days: number) =>
  useQuery({
    queryKey: keys.dashboardCharts(days),
    queryFn: ({ signal }) => adminApi.dashboardCharts(days, signal),
    ...queryDefaults,
  });
export const useAdminRequests = (query: AdminServiceRequestQueryDto) =>
  useQuery({
    queryKey: keys.requests(query),
    queryFn: ({ signal }) => adminApi.requests(query, signal),
    placeholderData: keepPreviousData,
    ...queryDefaults,
  });
export const useAdminRequest = (id: number) =>
  useQuery({
    queryKey: keys.request(id),
    queryFn: ({ signal }) => adminApi.request(id, signal),
    enabled: id > 0,
    ...queryDefaults,
  });

export function useRequestMutations(id?: number) {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "requests"] }),
      queryClient.invalidateQueries({ queryKey: keys.dashboardStats }),
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "charts"],
      }),
      id
        ? queryClient.invalidateQueries({ queryKey: keys.request(id) })
        : Promise.resolve(),
    ]);
  };
  return {
    update: useMutation({
      mutationFn: (body: UpdateServiceRequestDto) =>
        adminApi.updateRequest(id!, body),
      onSuccess: invalidate,
    }),
    status: useMutation({
      mutationFn: (body: UpdateServiceRequestStatusDto) =>
        adminApi.updateRequestStatus(id!, body),
      onSuccess: invalidate,
    }),
    reply: useMutation({
      mutationFn: (body: ReplyToServiceRequestDto) =>
        adminApi.replyToRequest(id!, body),
      onSuccess: async () => {
        await Promise.all([
          invalidate(),
          queryClient.invalidateQueries({ queryKey: keys.clientRequests }),
          id
            ? queryClient.invalidateQueries({ queryKey: keys.clientRequest(id) })
            : Promise.resolve(),
        ]);
      },
    }),
  };
}

export const useAdminServices = () =>
  useQuery({
    queryKey: keys.adminServices,
    queryFn: ({ signal }) => adminApi.services(signal),
    ...queryDefaults,
  });
export const useAdminService = (id?: number) =>
  useQuery({
    queryKey: keys.adminService(id || 0),
    queryFn: ({ signal }) => adminApi.service(id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
export const useCreateAdminService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertServiceDto) => adminApi.createService(body),
    onSuccess: () => invalidateAdminServices(queryClient),
  });
};
export const useUpdateAdminService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpsertServiceDto }) =>
      adminApi.updateService(id, body),
    onSuccess: (_data, variables) =>
      invalidateAdminServices(queryClient, variables.id),
  });
};
export const useDeleteAdminService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteService(id),
    onSuccess: (_data, id) => invalidateAdminServices(queryClient, id),
  });
};

export const useAdminAreas = () =>
  useQuery({
    queryKey: keys.adminAreas,
    queryFn: ({ signal }) => adminApi.areas(signal),
    ...queryDefaults,
  });
export const useAdminArea = (id?: number) =>
  useQuery({
    queryKey: keys.adminArea(id || 0),
    queryFn: ({ signal }) => adminApi.area(id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
export const useCreateAdminArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertAreaDto) => adminApi.createArea(body),
    onSuccess: () => invalidateAdminAreas(queryClient),
  });
};
export const useUpdateAdminArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpsertAreaDto }) =>
      adminApi.updateArea(id, body),
    onSuccess: (_data, variables) =>
      invalidateAdminAreas(queryClient, variables.id),
  });
};
export const useDeleteAdminArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteArea(id),
    onSuccess: (_data, id) => invalidateAdminAreas(queryClient, id),
  });
};

export const useAdminGallery = () =>
  useQuery({
    queryKey: keys.adminGallery,
    queryFn: ({ signal }) => adminApi.galleryItems(signal),
    ...queryDefaults,
  });
export const useAdminGalleryItem = (id?: number) =>
  useQuery({
    queryKey: keys.adminGalleryItem(id || 0),
    queryFn: ({ signal }) => adminApi.galleryItem(id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
export const useCreateAdminGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertGalleryItemDto) =>
      adminApi.createGalleryItem(body),
    onSuccess: () => invalidateAdminGallery(queryClient),
  });
};
export const useUpdateAdminGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpsertGalleryItemDto;
    }) => adminApi.updateGalleryItem(id, body),
    onSuccess: (_data, variables) =>
      invalidateAdminGallery(queryClient, variables.id),
  });
};
export const useDeleteAdminGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteGalleryItem(id),
    onSuccess: (_data, id) => invalidateAdminGallery(queryClient, id),
  });
};

export const useAdminVideos = () =>
  useQuery({
    queryKey: keys.adminVideos,
    queryFn: ({ signal }) => adminApi.videos(signal),
    ...queryDefaults,
  });
export const useAdminVideo = (id?: number) =>
  useQuery({
    queryKey: keys.adminVideo(id || 0),
    queryFn: ({ signal }) => adminApi.video(id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
export const useCreateAdminVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertVideoItemDto) => adminApi.createVideo(body),
    onSuccess: () => invalidateAdminVideos(queryClient),
  });
};
export const useUpdateAdminVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpsertVideoItemDto }) =>
      adminApi.updateVideo(id, body),
    onSuccess: (_data, variables) =>
      invalidateAdminVideos(queryClient, variables.id),
  });
};
export const useDeleteAdminVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteVideo(id),
    onSuccess: (_data, id) => invalidateAdminVideos(queryClient, id),
  });
};

export const useAdminReviews = () =>
  useQuery({
    queryKey: keys.adminReviews,
    queryFn: ({ signal }) => adminApi.reviews(signal),
    ...queryDefaults,
  });
export const useAdminReview = (id?: number) =>
  useQuery({
    queryKey: keys.adminReview(id || 0),
    queryFn: ({ signal }) => adminApi.review(id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
export const useCreateAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertReviewDto) => adminApi.createReview(body),
    onSuccess: () => invalidateAdminReviews(queryClient),
  });
};
export const useUpdateAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpsertReviewDto }) =>
      adminApi.updateReview(id, body),
    onSuccess: (_data, variables) =>
      invalidateAdminReviews(queryClient, variables.id),
  });
};
export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteReview(id),
    onSuccess: (_data, id) => invalidateAdminReviews(queryClient, id),
  });
};

export const useAdminSections = () =>
  useQuery({
    queryKey: keys.adminSections,
    queryFn: ({ signal }) => adminApi.sections(signal),
    ...queryDefaults,
  });
export const useAdminSection = (id?: number) =>
  useQuery({
    queryKey: keys.adminSection(id || 0),
    queryFn: ({ signal }) => adminApi.section(id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
export const useCreateAdminSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertSiteSectionDto) => adminApi.createSection(body),
    onSuccess: () => invalidateAdminSections(queryClient),
  });
};
export const useUpdateAdminSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpsertSiteSectionDto;
    }) => adminApi.updateSection(id, body),
    onSuccess: (_data, variables) =>
      invalidateAdminSections(queryClient, variables.id),
  });
};
export const useDeleteAdminSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteSection(id),
    onSuccess: (_data, id) => invalidateAdminSections(queryClient, id),
  });
};

export function useAdminResource<R extends AdminResourceName>(resource: R) {
  return useQuery<AdminListMap[R][]>({
    queryKey: keys.resource(resource),
    queryFn: ({ signal }) =>
      adminApi.resourceList<AdminListMap[R]>(resource, signal),
    ...queryDefaults,
  });
}
export function useAdminResourceItem<R extends AdminResourceName>(
  resource: R,
  id?: number,
) {
  return useQuery<AdminListMap[R]>({
    queryKey: keys.resourceItem(resource, id || 0),
    queryFn: ({ signal }) =>
      adminApi.resourceItem<AdminListMap[R]>(resource, id!, signal),
    enabled: !!id,
    ...queryDefaults,
  });
}
export function useAdminResourceMutations(resource: AdminResourceName) {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: keys.resource(resource) }),
      queryClient.invalidateQueries({ queryKey: ["public"] }),
    ]);
  };
  return {
    create: useMutation({
      mutationFn: (body: unknown) => adminApi.createResource(resource, body),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: number; body: unknown }) =>
        adminApi.updateResource(resource, id, body),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: number) => adminApi.deleteResource(resource, id),
      onSuccess: invalidate,
    }),
  };
}
export const useAdminSettings = () =>
  useQuery({
    queryKey: keys.adminSettings,
    queryFn: ({ signal }) => adminApi.settings(signal),
    ...queryDefaults,
  });
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SiteSettingDto) => adminApi.updateSettings(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.adminSettings }),
        queryClient.invalidateQueries({ queryKey: keys.settings }),
      ]);
    },
  });
};
