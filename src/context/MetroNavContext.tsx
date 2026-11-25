import React, { createContext, useContext, useState } from 'react';
import {
  PortalView,
  Organization,
  FeatureToggles,
  MetroLine,
  Station,
  Platform,
  IndoorMap,
  QRCodeItem,
  ServiceAlert,
  InterchangeGuide,
  RouteOption,
  SupportTicket,
  SystemLog,
  SubscriptionPlan,
  UserAccount,
  Hotspot,
} from '../types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_FEATURE_TOGGLES,
  INITIAL_LINES,
  INITIAL_STATIONS,
  INITIAL_PLATFORMS,
  INITIAL_INDOOR_MAPS,
  INITIAL_QR_CODES,
  INITIAL_SERVICE_ALERTS,
  INITIAL_INTERCHANGE_GUIDES,
  SAMPLE_ROUTE_OPTIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_SYSTEM_LOGS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_USERS,
} from '../data/mockData';

interface MetroNavContextType {
  // Portal & Org
  currentView: PortalView;
  setCurrentView: (view: PortalView) => void;
  activeOrg: Organization;
  setActiveOrgId: (id: string) => void;
  organizations: Organization[];
  updateOrganization: (org: Organization) => void;
  approveOrganization: (id: string) => void;
  rejectOrganization: (id: string) => void;
  suspendOrganization: (id: string) => void;

  // Feature Toggles
  featureToggles: FeatureToggles;
  toggleFeature: (key: keyof FeatureToggles) => void;

  // Passenger Journey Planner
  fromStation: string;
  setFromStation: (st: string) => void;
  toStation: string;
  setToStation: (st: string) => void;
  routeOptions: RouteOption[];
  selectedRoute: RouteOption;
  setSelectedRoute: (route: RouteOption) => void;
  isNavigatingLive: boolean;
  setIsNavigatingLive: (nav: boolean) => void;
  activeJourneyStep: number;
  setActiveJourneyStep: (step: number) => void;
  calculateRoute: (from: string, to: string) => void;

  // Lines
  lines: MetroLine[];
  addLine: (line: Omit<MetroLine, 'id'>) => void;
  updateLine: (line: MetroLine) => void;
  deleteLine: (id: string) => void;

  // Stations
  stations: Station[];
  addStation: (st: Omit<Station, 'id'>) => void;
  updateStation: (st: Station) => void;
  deleteStation: (id: string) => void;

  // Platforms
  platforms: Platform[];
  addPlatform: (pl: Omit<Platform, 'id'>) => void;
  updatePlatform: (pl: Platform) => void;
  deletePlatform: (id: string) => void;
  reorderPlatforms: (newOrder: Platform[]) => void;

  // Indoor Maps
  indoorMaps: IndoorMap[];
  addIndoorMap: (map: Omit<IndoorMap, 'id'>) => void;
  addHotspotToMap: (mapId: string, hotspot: Omit<Hotspot, 'id'>) => void;
  deleteIndoorMap: (id: string) => void;

  // QR Codes
  qrCodes: QRCodeItem[];
  generateQRCode: (item: Omit<QRCodeItem, 'id' | 'createdAt'>) => void;
  toggleQRCodeStatus: (id: string) => void;
  deleteQRCode: (id: string) => void;

  // Service Alerts
  alerts: ServiceAlert[];
  addAlert: (alert: Omit<ServiceAlert, 'id' | 'publishedAt'>) => void;
  toggleAlertActive: (id: string) => void;
  deleteAlert: (id: string) => void;

  // Interchange Guides
  interchangeGuides: InterchangeGuide[];
  selectedInterchange: InterchangeGuide | null;
  setSelectedInterchange: (guide: InterchangeGuide | null) => void;

  // Support Tickets
  tickets: SupportTicket[];
  replyToTicket: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  updateTicketPriority: (ticketId: string, priority: SupportTicket['priority']) => void;

  // Subscription Plans
  plans: SubscriptionPlan[];
  updatePlan: (plan: SubscriptionPlan) => void;

