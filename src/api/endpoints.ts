import { api, uploadMedia } from "../lib/api-client";
import type {
  AdminAreaDto,
  AdminGalleryItemDto,
  AdminResourceDto,
  AdminResourceName,
  AdminReviewDto,
  AdminServiceDto,
  AdminServiceRequestDetailsDto,
  AdminServiceRequestListItemDto,
  AdminServiceRequestQueryDto,
  AdminVideoItemDto,
  AreaDetailsDto,
  AreaListDto,
  AuthMessageDto,
  ClientLoginRequestDto,
  ClientLoginResponseDto,
  ClientRegisterRequestDto,
  ClientResendConfirmationRequestDto,
  ClientServiceRequestDetailsDto,
  ClientServiceRequestListItemDto,
  ClientUserDto,
  CreateServiceRequestDto,
  DashboardChartsDto,
  DashboardStatsDto,
  GalleryItemDto,
  HealthDto,
  LoginRequestDto,
  LoginResponseDto,
  MediaAssetDto,
  MediaFilters,
  MutationResultDto,
  PagedResultDto,
  ReviewDto,
  ReplyToServiceRequestDto,
  ServiceDetailsDto,
  ServiceListDto,
  ServiceRequestCreatedDto,
  ServiceRequestStatusUpdatedDto,
  SiteSectionDto,
  SiteSettingDto,
  UpsertAreaDto,
  UpsertGalleryItemDto,
  UpsertReviewDto,
  UpsertServiceDto,
  UpsertSiteSectionDto,
  UpsertVideoItemDto,
  UpdateServiceRequestDto,
  UpdateServiceRequestStatusDto,
  VideoItemDto,
} from "../types/api";

export const publicApi = {
  health: (signal?: AbortSignal) =>
    api.get<HealthDto>("/health", undefined, signal, "public"),
  services: (areaSlug?: string, signal?: AbortSignal) =>
    api.get<ServiceListDto[]>("/services", { areaSlug }, signal, "public"),
  service: (slug: string, signal?: AbortSignal) =>
    api.get<ServiceDetailsDto>(
      `/services/${encodeURIComponent(slug)}`,
      undefined,
      signal,
      "public",
    ),
  areas: (signal?: AbortSignal) =>
    api.get<AreaListDto[]>("/areas", undefined, signal, "public"),
  area: (slug: string, signal?: AbortSignal) =>
    api.get<AreaDetailsDto>(
      `/areas/${encodeURIComponent(slug)}`,
      undefined,
      signal,
      "public",
    ),
  gallery: (filters?: MediaFilters, signal?: AbortSignal) =>
    api.get<GalleryItemDto[]>(
      "/gallery",
      filters as Record<string, unknown>,
      signal,
      "public",
    ),
  videos: (filters?: MediaFilters, signal?: AbortSignal) =>
    api.get<VideoItemDto[]>(
      "/videos",
      filters as Record<string, unknown>,
      signal,
      "public",
    ),
  reviews: (signal?: AbortSignal) =>
    api.get<ReviewDto[]>("/reviews", undefined, signal, "public"),
  settings: (signal?: AbortSignal) =>
    api.get<SiteSettingDto>("/settings", undefined, signal, "public"),
  sections: (page?: string, signal?: AbortSignal) =>
    api.get<SiteSectionDto[]>("/content/sections", { page }, signal, "public"),
  section: (key: string, signal?: AbortSignal) =>
    api.get<SiteSectionDto>(
      `/content/sections/${encodeURIComponent(key)}`,
      undefined,
      signal,
      "public",
    ),
  createRequest: (body: CreateServiceRequestDto) =>
    api.post<ServiceRequestCreatedDto>("/service-requests", body, "public"),
};

