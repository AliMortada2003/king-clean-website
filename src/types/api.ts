export type ISODateString = string;

export type RequestStatus =
  | "New"
  | "Contacted"
  | "Scheduled"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export interface MutationResultDto {
  id: number;
  message: string;
}
export interface LookupDto {
  id: number;
  name: string;
  slug: string;
}
export interface PagedResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface HealthDto {
  status: string;
  service: string;
  timestamp: ISODateString;
}
export interface AdminUserDto {
  id: number;
  fullName: string;
  email: string;
}
export interface LoginRequestDto {
  email: string;
  password: string;
}
export interface LoginResponseDto {
  accessToken: string;
  expiresAt: ISODateString;
  admin: AdminUserDto;
}
export interface AuthMessageDto {
  message: string;
}
export interface ClientUserDto {
  id: number;
  fullName: string;
  email: string;
  emailConfirmed: boolean;
}
export interface ClientRegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface ClientResendConfirmationRequestDto {
  email: string;
}
export interface ClientLoginRequestDto {
  email: string;
  password: string;
}
export interface ClientLoginResponseDto {
  accessToken: string;
  expiresAt: ISODateString;
  client: ClientUserDto;
}

export type ServiceAreaDto = LookupDto;
export interface ServiceListDto {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl?: string | null;
  icon?: string | null;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  areas: ServiceAreaDto[];
}
export interface ServiceGalleryPreviewDto {
  id: number;
  title: string;
  imageUrl: string;
  areaId?: number | null;
  isFeatured: boolean;
  displayOrder: number;
}
export interface ServiceVideoPreviewDto {
  id: number;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  areaId?: number | null;
  isFeatured: boolean;
  displayOrder: number;
}
export interface ServiceDetailsDto extends Omit<ServiceListDto, "areas"> {
  description: string;
  areas: ServiceAreaDto[];
  gallery: ServiceGalleryPreviewDto[];
  videos: ServiceVideoPreviewDto[];
}
export interface UpsertServiceDto {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl?: string | null;
  icon?: string | null;
  isActive: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  areaIds: number[];
}
export interface AdminServiceDto extends Omit<UpsertServiceDto, "areaIds"> {
  id: number;
  areas: LookupDto[];
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}

export interface AreaListDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
}
export interface AreaServiceDto {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl?: string | null;
  icon?: string | null;
  displayOrder: number;
}
export interface AreaDetailsDto extends Omit<AreaListDto, "displayOrder"> {
  services: AreaServiceDto[];
}
export interface UpsertAreaDto {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  serviceIds: number[];
}
export interface AdminAreaDto extends Omit<UpsertAreaDto, "serviceIds"> {
  id: number;
  services: LookupDto[];
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}

export interface GalleryItemDto {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  serviceId: number;
  serviceName?: string | null;
  areaId?: number | null;
  areaName?: string | null;
  isFeatured: boolean;
  displayOrder: number;
}
export interface UpsertGalleryItemDto {
  title: string;
  description: string;
  imageUrl: string;
  serviceId: number;
  areaId?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}
export interface AdminGalleryItemDto extends UpsertGalleryItemDto {
  id: number;
  serviceName?: string | null;
  areaName?: string | null;
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}

export interface VideoItemDto {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  serviceId: number;
  serviceName?: string | null;
  areaId?: number | null;
  areaName?: string | null;
  isFeatured: boolean;
  displayOrder: number;
}
export interface UpsertVideoItemDto {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  serviceId: number;
  areaId?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}
export interface AdminVideoItemDto extends UpsertVideoItemDto {
  id: number;
  serviceName?: string | null;
  areaName?: string | null;
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}

export interface ReviewDto {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  displayOrder: number;
}
export interface UpsertReviewDto {
  customerName: string;
  rating: number;
  comment: string;
  isActive: boolean;
  displayOrder: number;
}
export interface AdminReviewDto extends UpsertReviewDto {
  id: number;
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}

export interface SiteSettingDto {
  siteName: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  workingHours: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tikTokUrl?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  metaTitle: string;
  metaDescription: string;
}
export interface SiteSectionDto {
  id: number;
  key: string;
  page: string;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  payloadJson?: string | null;
  isActive: boolean;
  displayOrder: number;
}
export type UpsertSiteSectionDto = Omit<SiteSectionDto, "id">;

