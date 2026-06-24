import type {
  AdminResourceName,
  AdminServiceRequestQueryDto,
  MediaFilters,
} from "../types/api";

export const keys = {
  health: ["health"] as const,
  settings: ["public", "settings"] as const,
  services: (areaSlug?: string) =>
    ["public", "services", areaSlug || "all"] as const,
  service: (slug: string) => ["public", "service", slug] as const,
  areas: ["public", "areas"] as const,
  area: (slug: string) => ["public", "area", slug] as const,
  gallery: (filters?: MediaFilters) =>
    ["public", "gallery", filters || {}] as const,
  videos: (filters?: MediaFilters) =>
    ["public", "videos", filters || {}] as const,
  reviews: ["public", "reviews"] as const,
  sections: (page?: string) => ["public", "sections", page || "all"] as const,
  section: (key: string) => ["public", "section", key] as const,
  dashboardStats: ["admin", "dashboard", "stats"] as const,
  dashboardCharts: (days: number) =>
    ["admin", "dashboard", "charts", days] as const,
  adminServices: ["admin", "services"] as const,
  adminService: (id: number) => ["admin", "services", id] as const,
  adminAreas: ["admin", "areas"] as const,
  adminArea: (id: number) => ["admin", "areas", id] as const,
  adminGallery: ["admin", "gallery"] as const,
  adminGalleryItem: (id: number) => ["admin", "gallery", id] as const,
  adminVideos: ["admin", "videos"] as const,
  adminVideo: (id: number) => ["admin", "videos", id] as const,
  adminReviews: ["admin", "reviews"] as const,
  adminReview: (id: number) => ["admin", "reviews", id] as const,
  adminSections: ["admin", "sections"] as const,
  adminSection: (id: number) => ["admin", "sections", id] as const,
  requests: (query: AdminServiceRequestQueryDto) =>
    ["admin", "requests", query] as const,
  request: (id: number) => ["admin", "request", id] as const,
  clientMe: ["client", "me"] as const,
  clientRequests: ["client", "requests"] as const,
  clientRequest: (id: number) => ["client", "request", id] as const,
  resource: (resource: AdminResourceName) => ["admin", resource] as const,
  resourceItem: (resource: AdminResourceName, id: number) =>
    ["admin", resource, id] as const,
  adminSettings: ["admin", "settings"] as const,
  upload: (id: number) => ["admin", "upload", id] as const,
};
