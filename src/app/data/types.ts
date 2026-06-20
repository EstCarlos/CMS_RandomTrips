/* ─────────────────────────────────────────────────────────
   RANDOM TRIPS CMS — Central type definitions
   Source of truth for all data model interfaces.
   Field naming: camelCase (identifiers), PascalCase (types),
   camelCase (enum string values), kebab-case (IDs).
───────────────────────────────────────────────────────── */

// ── Primitive ──────────────────────────────────────────

export interface Bilingual {
  es: string;
  en: string;
}

// ── Enum union types ───────────────────────────────────

export type TourType            = "singleDay" | "multiDay" | "privateRequest";
export type TourStatus          = "published" | "draft" | "archived";
export type PricingModelType    = "fixedPerPerson" | "tieredPerPax" | "fixedGroup";
export type BookingStatus       = "pendingPayment" | "depositPaid" | "fullyPaid" | "balanceOverdue" | "cancelled" | "completed";
export type PaymentType         = "deposit" | "balance" | "refund";
export type PaymentStatus       = "pending" | "paid" | "failed" | "refunded";
export type PaymentLinkStatus   = "pending" | "sent" | "paid" | "expired";
export type QuoteStatus         = "pending" | "sent" | "accepted" | "rejected";
export type OperatorType        = "internal" | "external";
export type UserRole            = "admin" | "staff" | "operator";
export type AvailabilityStatus  = "open" | "blocked" | "full" | "completed";
export type VoucherType         = "electronic" | "physical";
export type Difficulty          = "easy" | "moderate" | "moderateToHigh" | "high";
export type ServiceCategory     = "transportation" | "food" | "accommodation" | "guide" | "safety" | "taxes" | "extras" | "activity";
export type MediaAssetType      = "photo" | "video";
export type MediaAssetAssociation = "destination" | "experience" | "tour" | "global";
export type Currency            = "DOP" | "USD" | "EUR";
export type LanguageCode        = "es" | "en";

// ── Pricing ────────────────────────────────────────────

export interface Tier {
  pax: number;
  pricePerPerson: number;
}

export interface PricingModel {
  type: PricingModelType;
  currency: Currency;
  // fixedPerPerson
  pricePerPerson?: number;
  // tieredPerPax
  basePax?: number;
  basePricePerPerson?: number;
  tiers?: Tier[];
  minPax?: number;
  maxPax?: number;
  itbisIncluded?: boolean;
  // fixedGroup
  totalPrice?: number;
  maxPaxGroup?: number;
}

// ── SEO ────────────────────────────────────────────────

export interface SeoMeta {
  title: Bilingual;
  description: Bilingual;
  ogImageId?: string;
}

// ── Tour sub-entities ──────────────────────────────────

export interface DayAlternative {
  experienceId: string;
  priceDelta: number;
}

export interface Day {
  id: string;
  dayNumber: number;
  title: Bilingual;
  description: Bilingual;
  destinationIds: string[];
  experienceIds: string[];
  included: Bilingual;
  isSwappable: boolean;
  alternatives: DayAlternative[];
}

export interface TourDetails {
  duration: string;
  languages: string[];
  bookingWindow: string;
  voucherType: VoucherType;
  accessibility: string;
  petsAllowed: boolean;
  minAge: number | null;
  difficulty: Difficulty;
  sustainabilityNote: string;
}

export interface TourLogistics {
  departurePoint: string;
  departureTime: string;
  mapsUrl: string;
}

export interface IncludedService {
  serviceId: string;
  included: boolean;
  customNote: string;
}

// ── Tour ───────────────────────────────────────────────

export interface Tour {
  id: string;
  slug: string;
  title: Bilingual;
  description: Bilingual;
  shortDescription?: Bilingual;
  type: TourType;
  status: TourStatus;
  categories: string[];
  tags: string[];
  destinationIds: string[];
  experienceIds: string[];
  itinerary: Day[];
  pricingModel: PricingModel;
  maxCapacity: number;
  depositFixedAmount: number;
  depositPercentage?: number;
  includedServices: IncludedService[];
  details: TourDetails;
  galleryIds: string[];
  operatorId: string;
  seoMeta?: SeoMeta;
  logistics: TourLogistics;
  whatsappGroupUrl: string | null;
  // UI / aggregates
  activeBookings: number;
  totalBookings: number;
  lastUpdated: string;
  rating?: number;
  heroBg: string;
  emoji: string;
}

// ── Destination ────────────────────────────────────────

export interface Destination {
  id: string;
  slug: string;
  name: Bilingual;
  description: Bilingual;
  lat: string;
  lng: string;
  experienceCount: number;
  tourCount: number;
  status: TourStatus;
  emoji: string;
  color: string;
}

// ── Experience ─────────────────────────────────────────

