import {
    ArrowLeft,
    CirclePlay,
    ExternalLink,
    Mail,
    MapPin,
    Phone,
    Star,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
    useArea,
    useAreas,
    useGallery,
    useReviews,
    useSection,
    useService,
    useServices,
    useSettings,
    useVideos,
} from "../../api/hooks";
import { Seo } from "../../components/Seo";
import {
    PageHero,
    ServiceCard,
} from "../../components/public/PublicPrimitives";
import { EmptyState, ErrorState, PageLoading } from "../../components/ui";
import { resolveMediaUrl } from "../../lib/api-client";
import { whatsAppUrl } from "../../lib/format";
import type { MediaFilters } from "../../types/api";







