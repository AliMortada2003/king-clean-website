import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../auth/AuthProvider";
import { PublicLayout } from "../components/public/PublicLayout";
import { PageLoading } from "../components/ui";
import { ScrollToTop } from "../components/ScrollToTop";

const HomePage = lazy(() =>
  import("../pages/public/HomePage/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);

const PublicServicesPage = lazy(() =>
  import("../pages/public/servicespage/ServicesPage").then((m) => ({ default: m.ServicesPage })),
);
const ServiceDetailsPage = lazy(() =>
  import("../pages/public/servicespage/ServiceDetailsPage").then((m) => ({ default: m.ServiceDetailsPage })),
);
const PublicAreasPage = lazy(() =>
  import("../pages/public/areaspage/AreasPage").then((m) => ({ default: m.AreasPage })),
);
const AreaDetailsPage = lazy(() =>
  import("../pages/public/areaspage/AreaDetailsPage").then((m) => ({ default: m.AreaDetailsPage })),
);
const PublicGalleryPage = lazy(() =>
  import("../pages/public/GalleryPage/GalleryPage").then((m) => ({ default: m.GalleryPage })),
);
const PublicVideosPage = lazy(() =>
  import("../pages/public/VideosPage/VideosPage").then((m) => ({ default: m.VideosPage })),
);
const PublicReviewsPage = lazy(() =>
  import("../pages/public/ReviewsPage/ReviewsPage").then((m) => ({ default: m.ReviewsPage })),
);
const AboutPage = lazy(() =>
  import("../pages/public/AboutPage/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ContactPage = lazy(() =>
  import("../pages/public/ContactPage/ContactPage").then((m) => ({ default: m.ContactPage })),
);

const NotFoundPage = lazy(() =>
  import("../pages/public/NotFoundPage").then((m) => ({ default: m.default }))
)

const RequestServicePage = lazy(() =>
  import("../pages/public/RequestServicePage").then((m) => ({
    default: m.RequestServicePage,
  })),
);

const LoginPage = lazy(() =>
  import("../pages/admin/login/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const AdminLayout = lazy(() =>
  import("../components/admin/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  })),
);
const DashboardPage = lazy(() =>
  import("../pages/admin/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const RequestsPage = lazy(() =>
  import("../pages/admin/requests/RequestsPage").then((m) => ({
    default: m.RequestsPage,
  })),
);
const RequestDetailsPage = lazy(() =>
  import("../pages/admin/requests/RequestDetailsPage").then((m) => ({
    default: m.RequestDetailsPage,
  })),
);
const ServicesPage = lazy(() =>
  import("../pages/admin/services/ServicesPage").then((m) => ({
    default: m.ServicesPage,
  })),
);
const AreasPage = lazy(() =>
  import("../pages/admin/areas/AreasPage").then((m) => ({
    default: m.AreasPage,
  })),
);
const GalleryPage = lazy(() =>
  import("../pages/admin/gallery/GalleryPage").then((m) => ({
    default: m.GalleryPage,
  })),
);
const VideosPage = lazy(() =>
  import("../pages/admin/videos/VideosPage").then((m) => ({
    default: m.VideosPage,
  })),
);
const ReviewsPage = lazy(() =>
  import("../pages/admin/reviews/ReviewsPage").then((m) => ({
    default: m.ReviewsPage,
  })),
);
const SectionsPage = lazy(() =>
  import("../pages/admin/sections/SectionsPage").then((m) => ({
    default: m.SectionsPage,
  })),
);
const SettingsPage = lazy(() =>
  import("../pages/admin/settings/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);

const UploadsPage = lazy(() =>
  import("../pages/admin/uploads/UploadsPage").then((m) => ({
    default: m.UploadsPage,
  })),
);

function LoadingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg)]">
      <div className="pointer-events-none absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-120px] h-96 w-96 rounded-full bg-[var(--color-teal)]/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <PageLoading label="جار تحميل KING CLEAN..." />
      </div>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<PublicServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailsPage />} />
          <Route path="areas" element={<PublicAreasPage />} />
          <Route path="areas/:slug" element={<AreaDetailsPage />} />
          <Route path="gallery" element={<PublicGalleryPage />} />
          <Route path="videos" element={<PublicVideosPage />} />
          <Route path="reviews" element={<PublicReviewsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="request-service" element={<RequestServicePage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin/login" element={<LoginPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestDetailsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="areas" element={<AreasPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="sections" element={<SectionsPage />} />
          <Route path="uploads" element={<UploadsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate replace to="/admin" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