export interface Experience {
  id: string;
  destinationId: string;
  name: Bilingual;
  description: Bilingual;
  type: string;        // e.g. "Montaña", "Aventura", "Playa"
  duration: string;
  basePrice: number;
  tourCount: number;
  status: TourStatus;
}

// ── ServiceCatalog ─────────────────────────────────────

export interface ServiceCatalogItem {
  id: string;
  name: Bilingual;
  icon: string;
  category: ServiceCategory;
  order: number;
}

// ── Availability ───────────────────────────────────────

export interface Availability {
  tourId: string;
  tourName?: string;   // display helper — derived from tourId lookup
  date: string;
  displayDate?: string;
  totalSeats: number;
  reservedSeats: number;
  availableSeats: number;
  status: AvailabilityStatus;
  priceOverride: number | null;
}

// ── Booking ────────────────────────────────────────────

export interface Booking {
  id: string;
  customerId: string;
  tourId: string;
  date: string;
  displayDate?: string;
  totalPax: number;
  paxBreakdown?: Record<string, number>;
  totalPrice: number;
  currency?: Currency;
  depositPaid: number;
  outstandingBalance: number;
  status: BookingStatus;
  operatorId?: string;
  itineraryConfig?: Record<string, unknown>;
  internalNotes?: string;
}

// ── Payment ────────────────────────────────────────────

export interface Payment {
  bookingId: string;
  type: PaymentType;
  amount: number;
  currency: Currency;
  paypalTxnId?: string;
  status: PaymentStatus;
  date: string;
}

// ── PaymentLink ────────────────────────────────────────

export interface PaymentLink {
  bookingId: string;
  amount: number;
  currency: Currency;
  invoiceId?: string;
  expiresAt: string;
  status: PaymentLinkStatus;
  reminders: string[];
}

// ── Quote ──────────────────────────────────────────────

export interface Quote {
  id: string;
  contact: { name?: string; email?: string; phone?: string };
  requestedDestinationIds: string[];
  requestedDates: string[];
  pax: number;
  approximateBudget?: number;
  message?: string;
  status: QuoteStatus;
  proposedPrice?: number;
  currency?: Currency;
  paymentLinkId?: string;
  assignedToUserId?: string;
  staffNotes?: string;
  respondedAt?: string;
  createdAt?: string;
}

// ── Customer ───────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  preferredLanguage: LanguageCode;
  preferredCurrency: Currency;
  paypalCustomerId?: string;
  bookingCount?: number;
}

// ── Operator ───────────────────────────────────────────

export interface Operator {
  id: string;
  type: OperatorType;
  name: string;
  contact?: { name?: string; phone?: string; email?: string; whatsapp?: string | null };
  assignedTourIds: string[];
  status: "active" | "inactive"; // TODO: confirmar naming
}

// ── User (CMS) ─────────────────────────────────────────

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  operatorId?: string;
  permissions: string[];
  lastLogin: string;
  status: "active" | "inactive";
}

// ── MediaAsset ─────────────────────────────────────────

export interface MediaAsset {
  id: string;
  name: string;
  type: MediaAssetType;
  association: MediaAssetAssociation;
  associatedTo: string;
  url: string;
  thumbUrl?: string;
  alt?: Bilingual;
  dimensions?: string;
  size?: string;
  uploadedAt?: string;
  color?: string;
  emoji?: string;
}

// ── Testimonial ────────────────────────────────────────

export interface Testimonial {
  id: string;
  customerName: string;
  tourId: string;
  tourName?: string;   // display helper
  content: Bilingual;
  rating: number;
  date: string;
  approved: boolean;
  order: number;
}

// ── FAQ ────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: Bilingual;
  answer: Bilingual;
  category: string;
  order: number;
  status: "published" | "draft";
}

// ── Page ───────────────────────────────────────────────

export interface Page {
  id: string;
  slug: string;
  title: Bilingual;
  content?: Bilingual;
  status: TourStatus;
  seoMeta?: { title?: string; description?: string };
}

// ── SiteConfig ─────────────────────────────────────────

export interface SiteConfig {
  contact: {
    whatsapp: string;
    whatsappSecondary?: string;
    email: string;
  };
  social: {
    instagram?: string;
  };
  exchangeRates: {
    base: Currency;
    USD: number;
    EUR: number;
  };
  defaultDeparturePoint: {
    name: string;
    address: string;
    mapsUrl: string;
  };
  paymentInfo: {
    bank: string;
    accountHolder: string;
    accountType: string;
    accountNumber: string;
    rnc: string;               // Dominican tax ID — local term kept
    defaultFixedDeposit: number;
    depositNote: string;
  };
  updatedAt?: string;
  updatedBy?: string;
}

// ── AuditLog ───────────────────────────────────────────

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  timestamp: string;
  userAgent?: string;
}
