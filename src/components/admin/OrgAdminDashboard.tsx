import React, { useState } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  MetroLine,
  Station,
  Platform,
  IndoorMap,
  QRCodeItem,
  ServiceAlert,
  Hotspot,
} from '../../types';
import {
  HOURLY_PASSENGER_DATA,
  TOP_ROUTES_DATA,
} from '../../data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  LayoutDashboard,
  Train,
  MapPin,
  Layers,
  Map as MapIcon,
  QrCode,
  BarChart3,
  AlertTriangle,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  ArrowRight,
  GripVertical,
  CheckCircle,
  Eye,
  X,
  CreditCard,
  Users,
  Radio,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react';

export const OrgAdminDashboard: React.FC = () => {
  const {
    activeOrg,
    updateOrganization,
    featureToggles,
    toggleFeature,
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
    showToast,
  } = useMetroNav();

  // Active Admin Sub-page
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'lines'
    | 'stations'
    | 'platforms'
    | 'maps'
    | 'qrcodes'
    | 'analytics'
    | 'alerts'
    | 'settings'
  >('overview');

  // Modals & Drawers States
  const [selectedLineForEdit, setSelectedLineForEdit] = useState<MetroLine | null>(null);
  const [isLineDrawerOpen, setIsLineDrawerOpen] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [selectedStationForEdit, setSelectedStationForEdit] = useState<Station | null>(null);
  const [isPlatformDrawerOpen, setIsPlatformDrawerOpen] = useState(false);
  const [selectedPlatformForEdit, setSelectedPlatformForEdit] = useState<Platform | null>(null);
  const [selectedPlatformStationId, setSelectedPlatformStationId] = useState<string>(stations[0]?.id || 'st-times-sq');
  const [isMapUploadModalOpen, setIsMapUploadModalOpen] = useState(false);
  const [selectedMapForEditor, setSelectedMapForEditor] = useState<IndoorMap | null>(null);
  const [isQRGeneratorModalOpen, setIsQRGeneratorModalOpen] = useState(false);
  const [previewQRCode, setPreviewQRCode] = useState<QRCodeItem | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Settings Tab
  const [settingsActiveTab, setSettingsActiveTab] = useState<'info' | 'features' | 'billing' | 'users' | 'integrations'>('features');

  // Filter States for Stations
  const [stationLineFilter, setStationLineFilter] = useState<string>('ALL');
  const [stationTypeFilter, setStationTypeFilter] = useState<string>('ALL');
  const [stationSearchQuery, setStationSearchQuery] = useState<string>('');
  const [stationSortAsc, setStationSortAsc] = useState<boolean>(true);

  // Filtered Stations
  const filteredStations = stations.filter((st) => {
    if (stationLineFilter !== 'ALL' && !st.lines.includes(stationLineFilter)) return false;
    if (stationTypeFilter !== 'ALL' && st.type !== stationTypeFilter) return false;
    if (
      stationSearchQuery &&
      !st.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) &&
      !st.code.toLowerCase().includes(stationSearchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Drag and drop platform reorder simulation
  const handleMovePlatform = (index: number, direction: 'up' | 'down') => {
    const list = [...platforms.filter((p) => p.stationId === selectedPlatformStationId)];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    reorderPlatforms(list);
  };

  return (
    <div className="min-h-screen bg-[#E4E2DD] text-[#1E1E1E]">
      {/* Admin Sub-Navbar / Sidebar Header */}
      <div className="bg-[#1E1E1E] text-[#E4E2DD] border-b-2 border-[#3F66C2] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold">
            Organization Administration Hub
          </div>
          <h1 className="clash text-2xl md:text-3xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
            <span>{activeOrg.name}</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-[#3F66C2] text-white">
              {activeOrg.status}
            </span>
          </h1>
        </div>

        {/* Quick Tabs Bar */}
        <div className="flex flex-wrap gap-1 text-xs font-mono uppercase font-bold">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'lines', label: 'Lines', icon: Train },
            { id: 'stations', label: 'Stations', icon: MapPin },
            { id: 'platforms', label: 'Platforms', icon: Layers },
            { id: 'maps', label: 'Indoor Maps', icon: MapIcon },
            { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'alerts', label: 'Service Alerts', icon: AlertTriangle },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 border flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'border-[#3F66C2] bg-[#3F66C2] text-white shadow-sm'
                    : 'border-white/10 bg-white/5 text-[#E4E2DD]/80 hover:bg-white/15'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ======================================================== */}
        {/* PAGE 1: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-entrance">
            {/* Header + Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Telemetry &amp; Operational Capacity
                </span>
                <h2 className="clash text-4xl font-bold uppercase tracking-tight text-[#1E1E1E]">
                  Authority Control Dashboard
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedLineForEdit(null);
                    setIsLineDrawerOpen(true);
                  }}
                  className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Configure Line</span>
                </button>
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-4 py-2 border-2 border-[#1E1E1E] text-[#1E1E1E] text-xs font-mono uppercase font-bold hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
                >
                  Publish Alert
                </button>
                <button
                  onClick={() => showToast('Exported Analytics Report CSV to downloads.')}
                  className="px-4 py-2 border-2 border-[#3F66C2] text-[#3F66C2] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] hover:text-white transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* 4 Stats Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">
                  Daily Passengers (7d Avg)
                </span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">
                  3.82M
                </div>
                <div className="text-xs font-mono text-emerald-700 font-bold mt-1">
                  ↑ +4.2% vs previous week
                </div>
              </div>

              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">
                  Active Live Journeys
                </span>
                <div className="clash text-4xl font-bold text-[#3F66C2] mt-2">
                  142,500
                </div>
                <div className="text-xs font-mono text-[#444444] mt-1">
                  Across 8 lines &amp; 38 stations
                </div>
              </div>

              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">
                  Service Uptime Index
                </span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">
                  {activeOrg.uptime}%
                </div>
                <div className="text-xs font-mono text-emerald-700 font-bold mt-1">
                  Telemetry SLA Met (99.9% target)
                </div>
              </div>

              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">
                  Open Support Queue
                </span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">
                  14 Tickets
                </div>
                <div className="text-xs font-mono text-[#3F66C2] font-bold mt-1">
                  1 Critical Escalation Active
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Hourly Passenger Volume Line Chart (8 cols) */}
              <div className="lg:col-span-8 p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl">
                <div className="flex justify-between items-center border-b border-[#1E1E1E]/20 pb-4 mb-4">
                  <div>
                    <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E]">
                      Hourly Passenger Volume Trend
                    </h3>
                    <p className="text-xs font-mono text-[#444444]">
                      Aggregated station entrance turnstiles vs train carrying capacity
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-[#3F66C2] text-white font-bold">
                    Peak: 512,000 / hr
                  </span>
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HOURLY_PASSENGER_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" opacity={0.15} />
                      <XAxis dataKey="hour" stroke="#1E1E1E" fontSize={11} fontFamily="JetBrains Mono" />
                      <YAxis stroke="#1E1E1E" fontSize={11} fontFamily="JetBrains Mono" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1E',
                          border: '2px solid #3F66C2',
                          color: '#E4E2DD',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="passengers"
                        stroke="#3F66C2"
                        strokeWidth={3}
                        fill="#3F66C2"
                        fillOpacity={0.2}
                        name="Passenger Load"
                      />
                      <Area
                        type="monotone"
                        dataKey="capacity"
                        stroke="#1E1E1E"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        fill="none"
                        name="Design Capacity"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Popular Routes Bar Chart (4 cols) */}
              <div className="lg:col-span-4 p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E] border-b border-[#1E1E1E]/20 pb-3 mb-4">
                    Top 5 Corridors
                  </h3>
                  <div className="space-y-3">
                    {TOP_ROUTES_DATA.slice(0, 5).map((rt, i) => (
                      <div key={rt.route} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="font-bold text-[#1E1E1E]">{rt.route}</span>
                          <span className="text-[#3F66C2] font-bold">
                            {(rt.count / 1000).toFixed(0)}k trips
                          </span>
                        </div>
                        <div className="w-full bg-[#1E1E1E]/10 h-2">
                          <div
                            className="bg-[#3F66C2] h-2"
                            style={{ width: `${(rt.count / 184500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E1E1E]/20 text-xs font-mono text-[#444444]">
                  Total 7d Trips Recorded: <span className="font-bold text-[#1E1E1E]">14,250,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: METRO LINES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'lines' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Route Network Hierarchy
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Metro Lines Management
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedLineForEdit(null);
                  setIsLineDrawerOpen(true);
                }}
                className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Line</span>
              </button>
            </div>

            {/* Lines Table */}
            <div className="bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b-2 border-[#1E1E1E] text-xs font-mono uppercase tracking-widest bg-black/5">
                  <tr>
                    <th className="p-4">Line</th>
                    <th className="p-4">Official Route Name</th>
                    <th className="p-4">Stations</th>
                    <th className="p-4">Headway</th>
                    <th className="p-4">7d Traffic</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]/10 font-satoshi">
                  {lines.map((ln) => (
                    <tr key={ln.id} className="hover:bg-[#5C82E6]/10 transition-colors">
                      <td className="p-4 font-bold">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center font-clash text-sm font-bold shadow-sm"
                          style={{ backgroundColor: ln.color, color: ln.textColor }}
                        >
                          {ln.code}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-base text-[#1E1E1E]">
                        {ln.name}
                      </td>
                      <td className="p-4 font-mono text-xs text-[#444444]">
                        {ln.stationsCount} Stations
                      </td>
                      <td className="p-4 font-mono text-xs">
                        Every {ln.frequencyMin} mins
                      </td>
                      <td className="p-4 font-mono text-xs font-bold text-[#3F66C2]">
                        {(ln.passengers7d / 1000000).toFixed(2)}M
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase ${
                            ln.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-black/10 text-[#444444]'
                          }`}
                        >
                          {ln.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLineForEdit(ln);
                            setIsLineDrawerOpen(true);
                          }}
                          className="p-1.5 border border-[#1E1E1E] hover:bg-[#3F66C2] hover:text-white transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLine(ln.id)}
                          className="p-1.5 border border-[#1E1E1E] hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Line Add/Edit Slide-in Drawer */}
            {isLineDrawerOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
                <div className="w-full max-w-md bg-[#E4E2DD] border-l-4 border-[#3F66C2] p-8 h-full shadow-2xl overflow-y-auto animate-entrance flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
                      <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                        {selectedLineForEdit ? 'Edit Metro Line' : 'Add New Metro Line'}
                      </h3>
                      <button
                        onClick={() => setIsLineDrawerOpen(false)}
                        className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Line Code (e.g. L, 1, A, 7)
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedLineForEdit?.code || ''}
                          id="lineCodeInput"
                          className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-2 clash font-bold text-xl focus:outline-none focus:border-[#3F66C2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Line Name Description
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedLineForEdit?.name || ''}
                          id="lineNameInput"
                          className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-2 text-base font-bold focus:outline-none focus:border-[#3F66C2]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                            Line Color Hex
                          </label>
                          <input
                            type="text"
                            defaultValue={selectedLineForEdit?.color || '#3F66C2'}
                            id="lineColorInput"
                            className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-2 font-mono text-sm focus:outline-none focus:border-[#3F66C2]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                            Headway (min)
                          </label>
                          <input
                            type="number"
                            defaultValue={selectedLineForEdit?.frequencyMin || 3}
                            id="lineFreqInput"
                            className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-2 font-mono text-sm focus:outline-none focus:border-[#3F66C2]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Operational Status
                        </label>
                        <select
                          id="lineStatusInput"
                          defaultValue={selectedLineForEdit?.status || 'Active'}
                          className="w-full bg-transparent border-2 border-[#1E1E1E] py-2 px-3 font-mono text-xs font-bold"
                        >
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-[#1E1E1E] flex gap-3">
                    <button
                      onClick={() => {
                        const code = (document.getElementById('lineCodeInput') as HTMLInputElement).value;
                        const name = (document.getElementById('lineNameInput') as HTMLInputElement).value;
                        const color = (document.getElementById('lineColorInput') as HTMLInputElement).value;
                        const freq = Number((document.getElementById('lineFreqInput') as HTMLInputElement).value) || 3;
                        const status = (document.getElementById('lineStatusInput') as HTMLSelectElement).value as any;

                        if (selectedLineForEdit) {
                          updateLine({
                            ...selectedLineForEdit,
                            code,
                            name,
                            color,
                            frequencyMin: freq,
                            status,
                          });
                        } else {
                          addLine({
                            code,
                            name,
                            color,
                            textColor: '#FFFFFF',
                            stationsCount: 12,
                            status,
                            passengers7d: 850000,
                            frequencyMin: freq,
                            serviceHours: '24 Hours / 7 Days',
                            stations: ['Terminal 1', 'Main St', 'Terminal 2'],
                          });
                        }
                        setIsLineDrawerOpen(false);
                      }}
                      className="flex-1 py-3 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                    >
                      Save Line Configuration
                    </button>
                    <button
                      onClick={() => setIsLineDrawerOpen(false)}
                      className="px-4 py-3 border-2 border-[#1E1E1E] text-xs font-mono uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: STATIONS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'stations' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Geographic Station Nodes
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Station Directory Management
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedStationForEdit(null);
                  setIsStationModalOpen(true);
                }}
                className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Station</span>
              </button>
            </div>

            {/* Filter Controls Bar */}
            <div className="p-4 bg-white/40 border-2 border-[#1E1E1E] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Filter stations..."
                  value={stationSearchQuery}
                  onChange={(e) => setStationSearchQuery(e.target.value)}
                  className="bg-transparent border-b-2 border-[#1E1E1E] py-1 px-2 font-mono text-xs focus:outline-none focus:border-[#3F66C2]"
                />

                {/* Filter by Line */}
                <select
                  value={stationLineFilter}
                  onChange={(e) => setStationLineFilter(e.target.value)}
                  className="bg-transparent border border-[#1E1E1E] py-1 px-2 font-mono text-xs"
                >
                  <option value="ALL">All Lines</option>
                  {lines.map((l) => (
                    <option key={l.code} value={l.code}>
                      Line {l.code}
                    </option>
                  ))}
                </select>

                {/* Filter by Type */}
                <select
                  value={stationTypeFilter}
                  onChange={(e) => setStationTypeFilter(e.target.value)}
                  className="bg-transparent border border-[#1E1E1E] py-1 px-2 font-mono text-xs"
                >
                  <option value="ALL">All Station Types</option>
                  <option value="Interchange">Interchange Hubs</option>
                  <option value="Terminal">Terminals</option>
                  <option value="Regular">Regular Stops</option>
                </select>
              </div>

              <div className="text-xs font-mono text-[#444444]">
                Showing {filteredStations.length} of {stations.length} stations
              </div>
            </div>

            {/* Stations Table */}
            <div className="bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b-2 border-[#1E1E1E] text-xs font-mono uppercase tracking-widest bg-black/5">
                  <tr>
                    <th className="p-4 cursor-pointer" onClick={() => setStationSortAsc(!stationSortAsc)}>
                      Station Name {stationSortAsc ? '↑' : '↓'}
                    </th>
                    <th className="p-4">Connected Lines</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Platforms</th>
                    <th className="p-4">Accessibility</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]/10 font-satoshi">
                  {filteredStations.map((st) => (
                    <tr key={st.id} className="hover:bg-[#5C82E6]/10 transition-colors">
                      <td className="p-4 font-bold text-base text-[#1E1E1E]">
                        <div className="flex items-center gap-2">
                          <span>{st.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black/10">
                            {st.code}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {st.lines.slice(0, 5).map((ln) => (
                            <span
                              key={ln}
                              className="w-5 h-5 rounded-full bg-[#1E1E1E] text-white text-[10px] font-bold font-mono flex items-center justify-center"
                            >
                              {ln}
                            </span>
                          ))}
                          {st.lines.length > 5 && (
                            <span className="text-[10px] font-mono text-[#444444] self-center">
                              +{st.lines.length - 5}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs">{st.type}</td>
                      <td className="p-4 font-mono text-xs">{st.platformsCount} platforms</td>
                      <td className="p-4">
                        <div className="flex gap-1.5 text-xs">
                          {st.accessibility.elevators && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-mono text-[9px] font-bold">
                              ELEVATOR
                            </span>
                          )}
                          {st.accessibility.wheelchair && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold">
                              ADA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{st.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStationForEdit(st);
                            setIsStationModalOpen(true);
                          }}
                          className="p-1.5 border border-[#1E1E1E] hover:bg-[#3F66C2] hover:text-white transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStation(st.id)}
                          className="p-1.5 border border-[#1E1E1E] hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Station Edit Modal */}
            {isStationModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-[#E4E2DD] border-4 border-[#1E1E1E] max-w-lg w-full p-6 shadow-2xl space-y-6 animate-entrance">
                  <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
                    <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                      {selectedStationForEdit ? 'Edit Station Node' : 'New Station Node'}
                    </h3>
                    <button
                      onClick={() => setIsStationModalOpen(false)}
                      className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Station Name
                      </label>
                      <input
                        type="text"
                        id="stNameInput"
                        defaultValue={selectedStationForEdit?.name || ''}
                        className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 clash text-lg font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Station Code
                        </label>
                        <input
                          type="text"
                          id="stCodeInput"
                          defaultValue={selectedStationForEdit?.code || 'ST-01'}
                          className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Station Type
                        </label>
                        <select
                          id="stTypeInput"
                          defaultValue={selectedStationForEdit?.type || 'Interchange'}
                          className="w-full bg-transparent border-2 border-[#1E1E1E] py-1 px-2 font-mono text-xs"
                        >
                          <option value="Interchange">Interchange</option>
                          <option value="Regular">Regular</option>
                          <option value="Terminal">Terminal</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Address / Street Coordinate
                      </label>
                      <input
                        type="text"
                        id="stAddressInput"
                        defaultValue={selectedStationForEdit?.address || 'Broadway & 42nd St'}
                        className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-satoshi"
                      />
                    </div>

                    {/* Accessibility Checkboxes */}
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-2">
                        Station Accessibility Toggles
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={selectedStationForEdit?.accessibility.elevators ?? true} id="accElevator" />
                          <span>Elevator Access</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={selectedStationForEdit?.accessibility.escalators ?? true} id="accEscalator" />
                          <span>Escalators</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={selectedStationForEdit?.accessibility.wheelchair ?? true} id="accWheelchair" />
                          <span>ADA Step-Free</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={selectedStationForEdit?.accessibility.toilets ?? true} id="accToilets" />
                          <span>Public Restrooms</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#1E1E1E] flex gap-3">
                    <button
                      onClick={() => {
                        const name = (document.getElementById('stNameInput') as HTMLInputElement).value;
                        const code = (document.getElementById('stCodeInput') as HTMLInputElement).value;
                        const type = (document.getElementById('stTypeInput') as HTMLSelectElement).value as any;
                        const address = (document.getElementById('stAddressInput') as HTMLInputElement).value;
                        const elevators = (document.getElementById('accElevator') as HTMLInputElement).checked;
                        const escalators = (document.getElementById('accEscalator') as HTMLInputElement).checked;
                        const wheelchair = (document.getElementById('accWheelchair') as HTMLInputElement).checked;
                        const toilets = (document.getElementById('accToilets') as HTMLInputElement).checked;

                        if (selectedStationForEdit) {
                          updateStation({
                            ...selectedStationForEdit,
                            name,
                            code,
                            type,
                            address,
                            accessibility: { elevators, escalators, wheelchair, toilets },
                          });
                        } else {
                          addStation({
                            name,
                            code,
                            lines: ['1', 'L'],
                            type,
                            platformsCount: 4,
                            status: 'Online',
                            lat: 40.75,
                            lng: -73.98,
                            address,
                            accessibility: { elevators, escalators, wheelchair, toilets },
                          });
                        }
                        setIsStationModalOpen(false);
                      }}
                      className="flex-1 py-3 bg-[#1E1E1E] text-white font-mono text-xs uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                    >
                      Save Station
                    </button>
                    <button
                      onClick={() => setIsStationModalOpen(false)}
                      className="px-4 py-3 border-2 border-[#1E1E1E] font-mono text-xs uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: PLATFORMS MANAGEMENT (Drag to reorder) */}
        {/* ======================================================== */}
        {activeTab === 'platforms' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Track-Level Precision
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Platform Configuration &amp; Reordering
                </h2>
              </div>

              {/* Station Dropdown Filter */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase font-bold text-[#444444]">Station:</span>
                <select
                  value={selectedPlatformStationId}
                  onChange={(e) => setSelectedPlatformStationId(e.target.value)}
                  className="bg-transparent border-2 border-[#1E1E1E] py-2 px-3 font-mono text-xs font-bold"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setSelectedPlatformForEdit(null);
                    setIsPlatformDrawerOpen(true);
                  }}
                  className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Platform</span>
                </button>
              </div>
            </div>

            {/* Platform List Cards with Drag Reorder Simulation */}
            <div className="space-y-4">
              {platforms
                .filter((p) => p.stationId === selectedPlatformStationId)
                .map((plat, idx, arr) => (
                  <div
                    key={plat.id}
                    className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#3F66C2] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMovePlatform(idx, 'up')}
                          className="w-6 h-6 border border-[#1E1E1E] text-xs flex items-center justify-center hover:bg-[#3F66C2] hover:text-white disabled:opacity-20"
                        >
                          ▲
                        </button>
                        <button
                          disabled={idx === arr.length - 1}
                          onClick={() => handleMovePlatform(idx, 'down')}
                          className="w-6 h-6 border border-[#1E1E1E] text-xs flex items-center justify-center hover:bg-[#3F66C2] hover:text-white disabled:opacity-20"
                        >
                          ▼
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="clash text-2xl font-bold uppercase text-[#3F66C2]">
                            {plat.platformNumber}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 bg-black/10 uppercase">
                            Level: {plat.level}
                          </span>
                        </div>
                        <div className="satoshi text-base font-bold text-[#1E1E1E] mt-1">
                          Direction: {plat.direction}
                        </div>
                        <p className="satoshi text-xs text-[#444444] mt-1 max-w-xl">
                          {plat.boardingInstructions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-right text-xs font-mono">
                        <div className="font-bold text-[#1E1E1E]">QR: {plat.qrCodeId}</div>
                        <div className="text-emerald-700 font-bold">• {plat.status}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPlatformForEdit(plat);
                            setIsPlatformDrawerOpen(true);
                          }}
                          className="p-2 border border-[#1E1E1E] hover:bg-[#3F66C2] hover:text-white transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlatform(plat.id)}
                          className="p-2 border border-[#1E1E1E] hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Platform Edit Drawer */}
            {isPlatformDrawerOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
                <div className="w-full max-w-md bg-[#E4E2DD] border-l-4 border-[#3F66C2] p-8 h-full shadow-2xl overflow-y-auto animate-entrance flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
                      <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                        {selectedPlatformForEdit ? 'Edit Platform' : 'Add Platform'}
                      </h3>
                      <button
                        onClick={() => setIsPlatformDrawerOpen(false)}
                        className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Platform # (e.g. 1A, 2B, Track 7)
                        </label>
                        <input
                          type="text"
                          id="platNumInput"
                          defaultValue={selectedPlatformForEdit?.platformNumber || '1A'}
                          className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 clash text-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Floor Level
                        </label>
                        <select
                          id="platLevelInput"
                          defaultValue={selectedPlatformForEdit?.level || 'Ground'}
                          className="w-full bg-transparent border-2 border-[#1E1E1E] py-2 px-3 font-mono text-xs font-bold"
                        >
                          <option value="Ground">Ground</option>
                          <option value="Basement 1">Basement 1</option>
                          <option value="Mezzanine">Mezzanine</option>
                          <option value="Track Level 2">Track Level 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Train Destination Direction
                        </label>
                        <input
                          type="text"
                          id="platDirInput"
                          defaultValue={selectedPlatformForEdit?.direction || 'Uptown & The Bronx'}
                          className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Boarding &amp; Egress Instructions
                        </label>
                        <textarea
                          id="platInstInput"
                          rows={3}
                          defaultValue={
                            selectedPlatformForEdit?.boardingInstructions ||
                            'Center cars align with escalator to mezzanine exit.'
                          }
                          className="w-full bg-transparent border-2 border-[#1E1E1E] p-2 text-xs font-satoshi"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-[#1E1E1E] flex gap-3">
                    <button
                      onClick={() => {
                        const num = (document.getElementById('platNumInput') as HTMLInputElement).value;
                        const level = (document.getElementById('platLevelInput') as HTMLSelectElement).value as any;
                        const dir = (document.getElementById('platDirInput') as HTMLInputElement).value;
                        const inst = (document.getElementById('platInstInput') as HTMLTextAreaElement).value;

                        if (selectedPlatformForEdit) {
                          updatePlatform({
                            ...selectedPlatformForEdit,
                            platformNumber: num,
                            level,
                            direction: dir,
                            boardingInstructions: inst,
                          });
                        } else {
                          addPlatform({
                            stationId: selectedPlatformStationId,
                            platformNumber: num,
                            level,
                            direction: dir,
                            lines: ['1'],
                            status: 'Online',
                            frequencyMin: 3,
                            boardingInstructions: inst,
                            qrCodeId: `QR-CMRL-${num}`,
                          });
                        }
                        setIsPlatformDrawerOpen(false);
                      }}
                      className="flex-1 py-3 bg-[#1E1E1E] text-white font-mono text-xs uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                    >
                      Save Platform
                    </button>
                    <button
                      onClick={() => setIsPlatformDrawerOpen(false)}
                      className="px-4 py-3 border-2 border-[#1E1E1E] font-mono text-xs uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 5: INDOOR NAVIGATION MAPS */}
        {/* ======================================================== */}
        {activeTab === 'maps' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Vector Mesh Blueprinting
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Indoor Navigation Maps
                </h2>
              </div>
              <button
                onClick={() => setIsMapUploadModalOpen(true)}
                className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>+ Upload Map</span>
              </button>
            </div>

            {/* Grid of Map Cards (3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {indoorMaps.map((map) => (
                <div
                  key={map.id}
                  className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-lg flex flex-col justify-between hover:border-[#3F66C2] transition-colors"
                >
                  <div className="space-y-4">
                    {/* SVG Thumbnail Preview */}
                    <div className="w-full h-44 bg-[#1E1E1E] border border-[#1E1E1E] flex items-center justify-center p-3 relative overflow-hidden">
                      <svg viewBox="0 0 200 120" className="w-full h-full opacity-70">
                        <rect x="10" y="10" width="180" height="100" fill="none" stroke="#3F66C2" strokeWidth="2" strokeDasharray="4 2" />
                        <line x1="30" y1="40" x2="170" y2="40" stroke="#5C82E6" strokeWidth="6" />
                        <line x1="30" y1="80" x2="170" y2="80" stroke="#FFFFFF" strokeWidth="6" />
                        <circle cx="100" cy="40" r="5" fill="#3F66C2" />
                        <circle cx="60" cy="80" r="5" fill="#3B82F6" />
                      </svg>
                      <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/80 px-1.5 text-white">
                        {map.hotspots.length} Hotspots
                      </span>
                    </div>

                    <div>
                      <h4 className="clash text-xl font-bold uppercase text-[#1E1E1E]">
                        {map.stationName}
                      </h4>
                      <p className="text-xs font-mono text-[#444444] mt-1">
                        Levels: {map.levelsCovered}
                      </p>
                      <p className="text-[10px] font-mono text-[#3F66C2] mt-0.5">
                        Last modified: {map.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E1E1E]/20 flex justify-between items-center mt-6">
                    <button
                      onClick={() => setSelectedMapForEditor(map)}
                      className="text-xs font-mono font-bold uppercase text-[#3F66C2] hover:text-[#1E1E1E] flex items-center gap-1"
                    >
                      <span>Interactive Hotspot Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteIndoorMap(map.id)}
                      className="p-1.5 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotspot Editor Modal / Overlay */}
            {selectedMapForEditor && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#E4E2DD] border-4 border-[#3F66C2] max-w-4xl w-full p-6 shadow-2xl space-y-6 animate-entrance">
                  <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#3F66C2] font-bold">
                        Interactive SVG Markup &amp; Hotspot Studio
                      </span>
                      <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                        {selectedMapForEditor.stationName}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedMapForEditor(null)}
                      className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Canvas + Hotspots */}
                  <div className="relative w-full h-80 bg-[#1E1E1E] border-2 border-[#1E1E1E] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 600 300" className="w-full h-full p-6">
                      <rect x="20" y="20" width="560" height="260" fill="#222" stroke="#3F66C2" strokeWidth="2" strokeDasharray="6 3" />
                      <line x1="60" y1="80" x2="540" y2="80" stroke="#EE352E" strokeWidth="8" />
                      <line x1="60" y1="220" x2="540" y2="220" stroke="#0039A6" strokeWidth="8" />

                      {selectedMapForEditor.hotspots.map((hs) => (
                        <g key={hs.id} transform={`translate(${hs.x * 5.6 + 20}, ${hs.y * 2.4 + 20})`}>
                          <circle cx="0" cy="0" r="10" fill="#3F66C2" />
                          <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                          <text x="14" y="4" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                            {hs.name}
                          </text>
                        </g>
                      ))}
                    </svg>

                    <div className="absolute top-2 left-2 text-[10px] font-mono text-white/70 bg-black/60 px-2 py-1">
                      Click anywhere on blueprint to anchor tactical waypoint
                    </div>
                  </div>

                  {/* Hotspots List & Add Trigger */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono font-bold uppercase border-b border-[#1E1E1E]/20 pb-1">
                      <span>Mapped Hotspots ({selectedMapForEditor.hotspots.length})</span>
                      <button
                        onClick={() => {
                          addHotspotToMap(selectedMapForEditor.id, {
                            name: 'Turnstile Exit Gate 3',
                            x: 55,
                            y: 45,
                            type: 'Exit',
                            targetId: 'st-times-sq',
                          });
                        }}
                        className="text-[#3F66C2] hover:underline"
                      >
                        + Add Custom Hotspot
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedMapForEditor.hotspots.map((h) => (
                        <div key={h.id} className="p-2 border border-[#1E1E1E]/20 bg-white/40 text-xs font-mono">
                          <span className="font-bold block text-[#1E1E1E]">{h.name}</span>
                          <span className="text-[10px] text-[#3F66C2]">Type: {h.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#1E1E1E] flex justify-end">
                    <button
                      onClick={() => {
                        showToast('Map hotspots updated.');
                        setSelectedMapForEditor(null);
                      }}
                      className="px-6 py-2.5 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2]"
                    >
                      Save Blueprint Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Map Modal */}
            {isMapUploadModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-[#E4E2DD] border-4 border-[#1E1E1E] max-w-md w-full p-6 shadow-2xl space-y-6 animate-entrance">
                  <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
                    <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                      Upload Vector Station Map
                    </h3>
                    <button
                      onClick={() => setIsMapUploadModalOpen(false)}
                      className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Select Station
                      </label>
                      <select id="mapStationSelect" className="w-full bg-transparent border-2 border-[#1E1E1E] p-2 font-mono text-xs">
                        {stations.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Covered Levels
                      </label>
                      <input
                        type="text"
                        id="mapLevelsInput"
                        placeholder="e.g. Ground, Mezzanine & B1"
                        defaultValue="Ground & Mezzanine"
                        className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-mono"
                      />
                    </div>

                    <div className="border-2 border-dashed border-[#3F66C2] p-8 text-center bg-white/40 space-y-2 cursor-pointer hover:bg-white/60 transition-colors">
                      <Upload className="w-8 h-8 text-[#3F66C2] mx-auto" />
                      <div className="font-mono text-xs font-bold text-[#1E1E1E]">
                        Drag &amp; Drop Station SVG/PNG Blueprint
                      </div>
                      <div className="text-[10px] font-mono text-[#444444]">
                        Max 25MB • Scalable Vector Format Recommended
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#1E1E1E] flex gap-3">
                    <button
                      onClick={() => {
                        const stId = (document.getElementById('mapStationSelect') as HTMLSelectElement).value;
                        const stName = stations.find((s) => s.id === stId)?.name || 'Custom Station';
                        const levels = (document.getElementById('mapLevelsInput') as HTMLInputElement).value;
                        addIndoorMap({
                          stationId: stId,
                          stationName: stName,
                          levelsCovered: levels,
                          lastUpdated: new Date().toISOString().split('T')[0],
                          hotspots: [
                            { id: 'hs-auto-1', name: 'Turnstile A', x: 20, y: 30, type: 'Ticketing', targetId: stId },
                          ],
                        });
                        setIsMapUploadModalOpen(false);
                      }}
                      className="flex-1 py-3 bg-[#1E1E1E] text-white font-mono text-xs uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                    >
                      Process &amp; Publish Blueprint
                    </button>
                    <button
                      onClick={() => setIsMapUploadModalOpen(false)}
                      className="px-4 py-3 border-2 border-[#1E1E1E] font-mono text-xs uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 6: QR CODE MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'qrcodes' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Physical Wayfinding Anchors
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  QR Code Generation &amp; Hardware Plaque Registry
                </h2>
              </div>
              <button
                onClick={() => setIsQRGeneratorModalOpen(true)}
                className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Generate QR</span>
              </button>
            </div>

            {/* QR Codes Table */}
            <div className="bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b-2 border-[#1E1E1E] text-xs font-mono uppercase tracking-widest bg-black/5">
                  <tr>
                    <th className="p-4">QR Identification Code</th>
                    <th className="p-4">Anchor Station</th>
                    <th className="p-4">Mount Type</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]/10 font-satoshi">
                  {qrCodes.map((qr) => (
                    <tr key={qr.id} className="hover:bg-[#5C82E6]/10 transition-colors">
                      <td className="p-4 font-mono font-bold text-sm text-[#3F66C2]">
                        {qr.code}
                      </td>
                      <td className="p-4 font-bold text-base text-[#1E1E1E]">
                        {qr.stationName}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-xs font-mono font-bold uppercase ${
                            qr.type === 'Entry'
                              ? 'bg-blue-100 text-blue-800'
                              : qr.type === 'Exit'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {qr.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-[#444444]">
                        {qr.createdAt}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleQRCodeStatus(qr.id)}
                          className={`px-2 py-0.5 text-xs font-mono font-bold uppercase ${
                            qr.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-black/10 text-[#444444]'
                          }`}
                        >
                          {qr.status}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setPreviewQRCode(qr)}
                          className="px-2.5 py-1 border border-[#1E1E1E] text-xs font-mono font-bold uppercase hover:bg-[#3F66C2] hover:text-white transition-colors"
                        >
                          View Plaque
                        </button>
                        <button
                          onClick={() => deleteQRCode(qr.id)}
                          className="p-1.5 border border-[#1E1E1E] hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* QR Preview & Print Sheet Modal */}
            {previewQRCode && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#E4E2DD] border-4 border-[#3F66C2] max-w-md w-full p-8 shadow-2xl space-y-6 text-center animate-entrance">
                  <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
                    <span className="text-xs font-mono uppercase font-bold text-[#3F66C2]">
                      Plaque Spec // 400x400 Hardware
                    </span>
                    <button
                      onClick={() => setPreviewQRCode(null)}
                      className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rendered SVG QR Symbol */}
                  <div className="p-6 bg-white border-4 border-[#1E1E1E] shadow-xl inline-block mx-auto">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-48 h-48 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Stylized QR Code Mock */}
                      <rect width="100" height="100" fill="white" />
                      {/* Top-Left Finder */}
                      <rect x="5" y="5" width="30" height="30" fill="#1E1E1E" />
                      <rect x="10" y="10" width="20" height="20" fill="white" />
                      <rect x="15" y="15" width="10" height="10" fill="#3F66C2" />
                      {/* Top-Right Finder */}
                      <rect x="65" y="5" width="30" height="30" fill="#1E1E1E" />
                      <rect x="70" y="10" width="20" height="20" fill="white" />
                      <rect x="75" y="15" width="10" height="10" fill="#3F66C2" />
                      {/* Bottom-Left Finder */}
                      <rect x="5" y="65" width="30" height="30" fill="#1E1E1E" />
                      <rect x="10" y="70" width="20" height="20" fill="white" />
                      <rect x="15" y="75" width="10" height="10" fill="#3F66C2" />
                      {/* Data Dots */}
                      <rect x="45" y="10" width="10" height="10" fill="#1E1E1E" />
                      <rect x="45" y="45" width="10" height="10" fill="#3F66C2" />
                      <rect x="25" y="45" width="10" height="10" fill="#1E1E1E" />
                      <rect x="65" y="45" width="10" height="10" fill="#1E1E1E" />
                      <rect x="45" y="75" width="10" height="10" fill="#1E1E1E" />
                      <rect x="75" y="75" width="10" height="10" fill="#1E1E1E" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                      {previewQRCode.code}
                    </h3>
                    <p className="text-xs font-mono text-[#444444] mt-1">
                      {previewQRCode.stationName} • Type: {previewQRCode.type}
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3 justify-center">
                    <button
                      onClick={() => showToast('Dispatched vector plaque to station printer.')}
                      className="px-4 py-2.5 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Sheet</span>
                    </button>
                    <button
                      onClick={() => showToast('Downloaded SVG package.')}
                      className="px-4 py-2.5 border-2 border-[#1E1E1E] text-xs font-mono uppercase font-bold hover:bg-black/10 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download SVG</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generate QR Modal */}
            {isQRGeneratorModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-[#E4E2DD] border-4 border-[#1E1E1E] max-w-md w-full p-6 shadow-2xl space-y-6 animate-entrance">
                  <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
                    <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                      Generate Station QR Code
                    </h3>
                    <button
                      onClick={() => setIsQRGeneratorModalOpen(false)}
                      className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Target Station
                      </label>
                      <select id="genStationSelect" className="w-full bg-transparent border-2 border-[#1E1E1E] p-2 font-mono text-xs">
                        {stations.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name} ({st.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Plaque Mounting Point
                      </label>
                      <select id="genTypeSelect" className="w-full bg-transparent border-2 border-[#1E1E1E] p-2 font-mono text-xs">
                        <option value="Entry">Turnstile / Entrance Gate</option>
                        <option value="Exit">Street Exit Staircase</option>
                        <option value="Info">Concourse Information Hub</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Custom Telemetry JSON Payload
                      </label>
                      <textarea
                        id="genPayloadInput"
                        rows={3}
                        defaultValue='{"zone": "Main Concourse", "wheelchair": true}'
                        className="w-full bg-transparent border-2 border-[#1E1E1E] p-2 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#1E1E1E] flex gap-3">
                    <button
                      onClick={() => {
                        const stId = (document.getElementById('genStationSelect') as HTMLSelectElement).value;
                        const stName = stations.find((s) => s.id === stId)?.name || 'Custom Station';
                        const type = (document.getElementById('genTypeSelect') as HTMLSelectElement).value as any;
                        const payload = (document.getElementById('genPayloadInput') as HTMLTextAreaElement).value;

                        generateQRCode({
                          code: `QR-CMRL-${Date.now().toString().slice(-4)}`,
                          stationId: stId,
                          stationName: stName,
                          type,
                          status: 'Active',
                          payload,
                        });
                        setIsQRGeneratorModalOpen(false);
                      }}
                      className="flex-1 py-3 bg-[#1E1E1E] text-white font-mono text-xs uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                    >
                      Mint QR Plaque
                    </button>
                    <button
                      onClick={() => setIsQRGeneratorModalOpen(false)}
                      className="px-4 py-3 border-2 border-[#1E1E1E] font-mono text-xs uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 7: ANALYTICS DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Intelligence &amp; Throughput
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Passenger Analytics &amp; Demographics
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast('Exporting Analytics CSV.')}
                  className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-md">
                <span className="text-xs font-mono uppercase text-[#444444]">Total Recorded Journeys</span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">
                  14,250,000
                </div>
                <span className="text-xs font-mono text-emerald-700 font-bold">Past 7 days aggregate</span>
              </div>
              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-md">
                <span className="text-xs font-mono uppercase text-[#444444]">Average Journey Time</span>
                <div className="clash text-4xl font-bold text-[#3F66C2] mt-2">
                  18.4 mins
                </div>
                <span className="text-xs font-mono text-[#444444]">Across multi-line transfers</span>
              </div>
              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-md">
                <span className="text-xs font-mono uppercase text-[#444444]">Busiest Corridor Node</span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">
                  Line 4 Express
                </div>
                <span className="text-xs font-mono text-emerald-700 font-bold">4.12M weekly riders</span>
              </div>
            </div>

            {/* High-res Line Chart */}
            <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl">
              <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E] border-b border-[#1E1E1E]/20 pb-3 mb-6">
                Passenger Throughput Over 24-Hour Cycle
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={HOURLY_PASSENGER_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" opacity={0.15} />
                    <XAxis dataKey="hour" stroke="#1E1E1E" fontSize={11} fontFamily="JetBrains Mono" />
                    <YAxis stroke="#1E1E1E" fontSize={11} fontFamily="JetBrains Mono" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E1E1E',
                        border: '2px solid #3F66C2',
                        color: '#E4E2DD',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                    <Line type="monotone" dataKey="passengers" stroke="#3F66C2" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 8: SERVICE ALERTS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'alerts' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Telemetry Dispatch
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Service Alerts &amp; Disruption Broadcasts
                </h2>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="px-4 py-2 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Alert</span>
              </button>
            </div>

            {/* Alert Cards */}
            <div className="space-y-4">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-6 bg-[#E4E2DD] border-2 ${
                    al.severity === 'Severe'
                      ? 'border-[#3F66C2] border-l-8'
                      : 'border-[#5C82E6] border-l-8'
                  } shadow-md flex flex-col md:flex-row justify-between gap-4`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#1E1E1E] text-white text-[10px] font-mono font-bold uppercase">
                        {al.severity} Severity
                      </span>
                      <div className="flex gap-1">
                        {al.affectedLines.map((ln) => (
                          <span
                            key={ln}
                            className="w-5 h-5 rounded-full bg-[#3F66C2] text-white text-[10px] font-bold font-mono flex items-center justify-center"
                          >
                            {ln}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-mono text-[#444444]">• {al.duration}</span>
                    </div>

                    <h4 className="clash text-xl font-bold text-[#1E1E1E]">{al.title}</h4>
                    <p className="satoshi text-sm text-[#444444] max-w-2xl">{al.description}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => toggleAlertActive(al.id)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border ${
                        al.active
                          ? 'border-emerald-600 bg-emerald-100 text-emerald-800'
                          : 'border-black/20 bg-black/10 text-gray-600'
                      }`}
                    >
                      {al.active ? 'Broadcasting ✓' : 'Suspended'}
                    </button>
                    <button
                      onClick={() => deleteAlert(al.id)}
                      className="p-2 border border-[#1E1E1E] hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Alert Modal */}
            {isAlertModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-[#E4E2DD] border-4 border-[#1E1E1E] max-w-lg w-full p-6 shadow-2xl space-y-6 animate-entrance">
                  <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3">
                    <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">
                      Broadcast Service Alert
                    </h3>
                    <button
                      onClick={() => setIsAlertModalOpen(false)}
                      className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#1E1E1E] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Alert Title
                      </label>
                      <input
                        type="text"
                        id="newAlertTitle"
                        placeholder="e.g. Signal Modernization Delays"
                        className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 clash text-lg font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Severity Level
                        </label>
                        <select id="newAlertSev" className="w-full bg-transparent border-2 border-[#1E1E1E] p-1.5 font-mono text-xs">
                          <option value="Minor">Minor Disruption</option>
                          <option value="Major">Major Delay</option>
                          <option value="Severe">Severe Suspension</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                          Affected Line Code
                        </label>
                        <input
                          type="text"
                          id="newAlertLine"
                          defaultValue="L"
                          className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Duration Window
                      </label>
                      <input
                        type="text"
                        id="newAlertDur"
                        defaultValue="Until 6:00 PM Today"
                        className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                        Description &amp; Alternate Guidance
                      </label>
                      <textarea
                        id="newAlertDesc"
                        rows={3}
                        defaultValue="Track renewal operation between 6th and 8th Ave. Allow 10 extra minutes."
                        className="w-full bg-transparent border-2 border-[#1E1E1E] p-2 text-xs font-satoshi"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#1E1E1E] flex gap-3">
                    <button
                      onClick={() => {
                        const title = (document.getElementById('newAlertTitle') as HTMLInputElement).value || 'Service Update';
                        const severity = (document.getElementById('newAlertSev') as HTMLSelectElement).value as any;
                        const line = (document.getElementById('newAlertLine') as HTMLInputElement).value;
                        const duration = (document.getElementById('newAlertDur') as HTMLInputElement).value;
                        const desc = (document.getElementById('newAlertDesc') as HTMLTextAreaElement).value;

                        addAlert({
                          title,
                          severity,
                          affectedLines: [line],
                          duration,
                          description: desc,
                          alternateRouteSuggestion: 'Use parallel avenue trunk lines.',
                          active: true,
                        });
                        setIsAlertModalOpen(false);
                      }}
                      className="flex-1 py-3 bg-[#3F66C2] text-white font-mono text-xs uppercase font-bold hover:bg-[#1E1E1E] transition-colors"
                    >
                      Publish Broadcast Now
                    </button>
                    <button
                      onClick={() => setIsAlertModalOpen(false)}
                      className="px-4 py-3 border-2 border-[#1E1E1E] font-mono text-xs uppercase font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 9: ORGANIZATION SETTINGS (5 Tabs) */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-entrance">
            <div className="border-b-2 border-[#1E1E1E] pb-4">
              <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                Governance &amp; Configuration
              </span>
              <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                Organization Settings: {activeOrg.name}
              </h2>
            </div>

            {/* 5 Settings Tabs */}
            <div className="flex border-b-2 border-[#1E1E1E] gap-2 overflow-x-auto text-xs font-mono uppercase font-bold">
              {[
                { id: 'features', label: 'Feature Toggles' },
                { id: 'info', label: 'Organization Info' },
                { id: 'billing', label: 'Billing & Quota' },
                { id: 'users', label: 'Team Members' },
                { id: 'integrations', label: 'Integrations & Feeds' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsActiveTab(tab.id as any)}
                  className={`py-2 px-4 border-b-4 transition-colors ${
                    settingsActiveTab === tab.id
                      ? 'border-[#3F66C2] text-[#3F66C2] bg-black/5'
                      : 'border-transparent text-[#444444] hover:text-[#1E1E1E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 2: Feature Toggles */}
            {settingsActiveTab === 'features' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#444444] mb-2">
                  Toggle platform modules available to passengers and staff for {activeOrg.name}.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      key: 'stationToStation' as const,
                      title: 'Station-to-Station Navigation',
                      desc: 'Real-time shortest path algorithmic routing engine.',
                    },
                    {
                      key: 'indoorMaps' as const,
                      title: 'Indoor Station Maps',
                      desc: 'Multi-level interactive vector blueprints & pedestrian waypoints.',
                    },
                    {
                      key: 'platformDirection' as const,
                      title: 'Platform & Train Direction',
                      desc: 'Exact platform numbers (1A, 2B, 7) and track directions.',
                    },
                    {
                      key: 'interchangeInstructions' as const,
                      title: 'Interchange Instructions',
                      desc: 'Tactical walking instructions with dwell timers and step-free stairs.',
                    },
                    {
                      key: 'qrIntegration' as const,
                      title: 'QR Code Integration',
                      desc: 'Optical wayfinding plaque scanning at station turnstiles.',
                    },
                    {
                      key: 'realtimeAlerts' as const,
                      title: 'Real-Time Service Alerts',
                      desc: 'Push notifications for line delays and emergency track closures.',
                    },
                  ].map((feat) => {
                    const isEnabled = featureToggles[feat.key];
                    return (
                      <div
                        key={feat.key}
                        className={`p-6 border-2 transition-all flex justify-between items-center gap-4 ${
                          isEnabled
                            ? 'border-[#1E1E1E] bg-white/40'
                            : 'border-[#1E1E1E]/30 bg-black/5 opacity-60'
                        }`}
                      >
                        <div>
                          <h4 className="satoshi text-base font-bold text-[#1E1E1E]">
                            {feat.title}
                          </h4>
                          <p className="satoshi text-xs text-[#444444] mt-1">
                            {feat.desc}
                          </p>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          onClick={() => toggleFeature(feat.key)}
                          className={`w-14 h-8 border-2 border-[#1E1E1E] rounded-none p-0.5 transition-colors ${
                            isEnabled ? 'bg-[#3F66C2]' : 'bg-[#E4E2DD]'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 bg-white border border-[#1E1E1E] transform transition-transform ${
                              isEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 1: Org Info */}
            {settingsActiveTab === 'info' && (
              <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl max-w-2xl space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                    Authority Name
                  </label>
                  <input
                    type="text"
                    defaultValue={activeOrg.name}
                    className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 clash text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                    Metro System Title
                  </label>
                  <input
                    type="text"
                    defaultValue={activeOrg.metroSystemName}
                    className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue={activeOrg.city}
                      className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      defaultValue={activeOrg.country}
                      className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#1E1E1E] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue={activeOrg.contactEmail}
                    className="w-full bg-transparent border-b-2 border-[#1E1E1E] py-1 text-sm font-mono"
                  />
                </div>
                <button
                  onClick={() => showToast('Organization profile saved.')}
                  className="px-6 py-3 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] mt-4"
                >
                  Save Profile
                </button>
              </div>
            )}

            {/* Tab 3: Billing */}
            {settingsActiveTab === 'billing' && (
              <div className="space-y-6 max-w-3xl">
                <div className="p-6 bg-[#1E1E1E] text-white border-4 border-[#3F66C2] shadow-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F66C2]">
                        Current Subscription
                      </span>
                      <h3 className="clash text-3xl font-bold uppercase">{activeOrg.tier} Tier</h3>
                    </div>
                    <span className="px-3 py-1 bg-white/10 text-xs font-mono uppercase font-bold">
                      $5,900 / mo
                    </span>
                  </div>
                  <p className="satoshi text-xs text-white/70">
                    Unlimited journeys, 2TB Vector storage, dedicated 24/7 Transit Ops engineer.
                  </p>
                </div>

                {/* Invoices */}
                <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E]">
                  <h4 className="clash text-lg font-bold uppercase text-[#1E1E1E] mb-3">
                    Recent Billing Invoices
                  </h4>
                  <table className="w-full text-xs font-mono">
                    <thead className="border-b border-[#1E1E1E]/20 text-left">
                      <tr>
                        <th className="py-2">Invoice</th>
                        <th className="py-2">Billing Period</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E1E]/10">
                      <tr>
                        <td className="py-2.5 font-bold">INV-2026-11-01</td>
                        <td>Nov 1 - Nov 30, 2026</td>
                        <td>$5,900.00</td>
                        <td><span className="text-emerald-700 font-bold">PAID ✓</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">INV-2026-10-01</td>
                        <td>Oct 1 - Oct 31, 2026</td>
                        <td>$5,900.00</td>
                        <td><span className="text-emerald-700 font-bold">PAID ✓</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Users */}
            {settingsActiveTab === 'users' && (
              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#1E1E1E]/20 pb-3">
                  <h4 className="clash text-xl font-bold uppercase text-[#1E1E1E]">
                    Organization Authority Team
                  </h4>
                  <button
                    onClick={() => showToast('Invite link generated.')}
                    className="px-3 py-1.5 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2]"
                  >
                    + Invite Operator
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="p-3 border border-[#1E1E1E]/20 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm block">Sarah Jenkins</span>
                      <span className="text-xs font-mono text-[#444444]">sjenkins@mta.info • Admin</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-700 font-bold">Active</span>
                  </div>
                  <div className="p-3 border border-[#1E1E1E]/20 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm block">Arthur Pendelton</span>
                      <span className="text-xs font-mono text-[#444444]">apendelton@tfl.gov.uk • Operator</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-700 font-bold">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Integrations */}
            {settingsActiveTab === 'integrations' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] space-y-3">
                  <h4 className="clash text-lg font-bold uppercase">GTFS-Realtime Protocol</h4>
                  <p className="satoshi text-xs text-[#444444]">
                    Direct protobuf feed for live train positions and track occupancies.
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    CONNECTED (1200ms latency)
                  </span>
                </div>
                <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] space-y-3">
                  <h4 className="clash text-lg font-bold uppercase">Google Maps Transit API</h4>
                  <p className="satoshi text-xs text-[#444444]">
                    Sync outer metropolitan transfer lines and street surface stops.
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    CONNECTED
                  </span>
                </div>
                <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] space-y-3">
                  <h4 className="clash text-lg font-bold uppercase">NeTEx / SIRI Gateway</h4>
                  <p className="satoshi text-xs text-[#444444]">
                    European Standard transit schedule exchange format.
                  </p>
                  <button
                    onClick={() => showToast('Connecting NeTEx adapter...')}
                    className="px-3 py-1 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold"
                  >
                    Connect Service
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
