export type Role =
  | 'Super Admin'
  | 'Platform Operator'
  | 'Support Agent'
  | 'Analyst'
  | 'Admin'
  | 'Operator'
  | 'Viewer'
  | 'Moderator';

export type PortalView = 'passenger' | 'org-admin' | 'super-admin';

export interface Organization {
  id: string;
  name: string;
  metroSystemName: string;
  city: string;
  country: string;
  countryFlag: string;
  metroType: 'Underground' | 'Light Rail' | 'Monorail';
  logoText: string;
  status: 'Active' | 'Pending' | 'Suspended';
  tier: 'Starter' | 'Professional' | 'Enterprise';
  journeys7d: number;
  userCount: number;
  uptime: number;
  createdAt: string;
  contactEmail: string;
  website: string;
  complianceChecklist: {
    paymentVerified: boolean;
    agreementSigned: boolean;
    gdprConfirmed: boolean;
  };
}

export interface FeatureToggles {
  stationToStation: boolean;
  indoorMaps: boolean;
  platformDirection: boolean;
  interchangeInstructions: boolean;
  qrIntegration: boolean;
  realtimeAlerts: boolean;
}

export interface MetroLine {
  id: string;
  code: string;
  name: string;
  color: string;
  textColor: string;
  stationsCount: number;
  status: 'Active' | 'Draft';
  passengers7d: number;
  frequencyMin: number;
  serviceHours: string;
  stations: string[];
}

export interface Station {
  id: string;
  code: string;
  name: string;
  lines: string[];
  type: 'Interchange' | 'Terminal' | 'Regular';
  platformsCount: number;
  status: 'Online' | 'Offline';
  lat: number;
  lng: number;
  address: string;
  accessibility: {
    elevators: boolean;
    escalators: boolean;
    toilets: boolean;
    wheelchair: boolean;
  };
}

export interface Platform {
  id: string;
  stationId: string;
  platformNumber: string;
  level: 'Ground' | 'Basement 1' | 'Mezzanine' | 'Track Level 2';
  direction: string;
  lines: string[];
  status: 'Online' | 'Offline';
  frequencyMin: number;
  boardingInstructions: string;
  qrCodeId: string;
}

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'Platform' | 'Exit' | 'Elevator' | 'Restroom' | 'Ticketing' | 'Interchange';
  targetId: string;
}

export interface IndoorMap {
  id: string;
  stationId: string;
  stationName: string;
  levelsCovered: string;
  lastUpdated: string;
  svgContent?: string;
  hotspots: Hotspot[];
}

export interface QRCodeItem {
  id: string;
  code: string;
  stationId: string;
  stationName: string;
  type: 'Entry' | 'Exit' | 'Info';
  status: 'Active' | 'Inactive';
  createdAt: string;
  payload: string;
}

export interface ServiceAlert {
  id: string;
  title: string;
  severity: 'Severe' | 'Major' | 'Minor';
  affectedLines: string[];
  duration: string;
  description: string;
  publishedAt: string;
  alternateRouteSuggestion: string;
  active: boolean;
}

export interface InterchangeGuide {
  id: string;
  stationId: string;
  name: string;
  connectedLines: string[];
  dwellTimeMinutes: number;
  complexity: 'Low' | 'Medium' | 'High';
  floorMapId: string;
  description: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    segmentTimeMinutes: number;
    iconType: 'exit' | 'stairs' | 'corridor' | 'board' | 'elevator';
  }[];
  videoTitle?: string;
}

export interface JourneyStep {
  stepNumber: number;
  actionType: 'Board' | 'Walk' | 'Change' | 'Exit';
  instruction: string;
  line?: string;
  lineColor?: string;
  lineTextColor?: string;
  platform?: string;
  trainDirection?: string;
  durationMinutes: number;
  distanceMeters?: number;
  liveStatus?: string;
  departureCountdownMin?: number;
  level?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  tag: string;
  totalTimeMinutes: number;
  fare: string;
  transferCount: number;
  walkingMinutes: number;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  steps: JourneyStep[];
  platformInfo: {
    trainNumber: string;
    direction: string;
    platformNumber: string;
    countdownMin: number;
    liveStatus: 'On Time' | 'Delayed 2 min' | 'Delayed 5 min';
  };
  interchangeVisual?: {
    fromLine: string;
    toLine: string;
    dwellTimeMin: number;
    corridorName: string;
    pathDescription: string;
    hasEscalator: boolean;
    hasElevator: boolean;
  };
}

export interface SupportTicket {
  id: string;
  orgId: string;
  orgName: string;
  subject: string;
  priority: 'Critical' | 'High' | 'Normal';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  assignedTo: string;
  messages: {
    sender: string;
    role: string;
    timestamp: string;
    text: string;
  }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  orgName: string;
  eventType: string;
  details: string;
  severity: 'Normal' | 'Warning' | 'Critical';
}

export interface SubscriptionPlan {
  id: string;
  name: 'Starter' | 'Professional' | 'Enterprise';
  priceMonthly: number;
  orgsSubscribed: number;
  features: string[];
  journeysQuota: string;
  storageQuota: string;
  supportLevel: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin: string;
  avatar: string;
  orgId?: string;
  status: 'Active' | 'Inactive';
}

export interface NavigationWaypoint {
  id: string;
  stepNumber: number;
  stageName: string;
  instruction: string;
  subInstruction: string;
  zone: string;
  level: string;
  distanceMeters: number;
  estimatedSeconds: number;
  actionType: 'Walk' | 'Scan' | 'Board' | 'Transit' | 'Alight' | 'Transfer' | 'Exit';
  line?: string;
  lineColor?: string;
  platform?: string;
  trainSpeedKmh?: number;
  enRouteStations?: string[];
  recalculatedFromOffRoute?: boolean;
  icon?: string;
}

export interface LiveTrackingState {
  isActive: boolean;
  currentWaypointIndex: number;
  distanceRemainingMeters: number;
  speedKmh: number;
  headingDegrees: number;
  isOffRoute: boolean;
  offRouteMessage: string | null;
  voiceGuidance: boolean;
  simulationPlaying: boolean;
}