export const clientApi = {
  register: (body: ClientRegisterRequestDto) =>
    api.post<AuthMessageDto>("/client/auth/register", body, "public"),
  resendConfirmation: (body: ClientResendConfirmationRequestDto) =>
    api.post<AuthMessageDto>(
      "/client/auth/resend-confirmation",
      body,
      "public",
    ),
  login: (body: ClientLoginRequestDto) =>
    api.post<ClientLoginResponseDto>("/client/auth/login", body, "public"),
  me: (signal?: AbortSignal) =>
    api.get<ClientUserDto>("/client/auth/me", undefined, signal, "client"),
  createRequest: (body: CreateServiceRequestDto) =>
    api.post<ServiceRequestCreatedDto>(
      "/client/service-requests",
      body,
      "client",
    ),
  requests: (signal?: AbortSignal) =>
    api.get<ClientServiceRequestListItemDto[]>(
      "/client/service-requests",
      undefined,
      signal,
      "client",
    ),
  request: (id: number, signal?: AbortSignal) =>
    api.get<ClientServiceRequestDetailsDto>(
      `/client/service-requests/${id}`,
      undefined,
      signal,
      "client",
    ),
};

const resourcePaths: Record<AdminResourceName, string> = {
  services: "/admin/services",
  areas: "/admin/areas",
  gallery: "/admin/gallery",
  videos: "/admin/videos",
  reviews: "/admin/reviews",
  sections: "/admin/sections",
};

