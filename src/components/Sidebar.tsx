import React from 'react';
import {
  Home,
  FileText,
  Pill,
  Calendar,
  User,
  HelpCircle,
  LogOut,
  FolderHeart,
} from 'lucide-react';
import { NavTab } from '../types';
import { MediKioskLogo, SidebarWatermarkLeaves } from './SvgIllustrations';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOverlay?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onHelpClick,
  onLogoutClick,
  collapsed,
  onToggleCollapse,
  isMobileOverlay = false,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    renderIcon: (strokeWidth: number, className: string) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      renderIcon: (sw, cls) => <Home className={cls} strokeWidth={sw} />,
    },
    {
      id: 'my-health',
      label: 'Health History',
      renderIcon: (sw, cls) => <FolderHeart className={cls} strokeWidth={sw} />,
    },
    {
      id: 'documents',
      label: 'Documents',
      renderIcon: (sw, cls) => <FileText className={cls} strokeWidth={sw} />,
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      renderIcon: (sw, cls) => <Pill className={cls} strokeWidth={sw} />,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      renderIcon: (sw, cls) => <Calendar className={cls} strokeWidth={sw} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      renderIcon: (sw, cls) => <User className={cls} strokeWidth={sw} />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop if expanded as an overlay on small screens */}
      {isMobileOverlay && !collapsed && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onToggleCollapse}
          aria-hidden="true"
        />
      )}

      <aside
        id="medikiosk-sidebar-container"
        className={`select-none z-40 transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMobileOverlay && !collapsed
            ? 'fixed top-2.5 left-2.5 bottom-2.5 h-[calc(100vh-20px)] w-[275px] max-w-[calc(100vw-20px)]'
            : 'sticky top-2.5 sm:top-3 h-[calc(100vh-20px)] sm:h-[calc(100vh-24px)] flex-shrink-0'
        }`}
        style={{
          width:
            isMobileOverlay && !collapsed
              ? undefined
              : collapsed
              ? 'var(--sidebar-collapsed-width)'
              : 'var(--sidebar-expanded-width)',
        }}
      >
        <div
          id="medikiosk-sidebar"
          className={`relative h-full flex flex-col justify-between rounded-[22px] bg-gradient-to-b from-[#514DA6] via-[#4C499E] to-[#423F8F] text-white border border-white/15 shadow-[0_8px_32px_rgba(60,55,140,0.22)] transition-all duration-300 ease-in-out ${
            collapsed ? 'w-[101px] px-3 py-4 sm:py-5 items-center' : 'w-full px-4 sm:px-5 py-4 sm:py-5'
          }`}
        >
          {/* ── TOP SECTION: MEDIKIOSK LOGO & TOGGLE ── */}
          <div className="w-full flex flex-col items-center">
            <div
              className={`w-full flex ${
                collapsed ? 'justify-center pt-0.5 mb-6 sm:mb-7' : 'items-center justify-between mb-6 sm:mb-7'
              }`}
            >
              <button
                id="medikiosk-logo-toggle"
                onClick={onToggleCollapse}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className={`group/logo relative flex items-center rounded-2xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-left ${
                  collapsed
                    ? 'p-0 justify-center'
                    : 'w-full gap-3 p-1.5 -ml-1 hover:bg-white/10 active:scale-[0.99]'
                }`}
              >
                {/* Brand Icon Mark inside refined rounded container */}
                <div
                  className={`flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    collapsed
                      ? 'w-[52px] h-[52px] rounded-[18px] bg-white/18 backdrop-blur-sm border border-white/30 shadow-[0_4px_16px_rgba(25,20,70,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.4)] hover:brightness-105 group-hover/logo:scale-[1.04] group-hover/logo:bg-white/25 group-hover/logo:shadow-[0_6px_20px_rgba(25,20,70,0.25)]'
                      : 'w-12 h-12 rounded-[18px] bg-white/15 border border-white/25 shadow-[0_4px_14px_rgba(30,25,80,0.18)] group-hover/logo:scale-[1.04] group-hover/logo:bg-white/20 group-hover/logo:shadow-[0_6px_20px_rgba(30,25,80,0.25)]'
                  }`}
                >
                  <MediKioskLogo
                    className={`text-white transition-transform duration-200 ${
                      collapsed ? 'w-6.5 h-6.5' : 'w-6 h-6'
                    }`}
                  />
                </div>

                {/* Brand Text (Expanded only — completely omitted in collapsed state) */}
                {!collapsed && (
                  <div className="flex flex-col overflow-hidden transition-all duration-200 w-auto opacity-100 max-w-[200px]">
                    <span className="font-bold text-[17px] tracking-tight leading-none text-white whitespace-nowrap">
                      MediKiosk
                    </span>
                    <span className="text-[11px] text-[#E9E7FA]/80 mt-1 font-normal tracking-tight whitespace-nowrap">
                      Your Health Companion
                    </span>
                  </div>
                )}

                {/* Hover Tooltip for Collapsed Logo */}
                {collapsed && (
                  <div className="opacity-0 -translate-x-1.5 group-hover/logo:opacity-100 group-hover/logo:translate-x-0 pointer-events-none transition-all duration-150 absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-[#232050] text-white text-[11px] font-medium rounded-lg shadow-lg border border-white/15 whitespace-nowrap flex items-center gap-1.5 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#232050]">
                    <span>Expand navigation</span>
                  </div>
                )}
              </button>
            </div>

            {/* ── MIDDLE SECTION: PRIMARY NAVIGATION (ICON-ONLY WHEN COLLAPSED) ── */}
            <nav
              className={`w-full flex flex-col items-center ${collapsed ? 'space-y-2.5' : 'space-y-1.5'}`}
              aria-label="Main Navigation"
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative w-full flex justify-center group">
                    <button
                      id={`nav-item-${item.id}`}
                      onClick={() => onTabChange(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={item.label}
                      className={`relative flex items-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer ${
                        collapsed
                          ? isActive
                            ? 'w-[60px] h-[52px] rounded-[18px] bg-gradient-to-b from-white/60 via-white/50 to-white/40 backdrop-blur-md border border-white/60 text-[#2D286F] shadow-[0_8px_22px_rgba(25,20,75,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(255,255,255,0.2)] justify-center'
                            : 'w-[60px] h-[48px] rounded-[16px] text-white/80 hover:text-white hover:bg-white/12 hover:backdrop-blur-xs justify-center'
                          : isActive
                          ? 'w-full h-[50px] px-3.5 gap-3.5 text-left rounded-2xl bg-white/20 text-white font-semibold shadow-[0_2px_8px_rgba(40,30,80,0.12)] backdrop-blur-xs'
                          : 'w-full h-[50px] px-3.5 gap-3.5 text-left rounded-2xl text-[#E9E7FA]/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {/* Navigation Icon with medium healthcare SaaS stroke (2.2) and larger 22-23px size */}
                      <span
                        className={`flex items-center justify-center transition-transform duration-200 ${
                          collapsed
                            ? isActive
                              ? 'text-[#2D286F] scale-105'
                              : 'text-[#E7E5FA]/85 group-hover:text-white group-hover:scale-105'
                            : isActive
                            ? 'text-white scale-105'
                            : 'text-white/90 group-hover:scale-105'
                        }`}
                      >
                        {item.renderIcon(
                          collapsed ? (isActive ? 2.25 : 2.2) : 1.8,
                          collapsed
                            ? isActive
                              ? 'w-[23px] h-[23px] flex-shrink-0'
                              : 'w-[22px] h-[22px] flex-shrink-0'
                            : 'w-5 h-5 flex-shrink-0'
                        )}
                      </span>

                      {/* Navigation Label (Expanded only — completely hidden in collapsed state) */}
                      {!collapsed && (
                        <span className="text-[14px] leading-none whitespace-nowrap overflow-hidden transition-all duration-200 w-auto opacity-100 max-w-[180px]">
                          {item.label}
                        </span>
                      )}
                    </button>

                    {/* Hover-only Tooltip for Collapsed navigation rail */}
                    {collapsed && (
                      <div className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-150 absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-[#232050] text-white text-[11px] font-medium rounded-lg shadow-lg border border-white/15 whitespace-nowrap flex items-center before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#232050]">
                        <span>{item.label}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ── BOTTOM SECTION: HELP, LOGOUT & BRAND WATERMARK ── */}
          <div
            className={`w-full relative z-10 flex flex-col items-center ${
              collapsed ? 'pt-2 pb-1' : 'pt-3'
            }`}
          >
            <div
              className={`w-full flex flex-col items-center ${
                collapsed ? 'space-y-2' : 'space-y-1.5 border-t border-white/15 pt-2.5'
              }`}
            >
              {/* Subtle divider line above Help & Logout when collapsed */}
              {collapsed && <div className="w-11 h-px bg-white/20 my-1" />}

              {/* Help button */}
              <div className="relative w-full flex justify-center group">
                <button
                  id="sidebar-help-btn"
                  onClick={onHelpClick}
                  aria-label="Help & Clinical AI Guidance"
                  className={`relative flex items-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer ${
                    collapsed
                      ? 'w-[60px] h-[46px] rounded-[16px] justify-center text-[#E7E5FA]/85 hover:text-white hover:bg-white/12 hover:backdrop-blur-xs'
                      : 'w-full h-[48px] px-3.5 gap-3.5 text-left text-[#E9E7FA]/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <HelpCircle
                    className={`${
                      collapsed ? 'w-[21.5px] h-[21.5px]' : 'w-5 h-5'
                    } flex-shrink-0 text-white/90 group-hover:scale-105 transition-transform`}
                    strokeWidth={collapsed ? 2.2 : 1.8}
                  />
                  {!collapsed && (
                    <span className="text-[14px] leading-none whitespace-nowrap overflow-hidden transition-all duration-200 w-auto opacity-100 max-w-[180px]">
                      Help
                    </span>
                  )}
                </button>

                {collapsed && (
                  <div className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-150 absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-[#232050] text-white text-[11px] font-medium rounded-lg shadow-lg border border-white/15 whitespace-nowrap before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#232050]">
                    <span>Help</span>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <div className="relative w-full flex justify-center group">
                <button
                  id="sidebar-logout-btn"
                  onClick={onLogoutClick}
                  aria-label="Logout session"
                  className={`relative flex items-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer ${
                    collapsed
                      ? 'w-[60px] h-[46px] rounded-[16px] justify-center text-[#E7E5FA]/85 hover:text-white hover:bg-white/12 hover:backdrop-blur-xs'
                      : 'w-full h-[48px] px-3.5 gap-3.5 text-left text-[#E9E7FA]/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut
                    className={`${
                      collapsed ? 'w-[21.5px] h-[21.5px]' : 'w-5 h-5'
                    } flex-shrink-0 text-white/90 group-hover:scale-105 transition-transform`}
                    strokeWidth={collapsed ? 2.2 : 1.8}
                  />
                  {!collapsed && (
                    <span className="text-[14px] leading-none whitespace-nowrap overflow-hidden transition-all duration-200 w-auto opacity-100 max-w-[180px]">
                      Logout
                    </span>
                  )}
                </button>

                {collapsed && (
                  <div className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-150 absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 bg-[#232050] text-white text-[11px] font-medium rounded-lg shadow-lg border border-white/15 whitespace-nowrap before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#232050]">
                    <span>Logout</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Background leaf watermark with refined opacity */}
          <div className="absolute -bottom-4 -left-4 pointer-events-none overflow-hidden rounded-[22px]">
            <SidebarWatermarkLeaves
              className={collapsed ? 'w-24 h-24 opacity-12' : 'w-44 h-44 opacity-35'}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
