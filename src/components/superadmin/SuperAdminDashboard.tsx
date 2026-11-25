import React, { useState } from 'react';
import { useMetroNav } from '../../context/MetroNavContext';
import {
  Organization,
  SupportTicket,
  SubscriptionPlan,
  SystemLog,
  UserAccount,
} from '../../types';
import {
  GLOBAL_ORGS_GROWTH,
  GLOBAL_JOURNEYS_BY_METRO,
} from '../../data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Receipt,
  LifeBuoy,
  Activity,
  Users2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Download,
  Plus,
  Send,
  MessageSquare,
  Key,
  Database,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    organizations,
    approveOrganization,
    rejectOrganization,
    suspendOrganization,
    tickets,
    replyToTicket,
    updateTicketStatus,
    updateTicketPriority,
    plans,
    updatePlan,
    logs,
    users,
    addUser,
    showToast,
  } = useMetroNav();

  // Active SuperAdmin Tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'organizations'
    | 'org-detail'
    | 'subscriptions'
    | 'support'
    | 'logs'
    | 'users'
    | 'settings'
  >('dashboard');

  // Selected Org for Deep Inspection
  const [inspectedOrg, setInspectedOrg] = useState<Organization>(organizations[3] || organizations[0]);
  const [orgDetailSubTab, setOrgDetailSubTab] = useState<
    'info' | 'features' | 'billing' | 'activity' | 'health' | 'approval'
  >('approval');

  // Selected Ticket for Chat Thread Detail
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(tickets[0]);
  const [replyMessageText, setReplyMessageText] = useState('');

  // Selected Plan for Editing
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SubscriptionPlan | null>(null);

  // Filters for Org Directory
  const [orgStatusFilter, setOrgStatusFilter] = useState<string>('ALL');
  const [orgTierFilter, setOrgTierFilter] = useState<string>('ALL');
  const [orgSearchText, setOrgSearchText] = useState<string>('');
  const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);

  // Filtered Orgs
  const filteredOrgs = organizations.filter((org) => {
    if (orgStatusFilter !== 'ALL' && org.status !== orgStatusFilter) return false;
    if (orgTierFilter !== 'ALL' && org.tier !== orgTierFilter) return false;
    if (
      orgSearchText &&
      !org.name.toLowerCase().includes(orgSearchText.toLowerCase()) &&
      !org.city.toLowerCase().includes(orgSearchText.toLowerCase())
    )
      return false;
    return true;
  });

  // Bulk actions
  const toggleSelectOrg = (id: string) => {
    setSelectedOrgIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    selectedOrgIds.forEach((id) => approveOrganization(id));
    setSelectedOrgIds([]);
    showToast(`Approved ${selectedOrgIds.length} organizations in bulk.`);
  };

  const handleBulkSuspend = () => {
    selectedOrgIds.forEach((id) => suspendOrganization(id));
    setSelectedOrgIds([]);
    showToast(`Suspended ${selectedOrgIds.length} organizations.`);
  };

  return (
    <div className="min-h-screen bg-[#E4E2DD] text-[#1E1E1E]">
      {/* Super Admin Top Header */}
      <div className="bg-[#1E1E1E] text-[#E4E2DD] border-b-2 border-[#3F66C2] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#3F66C2] font-bold">
            Platform Master Console // Global Infrastructure
          </div>
          <h1 className="clash text-2xl md:text-3xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
            <span>SUPER ADMIN GOVERNANCE</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              CLUSTER HEALTHY (99.98% UPTIME)
            </span>
          </h1>
        </div>

        {/* Super Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-1 text-xs font-mono uppercase font-bold">
          {[
            { id: 'dashboard', label: 'Platform Status', icon: Activity },
            { id: 'organizations', label: 'Organizations', icon: Building2 },
            { id: 'org-detail', label: 'Org Approvals', icon: FileCheck2 },
            { id: 'subscriptions', label: 'Subscriptions', icon: Receipt },
            { id: 'support', label: 'Support Queue', icon: LifeBuoy },
            { id: 'logs', label: 'System Logs', icon: Database },
            { id: 'users', label: 'Admin Team', icon: Users2 },
            { id: 'settings', label: 'Settings', icon: Sliders },
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
        {/* PAGE 1: SUPER ADMIN DASHBOARD (Platform Status) */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-entrance">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Telemetry Aggregation Engine
                </span>
                <h2 className="clash text-4xl font-bold uppercase text-[#1E1E1E]">
                  Platform Infrastructure Overview
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab('org-detail');
                    setOrgDetailSubTab('approval');
                  }}
                  className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                >
                  Approve Pending Orgs ({organizations.filter((o) => o.status === 'Pending').length})
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className="px-4 py-2 border-2 border-[#1E1E1E] text-xs font-mono uppercase font-bold hover:bg-black/10 transition-colors"
                >
                  View Support Queue ({tickets.filter((t) => t.status === 'Open').length})
                </button>
              </div>
            </div>

            {/* 4 Health Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">Global API Uptime</span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">99.98%</div>
                <span className="text-xs font-mono text-emerald-700 font-bold">0 Outages in 90 Days</span>
              </div>
              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">Active Metro Orgs</span>
                <div className="clash text-4xl font-bold text-[#3F66C2] mt-2">
                  {organizations.filter((o) => o.status === 'Active').length}
                </div>
                <span className="text-xs font-mono text-[#444444]">{organizations.length} Total Registered</span>
              </div>
              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">Total 7d Journeys</span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">30.5M</div>
                <span className="text-xs font-mono text-emerald-700 font-bold">Across 5 Continents</span>
              </div>
              <div className="p-6 bg-[#E4E2DD] border-t-4 border-[#3F66C2] border-x border-b border-[#1E1E1E]/20 shadow-md">
                <span className="text-[10px] font-mono uppercase text-[#444444] block">Support Escalations</span>
                <div className="clash text-4xl font-bold text-[#1E1E1E] mt-2">{tickets.length}</div>
                <span className="text-xs font-mono text-[#3F66C2] font-bold">1 Critical P1 Incident</span>
              </div>
            </div>

            {/* Global Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Monthly Revenue & Orgs Growth (7 cols) */}
              <div className="lg:col-span-7 p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl">
                <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E] border-b border-[#1E1E1E]/20 pb-3 mb-4">
                  Organization Network &amp; ARR Growth
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={GLOBAL_ORGS_GROWTH}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" opacity={0.15} />
                      <XAxis dataKey="month" stroke="#1E1E1E" fontSize={11} fontFamily="JetBrains Mono" />
                      <YAxis stroke="#1E1E1E" fontSize={11} fontFamily="JetBrains Mono" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1E',
                          border: '2px solid #3F66C2',
                          color: '#E4E2DD',
                          fontFamily: 'JetBrains Mono',
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3F66C2" name="Monthly Recurring ARR ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Journeys by Metro Donut (5 cols) */}
              <div className="lg:col-span-5 p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl">
                <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E] border-b border-[#1E1E1E]/20 pb-3 mb-4">
                  Platform Share by Transit Hub
                </h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={GLOBAL_JOURNEYS_BY_METRO}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {GLOBAL_JOURNEYS_BY_METRO.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1E',
                          border: '2px solid #3F66C2',
                          color: '#E4E2DD',
                          fontFamily: 'JetBrains Mono',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: ORGANIZATIONS DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'organizations' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Tenant Directory // Multi-Tenant Mesh
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Registered Metro Authorities
                </h2>
              </div>
              <div className="flex gap-2">
                {selectedOrgIds.length > 0 && (
                  <>
                    <button
                      onClick={handleBulkApprove}
                      className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-mono uppercase font-bold"
                    >
                      Approve ({selectedOrgIds.length})
                    </button>
                    <button
                      onClick={handleBulkSuspend}
                      className="px-3 py-1.5 bg-red-700 text-white text-xs font-mono uppercase font-bold"
                    >
                      Suspend ({selectedOrgIds.length})
                    </button>
                  </>
                )}
                <button
                  onClick={() => showToast('Exported Organizations CSV.')}
                  className="px-3 py-1.5 border border-[#1E1E1E] text-xs font-mono uppercase font-bold"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-white/40 border-2 border-[#1E1E1E] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Search by org or city..."
                  value={orgSearchText}
                  onChange={(e) => setOrgSearchText(e.target.value)}
                  className="bg-transparent border-b-2 border-[#1E1E1E] py-1 px-2 font-mono text-xs focus:outline-none focus:border-[#3F66C2]"
                />
                <select
                  value={orgStatusFilter}
                  onChange={(e) => setOrgStatusFilter(e.target.value)}
                  className="bg-transparent border border-[#1E1E1E] py-1 px-2 font-mono text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <select
                  value={orgTierFilter}
                  onChange={(e) => setOrgTierFilter(e.target.value)}
                  className="bg-transparent border border-[#1E1E1E] py-1 px-2 font-mono text-xs"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="text-xs font-mono text-[#444444]">
                Showing {filteredOrgs.length} of {organizations.length} Organizations
              </div>
            </div>

            {/* Organizations Table */}
            <div className="bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b-2 border-[#1E1E1E] text-xs font-mono uppercase tracking-widest bg-black/5">
                  <tr>
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedOrgIds.length === filteredOrgs.length && filteredOrgs.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrgIds(filteredOrgs.map((o) => o.id));
                          } else {
                            setSelectedOrgIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-4">Organization &amp; System</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Subscription Tier</th>
                    <th className="p-4">7d Volume</th>
                    <th className="p-4">Staff</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]/10 font-satoshi">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-[#5C82E6]/10 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedOrgIds.includes(org.id)}
                          onChange={() => toggleSelectOrg(org.id)}
                        />
                      </td>
                      <td className="p-4 font-bold">
                        <div
                          className="cursor-pointer hover:text-[#3F66C2] transition-colors"
                          onClick={() => {
                            setInspectedOrg(org);
                            setActiveTab('org-detail');
                          }}
                        >
                          <span className="text-base text-[#1E1E1E] block">{org.name}</span>
                          <span className="text-xs font-mono text-[#444444] font-normal">
                            {org.metroSystemName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {org.countryFlag} {org.city}, {org.country}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase ${
                            org.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : org.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs font-bold">{org.tier}</td>
                      <td className="p-4 font-mono text-xs">
                        {(org.journeys7d / 1000000).toFixed(1)}M trips
                      </td>
                      <td className="p-4 font-mono text-xs">{org.userCount} operators</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setInspectedOrg(org);
                            setActiveTab('org-detail');
                          }}
                          className="px-2.5 py-1 border border-[#1E1E1E] text-xs font-mono font-bold uppercase hover:bg-[#3F66C2] hover:text-white transition-colors"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => suspendOrganization(org.id)}
                          className="px-2.5 py-1 border border-[#1E1E1E] text-xs font-mono font-bold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                          {org.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: ORGANIZATION DETAIL & APPROVAL */}
        {/* ======================================================== */}
        {activeTab === 'org-detail' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Comprehensive Tenant Inspection &amp; Compliance Audit
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E] flex items-center gap-3">
                  <span>{inspectedOrg.name}</span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 ${
                      inspectedOrg.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inspectedOrg.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {inspectedOrg.status}
                  </span>
                </h2>
              </div>

              {/* Selector to switch inspected org */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#444444]">Select Org:</span>
                <select
                  value={inspectedOrg.id}
                  onChange={(e) => {
                    const found = organizations.find((o) => o.id === e.target.value);
                    if (found) setInspectedOrg(found);
                  }}
                  className="bg-transparent border-2 border-[#1E1E1E] py-1 px-2 font-mono text-xs font-bold"
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6 Sub-Tabs */}
            <div className="flex border-b-2 border-[#1E1E1E] gap-2 overflow-x-auto text-xs font-mono uppercase font-bold">
              {[
                { id: 'approval', label: 'Onboarding Approval' },
                { id: 'info', label: 'Profile Details' },
                { id: 'features', label: 'Feature Policies' },
                { id: 'billing', label: 'Tier & Invoices' },
                { id: 'health', label: 'System Telemetry' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOrgDetailSubTab(tab.id as any)}
                  className={`py-2 px-4 border-b-4 transition-colors ${
                    orgDetailSubTab === tab.id
                      ? 'border-[#3F66C2] text-[#3F66C2] bg-black/5'
                      : 'border-transparent text-[#444444] hover:text-[#1E1E1E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Approval Checklist */}
            {orgDetailSubTab === 'approval' && (
              <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl space-y-6 max-w-2xl">
                <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E] border-b border-[#1E1E1E]/20 pb-3">
                  Compliance &amp; Onboarding Gate
                </h3>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border border-[#1E1E1E]/20 bg-white/40 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={inspectedOrg.complianceChecklist.paymentVerified}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-sm block">Payment Verification &amp; Card Authorization</span>
                      <span className="text-xs text-[#444444]">
                        Valid enterprise banking card or wire mandate on file with Stripe gateway.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-[#1E1E1E]/20 bg-white/40 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={inspectedOrg.complianceChecklist.agreementSigned}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-sm block">Transit Authority SLA &amp; Service Agreement Signed</span>
                      <span className="text-xs text-[#444444]">
                        Official Docusign master services agreement countersigned by executive transit board.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-[#1E1E1E]/20 bg-white/40 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={inspectedOrg.complianceChecklist.gdprConfirmed}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-sm block">Data Privacy &amp; GDPR / Telemetry Compliance</span>
                      <span className="text-xs text-[#444444]">
                        Anonymized passenger position processing guarantees confirmed.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t-2 border-[#1E1E1E] flex gap-4">
                  <button
                    onClick={() => approveOrganization(inspectedOrg.id)}
                    className="flex-1 py-3.5 bg-emerald-700 text-white font-mono text-xs uppercase font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Activate Tenant</span>
                  </button>
                  <button
                    onClick={() => rejectOrganization(inspectedOrg.id)}
                    className="px-6 py-3.5 border-2 border-red-700 text-red-700 font-mono text-xs uppercase font-bold hover:bg-red-700 hover:text-white transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Profile Info */}
            {orgDetailSubTab === 'info' && (
              <div className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl max-w-xl space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="opacity-60 block">Organization Name:</span>
                    <span className="font-bold text-sm text-[#1E1E1E]">{inspectedOrg.name}</span>
                  </div>
                  <div>
                    <span className="opacity-60 block">Metro Network:</span>
                    <span className="font-bold text-sm text-[#1E1E1E]">{inspectedOrg.metroSystemName}</span>
                  </div>
                  <div>
                    <span className="opacity-60 block">Location:</span>
                    <span className="font-bold text-[#1E1E1E]">{inspectedOrg.city}, {inspectedOrg.country}</span>
                  </div>
                  <div>
                    <span className="opacity-60 block">Contact:</span>
                    <span className="font-bold text-[#1E1E1E]">{inspectedOrg.contactEmail}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Features */}
            {orgDetailSubTab === 'features' && (
              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] max-w-2xl space-y-4">
                <h4 className="clash text-xl font-bold uppercase text-[#1E1E1E]">Feature Allocation Audit</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 border border-[#1E1E1E]/20 bg-white/40 flex justify-between">
                    <span>Station-to-Station Routing:</span>
                    <span className="text-emerald-700 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 border border-[#1E1E1E]/20 bg-white/40 flex justify-between">
                    <span>Indoor Vector Maps (SVG):</span>
                    <span className="text-emerald-700 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 border border-[#1E1E1E]/20 bg-white/40 flex justify-between">
                    <span>Platform Direction &amp; Train Headway:</span>
                    <span className="text-emerald-700 font-bold">Enabled</span>
                  </div>
                  <div className="p-3 border border-[#1E1E1E]/20 bg-white/40 flex justify-between">
                    <span>QR Hardware Signage:</span>
                    <span className="text-emerald-700 font-bold">Enabled</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: SUBSCRIPTION MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-8 animate-entrance">
            <div className="border-b-2 border-[#1E1E1E] pb-4">
              <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                Commercial Tiers &amp; Packaging
              </span>
              <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                Subscription Plan Portfolio
              </h2>
            </div>

            {/* 3 Subscription Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((pl) => (
                <div
                  key={pl.id}
                  className="p-8 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl flex flex-col justify-between hover:border-[#3F66C2] transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-[#1E1E1E]/20 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#3F66C2] font-bold">
                          Commercial Tier
                        </span>
                        <h3 className="clash text-2xl font-bold uppercase text-[#1E1E1E]">{pl.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-black/10 text-xs font-mono font-bold">
                        {pl.orgsSubscribed} Orgs
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="clash text-4xl font-bold text-[#3F66C2]">${pl.priceMonthly}</span>
                      <span className="text-xs font-mono text-[#444444]"> / month</span>
                    </div>

                    <p className="satoshi text-xs font-bold text-[#1E1E1E]">{pl.journeysQuota}</p>
                    <p className="satoshi text-xs text-[#444444]">{pl.storageQuota}</p>

                    <ul className="space-y-2 pt-4 border-t border-[#1E1E1E]/20 text-xs font-satoshi">
                      {pl.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3F66C2] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPlanForEdit(pl);
                      showToast(`Editing Plan: ${pl.name}`);
                    }}
                    className="mt-8 w-full py-2.5 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors"
                  >
                    Edit Plan Specs
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 5: SUPPORT QUEUE & TICKETS */}
        {/* ======================================================== */}
        {activeTab === 'support' && (
          <div className="space-y-8 animate-entrance">
            <div className="border-b-2 border-[#1E1E1E] pb-4">
              <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                Operational Escalations
              </span>
              <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                Support Queue &amp; Incident Dispatch
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Ticket Cards List (Col 1-5) */}
              <div className="lg:col-span-5 space-y-4">
                {tickets.map((tck) => {
                  const isSelected = selectedTicket.id === tck.id;
                  return (
                    <div
                      key={tck.id}
                      onClick={() => setSelectedTicket(tck)}
                      className={`p-5 border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#3F66C2] bg-[#5C82E6]/20 shadow-md ring-2 ring-[#3F66C2]'
                          : 'border-[#1E1E1E]/30 bg-[#E4E2DD] hover:border-[#1E1E1E]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#3F66C2]">{tck.id}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 font-bold uppercase ${
                            tck.priority === 'Critical'
                              ? 'bg-red-600 text-white'
                              : tck.priority === 'High'
                              ? 'bg-amber-500 text-white'
                              : 'bg-black/10 text-gray-800'
                          }`}
                        >
                          {tck.priority}
                        </span>
                      </div>
                      <h4 className="satoshi text-sm font-bold text-[#1E1E1E] leading-snug">{tck.subject}</h4>
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#444444] pt-2 border-t border-[#1E1E1E]/10 mt-2">
                        <span>{tck.orgName}</span>
                        <span className="font-bold text-[#1E1E1E] uppercase">{tck.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Thread Detail Pane (Col 6-12) */}
              <div className="lg:col-span-7 p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl space-y-6">
                <div className="flex justify-between items-start border-b-2 border-[#1E1E1E] pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#3F66C2] font-bold uppercase">
                      {selectedTicket.id} • {selectedTicket.orgName}
                    </span>
                    <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E] mt-1">
                      {selectedTicket.subject}
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                      className="bg-transparent border border-[#1E1E1E] text-xs font-mono py-1 px-2 font-bold"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Message Thread */}
                <div className="space-y-4 max-h-80 overflow-y-auto p-2">
                  {selectedTicket.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border ${
                        m.role === 'Super Admin'
                          ? 'border-[#3F66C2] bg-[#1E1E1E] text-[#E4E2DD]'
                          : 'border-[#1E1E1E]/30 bg-white/60 text-[#1E1E1E]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono opacity-60 mb-1">
                        <span className="font-bold">{m.sender}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="satoshi text-xs leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="pt-4 border-t-2 border-[#1E1E1E] flex gap-2">
                  <input
                    type="text"
                    placeholder="Type dispatch response to authority operator..."
                    value={replyMessageText}
                    onChange={(e) => setReplyMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && replyMessageText) {
                        replyToTicket(selectedTicket.id, replyMessageText);
                        setReplyMessageText('');
                      }
                    }}
                    className="flex-1 bg-transparent border-b-2 border-[#1E1E1E] py-2 text-xs font-mono focus:outline-none focus:border-[#3F66C2]"
                  />
                  <button
                    onClick={() => {
                      if (replyMessageText) {
                        replyToTicket(selectedTicket.id, replyMessageText);
                        setReplyMessageText('');
                      }
                    }}
                    className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2] transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 6: SYSTEM LOGS & ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  System Audit Trail
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Cluster Event Stream &amp; Security Logs
                </h2>
              </div>
              <button
                onClick={() => showToast('Exported System Logs JSON.')}
                className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2]"
              >
                Export JSON Log
              </button>
            </div>

            <div className="bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="border-b-2 border-[#1E1E1E] uppercase tracking-widest bg-black/5">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Event Category</th>
                    <th className="p-4">Telemetry Payload</th>
                    <th className="p-4">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]/10">
                  {logs.map((lg) => (
                    <tr key={lg.id} className="hover:bg-[#5C82E6]/10 transition-colors">
                      <td className="p-4 font-bold text-[#444444]">{lg.timestamp}</td>
                      <td className="p-4 font-bold text-[#1E1E1E]">{lg.orgName}</td>
                      <td className="p-4 text-[#3F66C2]">{lg.eventType}</td>
                      <td className="p-4 text-[#1E1E1E]">{lg.details}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 font-bold uppercase ${
                            lg.severity === 'Critical'
                              ? 'bg-red-600 text-white'
                              : lg.severity === 'Warning'
                              ? 'bg-amber-500 text-white'
                              : 'bg-black/10 text-gray-800'
                          }`}
                        >
                          {lg.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 7: USER MANAGEMENT (Super Admin Team) */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-entrance">
            <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                  Root Role Matrix
                </span>
                <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                  Platform Engineering Team
                </h2>
              </div>
              <button
                onClick={() => {
                  addUser({
                    name: 'Alex Vance',
                    email: 'alex.v@metronav.platform',
                    role: 'Platform Operator',
                    avatar: 'AV',
                  });
                }}
                className="px-4 py-2 bg-[#1E1E1E] text-white text-xs font-mono uppercase font-bold hover:bg-[#3F66C2]"
              >
                + Invite Super User
              </button>
            </div>

            <div className="bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-xl overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="border-b-2 border-[#1E1E1E] uppercase tracking-widest bg-black/5">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Platform Role</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]/10">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#5C82E6]/10 transition-colors">
                      <td className="p-4 font-bold text-sm text-[#1E1E1E]">{u.name}</td>
                      <td className="p-4 text-[#444444]">{u.email}</td>
                      <td className="p-4 font-bold text-[#3F66C2]">{u.role}</td>
                      <td className="p-4 text-[#444444]">{u.lastLogin}</td>
                      <td className="p-4">
                        <span className="text-emerald-700 font-bold">• Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 8: PLATFORM SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-entrance max-w-3xl">
            <div className="border-b-2 border-[#1E1E1E] pb-4">
              <span className="text-xs font-mono uppercase text-[#3F66C2] font-bold">
                Global Parameters
              </span>
              <h2 className="clash text-3xl font-bold uppercase text-[#1E1E1E]">
                Platform Security &amp; Engine Settings
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] space-y-4">
                <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E]">API Rate Limits &amp; Security</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="opacity-60 block">Global Rate Limit (req/sec):</label>
                    <input type="text" defaultValue="50,000" className="w-full border-b border-[#1E1E1E] bg-transparent py-1 font-bold" />
                  </div>
                  <div>
                    <label className="opacity-60 block">Ingestion Token Refresh (hrs):</label>
                    <input type="text" defaultValue="24" className="w-full border-b border-[#1E1E1E] bg-transparent py-1 font-bold" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#E4E2DD] border-2 border-[#1E1E1E] space-y-4">
                <h3 className="clash text-xl font-bold uppercase text-[#1E1E1E]">Maintenance Mode</h3>
                <p className="satoshi text-xs text-[#444444]">
                  Activate scheduled maintenance overlay for public passenger portals across all tenants.
                </p>
                <button
                  onClick={() => showToast('Maintenance mode simulated.')}
                  className="px-4 py-2 border-2 border-[#3F66C2] text-[#3F66C2] text-xs font-mono font-bold uppercase hover:bg-[#3F66C2] hover:text-white"
                >
                  Toggle Maintenance Mode
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