export const adminApi = {
  login: (body: LoginRequestDto) =>
    api.post<LoginResponseDto>("/admin/auth/login", body, "public"),
  dashboardStats: (signal?: AbortSignal) =>
    api.get<DashboardStatsDto>("/admin/dashboard/stats", undefined, signal),
  dashboardCharts: (days: number, signal?: AbortSignal) =>
    api.get<DashboardChartsDto>("/admin/dashboard/charts", { days }, signal),
  requests: (query: AdminServiceRequestQueryDto, signal?: AbortSignal) =>
    api.get<PagedResultDto<AdminServiceRequestListItemDto>>(
      "/admin/service-requests",
      query as Record<string, unknown>,
      signal,
    ),
  request: (id: number, signal?: AbortSignal) =>
    api.get<AdminServiceRequestDetailsDto>(
      `/admin/service-requests/${id}`,
      undefined,
      signal,
    ),
  updateRequest: (id: number, body: UpdateServiceRequestDto) =>
    api.put<MutationResultDto>(`/admin/service-requests/${id}`, body),
  updateRequestStatus: (id: number, body: UpdateServiceRequestStatusDto) =>
    api.put<ServiceRequestStatusUpdatedDto>(
      `/admin/service-requests/${id}/status`,
      body,
    ),
  replyToRequest: (id: number, body: ReplyToServiceRequestDto) =>
    api.put<MutationResultDto>(`/admin/service-requests/${id}/reply`, body),
  services: (signal?: AbortSignal) =>
    api.get<AdminServiceDto[]>("/admin/services", undefined, signal),
  service: (id: number, signal?: AbortSignal) =>
    api.get<AdminServiceDto>(`/admin/services/${id}`, undefined, signal),
  createService: (body: UpsertServiceDto) =>
    api.post<MutationResultDto>("/admin/services", body),
  updateService: (id: number, body: UpsertServiceDto) =>
    api.put<MutationResultDto>(`/admin/services/${id}`, body),
  deleteService: (id: number) =>
    api.delete<MutationResultDto>(`/admin/services/${id}`),
  areas: (signal?: AbortSignal) =>
    api.get<AdminAreaDto[]>("/admin/areas", undefined, signal),
  area: (id: number, signal?: AbortSignal) =>
    api.get<AdminAreaDto>(`/admin/areas/${id}`, undefined, signal),
  createArea: (body: UpsertAreaDto) =>
    api.post<MutationResultDto>("/admin/areas", body),
  updateArea: (id: number, body: UpsertAreaDto) =>
    api.put<MutationResultDto>(`/admin/areas/${id}`, body),
  deleteArea: (id: number) =>
    api.delete<MutationResultDto>(`/admin/areas/${id}`),
  galleryItems: (signal?: AbortSignal) =>
    api.get<AdminGalleryItemDto[]>("/admin/gallery", undefined, signal),
  galleryItem: (id: number, signal?: AbortSignal) =>
    api.get<AdminGalleryItemDto>(`/admin/gallery/${id}`, undefined, signal),
  createGalleryItem: (body: UpsertGalleryItemDto) =>
    api.post<MutationResultDto>("/admin/gallery", body),
  updateGalleryItem: (id: number, body: UpsertGalleryItemDto) =>
    api.put<MutationResultDto>(`/admin/gallery/${id}`, body),
  deleteGalleryItem: (id: number) =>
    api.delete<MutationResultDto>(`/admin/gallery/${id}`),
  videos: (signal?: AbortSignal) =>
    api.get<AdminVideoItemDto[]>("/admin/videos", undefined, signal),
  video: (id: number, signal?: AbortSignal) =>
    api.get<AdminVideoItemDto>(`/admin/videos/${id}`, undefined, signal),
  createVideo: (body: UpsertVideoItemDto) =>
    api.post<MutationResultDto>("/admin/videos", body),
  updateVideo: (id: number, body: UpsertVideoItemDto) =>
    api.put<MutationResultDto>(`/admin/videos/${id}`, body),
  deleteVideo: (id: number) =>
    api.delete<MutationResultDto>(`/admin/videos/${id}`),
  reviews: (signal?: AbortSignal) =>
    api.get<AdminReviewDto[]>("/admin/reviews", undefined, signal),
  review: (id: number, signal?: AbortSignal) =>
    api.get<AdminReviewDto>(`/admin/reviews/${id}`, undefined, signal),
  createReview: (body: UpsertReviewDto) =>
    api.post<MutationResultDto>("/admin/reviews", body),
  updateReview: (id: number, body: UpsertReviewDto) =>
    api.put<MutationResultDto>(`/admin/reviews/${id}`, body),
  deleteReview: (id: number) =>
    api.delete<MutationResultDto>(`/admin/reviews/${id}`),
  sections: (signal?: AbortSignal) =>
    api.get<SiteSectionDto[]>("/admin/sections", undefined, signal),
  section: (id: number, signal?: AbortSignal) =>
    api.get<SiteSectionDto>(`/admin/sections/${id}`, undefined, signal),
  createSection: (body: UpsertSiteSectionDto) =>
    api.post<MutationResultDto>("/admin/sections", body),
  updateSection: (id: number, body: UpsertSiteSectionDto) =>
    api.put<MutationResultDto>(`/admin/sections/${id}`, body),
  deleteSection: (id: number) =>
    api.delete<MutationResultDto>(`/admin/sections/${id}`),
  resourceList: <T extends AdminResourceDto>(
    resource: AdminResourceName,
    signal?: AbortSignal,
  ) => api.get<T[]>(resourcePaths[resource], undefined, signal),
  resourceItem: <T extends AdminResourceDto>(
    resource: AdminResourceName,
    id: number,
    signal?: AbortSignal,
  ) => api.get<T>(`${resourcePaths[resource]}/${id}`, undefined, signal),
  createResource: (resource: AdminResourceName, body: unknown) =>
    api.post<MutationResultDto>(resourcePaths[resource], body),
  updateResource: (resource: AdminResourceName, id: number, body: unknown) =>
    api.put<MutationResultDto>(`${resourcePaths[resource]}/${id}`, body),
  deleteResource: (resource: AdminResourceName, id: number) =>
    api.delete<MutationResultDto>(`${resourcePaths[resource]}/${id}`),
  settings: (signal?: AbortSignal) =>
    api.get<SiteSettingDto>("/admin/settings", undefined, signal),
  updateSettings: (body: SiteSettingDto) =>
    api.put<MutationResultDto>("/admin/settings", body),
  upload: uploadMedia,
  uploadById: (id: number, signal?: AbortSignal) =>
    api.get<MediaAssetDto>(`/admin/uploads/${id}`, undefined, signal),
  deleteUpload: (id: number) =>
    api.delete<MutationResultDto>(`/admin/uploads/${id}`),
};

export type AdminListMap = {
  services: AdminServiceDto;
  areas: AdminAreaDto;
  gallery: AdminGalleryItemDto;
  videos: AdminVideoItemDto;
  reviews: AdminReviewDto;
  sections: SiteSectionDto;
};