export interface CreateServiceRequestDto {
  name?: string | null;
  phone: string;
  serviceId: number;
  areaId: number;
  notes?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
export interface ServiceRequestCreatedDto {
  id: number;
  status: string;
  message: string;
}
export interface UpdateServiceRequestDto extends CreateServiceRequestDto {
  scheduledAt?: ISODateString | null;
  finalPrice?: number | null;
  internalNotes?: string | null;
}
export interface UpdateServiceRequestStatusDto {
  status: RequestStatus;
}
export interface ServiceRequestStatusUpdatedDto {
  id: number;
  status: string;
  message: string;
}
export interface AdminServiceRequestQueryDto {
  page?: number;
  pageSize?: number;
  status?: RequestStatus | "";
  serviceId?: number;
  areaId?: number;
  search?: string;
  from?: string;
  to?: string;
}
export interface AdminServiceRequestListItemDto {
  id: number;
  name?: string | null;
  phone: string;
  clientUserId?: number | null;
  clientEmail?: string | null;
  serviceName: string;
  areaName: string;
  status: RequestStatus;
  createdAt: ISODateString;
  scheduledAt?: ISODateString | null;
  finalPrice?: number | null;
  hasLocation: boolean;
  isReplied: boolean;
  adminRepliedAt?: ISODateString | null;
}
export interface AdminServiceRequestDetailsDto {
  id: number;
  name?: string | null;
  phone: string;
  clientUserId?: number | null;
  clientEmail?: string | null;
  serviceId: number;
  serviceName: string;
  areaId: number;
  areaName: string;
  notes?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationUrl?: string | null;
  scheduledAt?: ISODateString | null;
  finalPrice?: number | null;
  internalNotes?: string | null;
  isReplied: boolean;
  adminReplyMessage?: string | null;
  adminRepliedAt?: ISODateString | null;
  adminReplySentAt?: ISODateString | null;
  status: RequestStatus;
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}
export interface ReplyToServiceRequestDto {
  message: string;
}
export interface ClientServiceRequestListItemDto {
  id: number;
  phone: string;
  serviceName: string;
  areaName: string;
  status: RequestStatus;
  isReplied: boolean;
  adminRepliedAt?: ISODateString | null;
  createdAt: ISODateString;
}
export interface ClientServiceRequestDetailsDto {
  id: number;
  name?: string | null;
  phone: string;
  serviceId: number;
  serviceName: string;
  areaId: number;
  areaName: string;
  notes?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationUrl?: string | null;
  scheduledAt?: ISODateString | null;
  finalPrice?: number | null;
  status: RequestStatus;
  isReplied: boolean;
  adminReplyMessage?: string | null;
  adminRepliedAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
}

export interface DashboardStatsDto {
  totalRequests: number;
  newRequests: number;
  scheduledRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  activeServices: number;
  activeAreas: number;
}
export interface RequestsTrendPointDto {
  label: string;
  requests: number;
}
export interface NamedCountDto {
  name: RequestStatus | string;
  value: number;
}
export interface ServicePerformanceDto {
  service: string;
  requests: number;
}
export interface AreaRequestsDto {
  area: string;
  requests: number;
}
export interface DashboardChartsDto {
  requestsTrend: RequestsTrendPointDto[];
  requestsByStatus: NamedCountDto[];
  servicesPerformance: ServicePerformanceDto[];
  areaRequests: AreaRequestsDto[];
}

export interface MediaAssetDto {
  id: number;
  fileName: string;
  storageObjectKey: string;
  googleFileId: string;
  publicUrl: string;
  webViewLink?: string | null;
  thumbnailUrl?: string | null;
  contentType: string;
  size: number;
  folder: string;
  createdAt: ISODateString;
}

export interface MediaFilters {
  serviceId?: number;
  serviceSlug?: string;
  areaId?: number;
  areaSlug?: string;
}
export type AdminResourceName =
  | "services"
  | "areas"
  | "gallery"
  | "videos"
  | "reviews"
  | "sections";
export type AdminResourceDto =
  | AdminServiceDto
  | AdminAreaDto
  | AdminGalleryItemDto
  | AdminVideoItemDto
  | AdminReviewDto
  | SiteSectionDto;