  // Logs & Users
  logs: SystemLog[];
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id' | 'lastLogin' | 'status'>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const MetroNavContext = createContext<MetroNavContextType | undefined>(undefined);

export const MetroNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<PortalView>('passenger');
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeOrgId, setActiveOrgId] = useState<string>('org-cmrl');
  const [featureToggles, setFeatureToggles] = useState<FeatureToggles>(INITIAL_FEATURE_TOGGLES);

  // Passenger Journey Planner State
  const [fromStation, setFromStation] = useState<string>('Puratchi Thalaivar Dr. M.G.R. Central');
  const [toStation, setToStation] = useState<string>('Chennai International Airport');
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>(SAMPLE_ROUTE_OPTIONS);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(SAMPLE_ROUTE_OPTIONS[0]);
  const [isNavigatingLive, setIsNavigatingLive] = useState<boolean>(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);

  // Entities
  const [lines, setLines] = useState<MetroLine[]>(INITIAL_LINES);
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [indoorMaps, setIndoorMaps] = useState<IndoorMap[]>(INITIAL_INDOOR_MAPS);
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>(INITIAL_QR_CODES);
  const [alerts, setAlerts] = useState<ServiceAlert[]>(INITIAL_SERVICE_ALERTS);
  const [interchangeGuides] = useState<InterchangeGuide[]>(INITIAL_INTERCHANGE_GUIDES);
  const [selectedInterchange, setSelectedInterchange] = useState<InterchangeGuide | null>(INITIAL_INTERCHANGE_GUIDES[0]);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_SYSTEM_LOGS);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  const toggleFeature = (key: keyof FeatureToggles) => {
    setFeatureToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`Feature toggle updated: ${String(key)} is now ${next[key] ? 'ENABLED' : 'DISABLED'}`);
      return next;
    });
  };

  const updateOrganization = (org: Organization) => {
    setOrganizations((prev) => prev.map((o) => (o.id === org.id ? org : o)));
    showToast(`Organization "${org.name}" saved successfully.`);
  };

  const approveOrganization = (id: string) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'Active' } : o))
    );
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        orgName: organizations.find((o) => o.id === id)?.name || id,
        eventType: 'Org Approved',
        details: 'Organization approved by Super Admin Devon Sterling.',
        severity: 'Normal',
      },
      ...prev,
    ]);
    showToast('Organization successfully approved and activated.');
  };

  const rejectOrganization = (id: string) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'Suspended' } : o))
    );
    showToast('Organization application rejected.');
  };

  const suspendOrganization = (id: string) => {
    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === 'Suspended' ? 'Active' : 'Suspended' } : o
      )
    );
    showToast('Organization status toggled.');
  };

  const calculateRoute = (from: string, to: string) => {
    setFromStation(from);
    setToStation(to);
    // dynamically generate realistic variations
    const updated = SAMPLE_ROUTE_OPTIONS.map((opt, idx) => ({
      ...opt,
      steps: opt.steps.map((st, sIdx) => {
        if (sIdx === 0) {
          return { ...st, instruction: `Board train at ${from}` };
        }
        if (sIdx === opt.steps.length - 1) {
          return { ...st, instruction: `Arrive at destination: ${to}` };
        }
        return st;
      }),
    }));
    setRouteOptions(updated);
    setSelectedRoute(updated[0]);
    setIsNavigatingLive(false);
    setActiveJourneyStep(0);
    showToast(`Calculated 3 optimal transit paths from ${from} to ${to}`);
  };

  // Lines CRUD
  const addLine = (line: Omit<MetroLine, 'id'>) => {
    const newLine: MetroLine = { ...line, id: `line-${Date.now()}` };
    setLines((prev) => [...prev, newLine]);
    showToast(`Line "${newLine.code} - ${newLine.name}" added successfully.`);
  };

  const updateLine = (line: MetroLine) => {
    setLines((prev) => prev.map((l) => (l.id === line.id ? line : l)));
    showToast(`Line "${line.code}" updated.`);
  };

  const deleteLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    showToast('Line deleted.');
  };

  // Stations CRUD
  const addStation = (st: Omit<Station, 'id'>) => {
    const newSt: Station = { ...st, id: `st-${Date.now()}` };
    setStations((prev) => [...prev, newSt]);
    showToast(`Station "${newSt.name}" created.`);
  };

  const updateStation = (st: Station) => {
    setStations((prev) => prev.map((s) => (s.id === st.id ? st : s)));
    showToast(`Station "${st.name}" updated.`);
  };

  const deleteStation = (id: string) => {
    setStations((prev) => prev.filter((s) => s.id !== id));
    showToast('Station removed.');
  };

  // Platforms CRUD & Reorder
  const addPlatform = (pl: Omit<Platform, 'id'>) => {
    const newPl: Platform = { ...pl, id: `plat-${Date.now()}` };
    setPlatforms((prev) => [...prev, newPl]);
    showToast(`Platform "${newPl.platformNumber}" configured.`);
  };

  const updatePlatform = (pl: Platform) => {
    setPlatforms((prev) => prev.map((p) => (p.id === pl.id ? pl : p)));
    showToast(`Platform "${pl.platformNumber}" updated.`);
  };

  const deletePlatform = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id));
    showToast('Platform deleted.');
  };

  const reorderPlatforms = (newOrder: Platform[]) => {
    setPlatforms(newOrder);
    showToast('Platforms sequence reordered.');
  };

  // Indoor Maps
  const addIndoorMap = (map: Omit<IndoorMap, 'id'>) => {
    const newMap: IndoorMap = { ...map, id: `map-${Date.now()}` };
    setIndoorMaps((prev) => [...prev, newMap]);
    showToast(`Indoor map for "${newMap.stationName}" published.`);
  };

  const addHotspotToMap = (mapId: string, hotspot: Omit<Hotspot, 'id'>) => {
    setIndoorMaps((prev) =>
      prev.map((m) => {
        if (m.id !== mapId) return m;
        return {
          ...m,
          hotspots: [...m.hotspots, { ...hotspot, id: `hs-${Date.now()}` }],
        };
      })
    );
    showToast(`Hotspot "${hotspot.name}" placed on map.`);
  };

  const deleteIndoorMap = (id: string) => {
    setIndoorMaps((prev) => prev.filter((m) => m.id !== id));
    showToast('Indoor map deleted.');
  };

  // QR Codes
  const generateQRCode = (item: Omit<QRCodeItem, 'id' | 'createdAt'>) => {
    const newQR: QRCodeItem = {
      ...item,
      id: `qr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQrCodes((prev) => [newQR, ...prev]);
    showToast(`Generated QR code: ${newQR.code}`);
  };

  const toggleQRCodeStatus = (id: string) => {
    setQrCodes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: q.status === 'Active' ? 'Inactive' : 'Active' } : q
      )
    );
    showToast('QR Code status toggled.');
  };

  const deleteQRCode = (id: string) => {
    setQrCodes((prev) => prev.filter((q) => q.id !== id));
    showToast('QR Code deleted.');
  };

  // Alerts
  const addAlert = (alert: Omit<ServiceAlert, 'id' | 'publishedAt'>) => {
    const newAlert: ServiceAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      publishedAt: 'Just now',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Alert published: "${newAlert.title}"`);
  };

  const toggleAlertActive = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    showToast('Service alert updated.');
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert removed.');
  };

  // Support Tickets
  const replyToTicket = (ticketId: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'In Progress',
          messages: [
            ...t.messages,
            {
              sender: 'Devon Sterling',
              role: 'Super Admin',
              timestamp: 'Just now',
              text,
            },
          ],
        };
      })
    );
    showToast('Reply dispatched to organization operator.');
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    showToast(`Ticket status updated to ${status}.`);
  };

  const updateTicketPriority = (ticketId: string, priority: SupportTicket['priority']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, priority } : t))
    );
    showToast(`Ticket priority changed to ${priority}.`);
  };

  // Plans
  const updatePlan = (plan: SubscriptionPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
    showToast(`Plan "${plan.name}" details updated.`);
  };

  // Users
  const addUser = (user: Omit<UserAccount, 'id' | 'lastLogin' | 'status'>) => {
    const newUser: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
      lastLogin: 'Never',
      status: 'Active',
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Invited ${newUser.name} as ${newUser.role}.`);
  };

  return (
    <MetroNavContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeOrg,
        setActiveOrgId,
        organizations,
        updateOrganization,
        approveOrganization,
        rejectOrganization,
        suspendOrganization,
        featureToggles,
        toggleFeature,
        fromStation,
        setFromStation,
        toStation,
        setToStation,
        routeOptions,
        selectedRoute,
        setSelectedRoute,
        isNavigatingLive,
        setIsNavigatingLive,
        activeJourneyStep,
        setActiveJourneyStep,
        calculateRoute,
        lines,
        addLine,
        updateLine,
        deleteLine,
        stations,
        addStation,
        updateStation,
        deleteStation,
        platforms,
        addPlatform,
        updatePlatform,
        deletePlatform,
        reorderPlatforms,
        indoorMaps,
        addIndoorMap,
        addHotspotToMap,
        deleteIndoorMap,
        qrCodes,
        generateQRCode,
        toggleQRCodeStatus,
        deleteQRCode,
        alerts,
        addAlert,
        toggleAlertActive,
        deleteAlert,
        interchangeGuides,
        selectedInterchange,
        setSelectedInterchange,
        tickets,
        replyToTicket,
        updateTicketStatus,
        updateTicketPriority,
        plans,
        updatePlan,
        logs,
        users,
        addUser,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </MetroNavContext.Provider>
  );
};

export const useMetroNav = () => {
  const context = useContext(MetroNavContext);
  if (!context) {
    throw new Error('useMetroNav must be used within a MetroNavProvider');
  }
  return context;
};
