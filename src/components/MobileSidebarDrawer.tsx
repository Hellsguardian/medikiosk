import React, { useEffect } from 'react';
import {
  Home,
  FileText,
  Pill,
  Calendar,
  User,
  HelpCircle,
  LogOut,
  FolderHeart,
  X,
} from 'lucide-react';
import { NavTab } from '../types';
import { MediKioskLogo, SidebarWatermarkLeaves } from './SvgIllustrations';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onHelpClick,
  onLogoutClick,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div className="md:hidden">
      {/* Subtle Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-[#141230]/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Off-Canvas Slide-In Drawer */}
      <aside
        id="medikiosk-mobile-sidebar-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed top-0 left-0 bottom-0 z-50 w-[290px] max-w-[85vw] h-full flex flex-col justify-between bg-gradient-to-b from-[#514DA6] via-[#4C499E] to-[#423F8F] text-white rounded-r-[26px] border-r border-y border-white/20 shadow-[0_16px_40px_rgba(20,15,60,0.45)] px-4 sm:px-5 py-5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Background decorative watermark */}
        <div className="absolute -bottom-6 -left-6 pointer-events-none overflow-hidden select-none opacity-20">
          <SidebarWatermarkLeaves className="w-48 h-48" />
        </div>

        {/* ── TOP: Brand & Close Button ── */}
        <div className="relative z-10 flex items-center justify-between pb-5 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] bg-white/18 border border-white/25 shadow-[0_4px_14px_rgba(30,25,80,0.2)] flex items-center justify-center flex-shrink-0">
              <MediKioskLogo className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[17px] tracking-tight leading-none text-white">
                MediKiosk
              </span>
              <span className="text-[11px] text-[#E9E7FA]/80 mt-1 font-normal tracking-tight">
                Your Health Companion
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* ── MIDDLE: Complete Navigation List ── */}
        <nav
          className="relative z-10 flex-1 py-5 space-y-2 overflow-y-auto"
          aria-label="Mobile Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full h-[50px] px-4 gap-3.5 flex items-center rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-white/25 to-white/15 border border-white/35 text-white font-semibold shadow-[0_4px_16px_rgba(25,20,75,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-xs'
                    : 'text-[#E9E7FA]/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <span
                  className={`flex items-center justify-center transition-transform ${
                    isActive ? 'text-white scale-105' : 'text-white/85'
                  }`}
                >
                  {item.renderIcon(isActive ? 2.2 : 1.9, 'w-5 h-5 flex-shrink-0')}
                </span>
                <span className="text-[15px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── BOTTOM: Help & Logout ── */}
        <div className="relative z-10 pt-4 border-t border-white/15 space-y-2">
          {/* Help Button */}
          <button
            type="button"
            id="mobile-nav-help"
            onClick={() => {
              onClose();
              onHelpClick();
            }}
            className="w-full h-[46px] px-4 gap-3.5 flex items-center rounded-2xl text-[#E9E7FA]/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left font-medium"
          >
            <HelpCircle className="w-5 h-5 text-white/90 flex-shrink-0" strokeWidth={1.9} />
            <span className="text-[14px]">Help & AI Guidance</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            id="mobile-nav-logout"
            onClick={() => {
              onClose();
              onLogoutClick();
            }}
            className="w-full h-[46px] px-4 gap-3.5 flex items-center rounded-2xl text-[#E9E7FA]/85 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left font-medium"
          >
            <LogOut className="w-5 h-5 text-white/90 flex-shrink-0" strokeWidth={1.9} />
            <span className="text-[14px]">Lock Session</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
