import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MousePointerClick, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Tablet, 
  RefreshCw, 
  Clock, 
  Flame, 
  Calendar,
  Globe,
  Radio,
  CheckCircle2,
  TrendingUp,
  School
} from 'lucide-react';
import { useAuth } from '../AuthContext';

interface TrackerStats {
  totalPageViews: number;
  todayPageViews: number;
  totalUniqueVisitors: number;
  todayUniqueVisitors: number;
  totalSchoolClicks: number;
  todaySchoolClicks: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  eventBreakdown: { [key: string]: number };
  topSchools: { schoolName: string; clicks: number }[];
  recentEvents: Array<{
    id: number;
    event_type: string;
    target_id: string | null;
    page_path: string | null;
    metadata: any;
    ip_address: string | null;
    device_type: string | null;
    created_at: string;
  }>;
}

export function SiteTrackerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/site-tracker', { headers });
      if (res.ok) {
        const raw = await res.json();
        const summary = raw.summary || raw;
        
        // Map devices array [{device, count}] to deviceBreakdown object
        const deviceMap: { mobile: number; desktop: number; tablet: number } = { mobile: 0, desktop: 0, tablet: 0 };
        if (Array.isArray(raw.devices)) {
          raw.devices.forEach((d: any) => {
            const dev = String(d.device || '').toLowerCase();
            if (dev.includes('mob')) deviceMap.mobile += Number(d.count || 0);
            else if (dev.includes('tab')) deviceMap.tablet += Number(d.count || 0);
            else deviceMap.desktop += Number(d.count || 0);
          });
        } else if (raw.deviceBreakdown) {
          deviceMap.mobile = raw.deviceBreakdown.mobile || 0;
          deviceMap.desktop = raw.deviceBreakdown.desktop || 0;
          deviceMap.tablet = raw.deviceBreakdown.tablet || 0;
        }

        // Map eventsBreakdown array to eventBreakdown dictionary
        const evtMap: { [key: string]: number } = {};
        if (Array.isArray(raw.eventsBreakdown)) {
          raw.eventsBreakdown.forEach((e: any) => {
            evtMap[e.type] = Number(e.count || 0);
          });
        } else if (raw.eventBreakdown) {
          Object.assign(evtMap, raw.eventBreakdown);
        }

        // Map topSchools
        const schools = (raw.topSchools || []).map((s: any) => ({
          schoolName: s.name || s.schoolName || 'Unknown School',
          clicks: Number(s.clicks || 0)
        }));

        setStats({
          totalPageViews: Number(summary.totalPageViews || 0),
          todayPageViews: Number(summary.todayPageViews || 0),
          totalUniqueVisitors: Number(summary.totalVisitors ?? summary.totalUniqueVisitors ?? 0),
          todayUniqueVisitors: Number(summary.todayVisitors ?? summary.todayUniqueVisitors ?? 0),
          totalSchoolClicks: Number(summary.totalSchoolClicks || 0),
          todaySchoolClicks: Number(summary.todaySchoolClicks || 0),
          deviceBreakdown: deviceMap,
          eventBreakdown: evtMap,
          topSchools: schools,
          recentEvents: raw.recentEvents || []
        });
      }
    } catch (err) {
      console.error('Failed to load site tracker stats', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  // Auto-refresh interval (every 20s if enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchStats();
    }, 20000);
    return () => clearInterval(interval);
  }, [autoRefresh, token]);

  const totalDevices = (stats?.deviceBreakdown.mobile || 0) + 
                       (stats?.deviceBreakdown.desktop || 0) + 
                       (stats?.deviceBreakdown.tablet || 0) || 1;

  const mobilePct = Math.round(((stats?.deviceBreakdown.mobile || 0) / totalDevices) * 100);
  const desktopPct = Math.round(((stats?.deviceBreakdown.desktop || 0) / totalDevices) * 100);
  const tabletPct = Math.round(((stats?.deviceBreakdown.tablet || 0) / totalDevices) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-600/30 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Site Tracker & Traffic Analytics</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  LIVE TRACKER
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time traffic metrics, school admission portal clicks, and device telemetry for Teachers At Home
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={e => setAutoRefresh(e.target.checked)} 
              className="rounded accent-indigo-500 cursor-pointer"
            />
            <span>Auto Refresh (20s)</span>
          </label>

          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Stats'}</span>
          </button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">Gathering analytics telemetry...</p>
        </div>
      ) : (
        <>
          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Page Views */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Page Views</span>
                <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Globe className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 relative z-10">
                {stats?.totalPageViews.toLocaleString() || 0}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-600 relative z-10">
                <TrendingUp className="w-3.5 h-3.5" />
                <span><strong>+{stats?.todayPageViews || 0}</strong> views today</span>
              </div>
            </div>

            {/* Card 2: Unique Visitors */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Unique Visitors</span>
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Users className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 relative z-10">
                {stats?.totalUniqueVisitors.toLocaleString() || 0}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-blue-600 relative z-10">
                <Users className="w-3.5 h-3.5" />
                <span><strong>+{stats?.todayUniqueVisitors || 0}</strong> visitors today</span>
              </div>
            </div>

            {/* Card 3: School Form Clicks */}
            <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-700 flex items-center gap-1">
                  <span>School Form Clicks</span>
                  <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black">2027-28</span>
                </span>
                <span className="p-2 rounded-xl bg-red-100 text-red-700">
                  <ExternalLink className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-red-600 relative z-10">
                {stats?.totalSchoolClicks.toLocaleString() || 0}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-red-700 relative z-10">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span><strong>+{stats?.todaySchoolClicks || 0}</strong> clicked today</span>
              </div>
            </div>

            {/* Card 4: WhatsApp Inquiries */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  WhatsApp & Calls
                </span>
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <MousePointerClick className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700 relative z-10">
                {((stats?.eventBreakdown['whatsapp_click'] || 0) + (stats?.eventBreakdown['phone_call_click'] || 0)).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700 relative z-10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stats?.eventBreakdown['whatsapp_click'] || 0} WA • {stats?.eventBreakdown['phone_call_click'] || 0} Phone</span>
              </div>
            </div>

          </div>

          {/* Section: School Admissions Click Ranking + Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Ranchi Schools Ranking (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <School className="w-5 h-5 text-red-600" />
                    <span>Top Clicked School Portals (Session 2027-28)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Which school admission links parents are clicking the most on Teachers At Home
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {stats?.topSchools?.length || 0} Schools Tracked
                </span>
              </div>

              {(!stats?.topSchools || stats.topSchools.length === 0) ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <MousePointerClick className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No school link clicks recorded yet. Clicks will appear here in real time when parents click "Fill Form".
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topSchools.map((item, idx) => {
                    const maxClicks = stats.topSchools[0]?.clicks || 1;
                    const percent = Math.round((item.clicks / maxClicks) * 100);
                    return (
                      <div key={item.schoolName} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                              idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                              idx === 1 ? 'bg-slate-300 text-slate-900' :
                              idx === 2 ? 'bg-amber-700/20 text-amber-800' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-slate-800 text-sm">{item.schoolName}</span>
                          </div>
                          <span className="text-red-600 font-black text-sm">
                            {item.clicks} {item.clicks === 1 ? 'click' : 'clicks'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Device & Platform Breakdown (1 Col) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-indigo-600" />
                      <span>Device Types</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Parent device distribution</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Mobile */}
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        <span>Mobile Phones</span>
                      </div>
                      <span className="text-indigo-700 font-black">{stats?.deviceBreakdown.mobile || 0} ({mobilePct}%)</span>
                    </div>
                    <div className="w-full bg-indigo-200/50 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${mobilePct}%` }} />
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-600" />
                        <span>Desktop / Laptop</span>
                      </div>
                      <span className="text-blue-700 font-black">{stats?.deviceBreakdown.desktop || 0} ({desktopPct}%)</span>
                    </div>
                    <div className="w-full bg-blue-200/50 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${desktopPct}%` }} />
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-4 h-4 text-slate-600" />
                        <span>Tablets / iPads</span>
                      </div>
                      <span className="text-slate-700 font-black">{stats?.deviceBreakdown.tablet || 0} ({tabletPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: `${tabletPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Type Counters */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
                  Event Aggregates
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Help Form Submits</span>
                    <strong className="text-slate-900 text-sm">{stats?.eventBreakdown['admission_help_submit'] || 0}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Chatbot Inquiries</span>
                    <strong className="text-slate-900 text-sm">{stats?.eventBreakdown['chatbot_message'] || 0}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Section: Live Activity Log (Last 50 events) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span>Real-Time Visitor Activity Stream</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological log of recent parent interactions across teachersathome
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Showing last {stats?.recentEvents?.length || 0} events
              </span>
            </div>

            {(!stats?.recentEvents || stats.recentEvents.length === 0) ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No telemetry recorded in the database yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Event</th>
                      <th className="py-2.5 px-3">Details / Target</th>
                      <th className="py-2.5 px-3">Page Path</th>
                      <th className="py-2.5 px-3">Device</th>
                      <th className="py-2.5 px-3">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {stats.recentEvents.map(evt => {
                      const dateStr = new Date(evt.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      });

                      const isSchoolClick = evt.event_type === 'school_form_click';
                      const isPageView = evt.event_type === 'page_view';
                      const isWhatsApp = evt.event_type === 'whatsapp_click';

                      return (
                        <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                            {dateStr}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              isSchoolClick ? 'bg-red-50 text-red-700 border border-red-200' :
                              isPageView ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              isWhatsApp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {evt.event_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 max-w-xs truncate font-semibold text-slate-900">
                            {evt.target_id || (evt.metadata ? JSON.stringify(evt.metadata) : '—')}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-600">
                            {evt.page_path || '/'}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="capitalize text-slate-600">{evt.device_type || 'Unknown'}</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                            {evt.ip_address || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
}
