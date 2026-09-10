import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Globe,
  Check,
  User,
} from 'lucide-react';
import { PatientProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';

/**
 * MediKiosk Heart with Medical Cross Icon
 * Styled precisely to match the purple heart & white centered cross from the reference design.
 */
const MediKioskHeartIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 27.2C15.65 27.2 15.3 27.07 15.03 26.8C9.6 21.6 4 16.2 4 10.8C4 6.5 7.4 3.2 11.6 3.2C14.1 3.2 15.35 4.35 16 5.3C16.65 4.35 17.9 3.2 20.4 3.2C24.6 3.2 28 6.5 28 10.8C28 16.2 22.4 21.6 16.97 26.8C16.7 27.07 16.35 27.2 16 27.2Z"
      fill="#514DA6"
    />
    <rect x="14.25" y="9.2" width="3.5" height="9.6" rx="1.2" fill="white" />
    <rect x="11.2" y="12.25" width="9.6" height="3.5" rx="1.2" fill="white" />
  </svg>
);

interface HeaderProps {
  patient: PatientProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProfile: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  searchQuery,
  onSearchChange,
  onOpenProfile,
  onToggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'LFT Follow-up Ready',
      desc: 'Liver function test report from 05 Sep 2026 has been uploaded.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Upcoming OPD Consultation',
      desc: 'Dr. Anjali Sharma (Gastroenterology) on 12 Sep 2026, 10:30 AM.',
      time: '1 day ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Prescription Refill',
      desc: 'UDCA 300mg has 1 refill remaining.',
      time: '3 days ago',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header
      id="medikiosk-global-header"
      className="sticky top-2.5 sm:top-3 z-30 mx-[30px] mt-2.5 sm:mt-3 mb-2 h-[62px] sm:h-[66px] bg-white rounded-[22px] border border-[#504BA0]/[0.08] shadow-[0_4px_20px_rgba(70,65,150,0.05)] px-3.5 sm:px-5 lg:px-6 flex items-center justify-between transition-all"
    >
      {/* ── LEFT: MediKiosk Brand (Acts as Sidebar Collapse / Expand Toggle) ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <div
          onClick={onToggleSidebar}
          role={onToggleSidebar ? 'button' : undefined}
          tabIndex={onToggleSidebar ? 0 : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleSidebar?.();
            }
          }}
          title={onToggleSidebar ? 'Toggle navigation sidebar' : undefined}
          className={`flex items-center gap-2 sm:gap-2.5 select-none ${
            onToggleSidebar
              ? 'cursor-pointer group/logo active:scale-[0.99] transition-transform'
              : ''
          }`}
          aria-label="MediKiosk health companion logo. Click to expand or collapse navigation."
        >
          {/* Heart icon with medical plus */}
          <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover/logo:scale-105">
            <MediKioskHeartIcon className="w-7 h-7 sm:w-7.5 sm:h-7.5" />
          </div>

          {/* MediKiosk Brand Name & Subtitle */}
          <div className="flex flex-col text-left">
            <span className="text-[15px] sm:text-[16px] font-bold text-[#292A46] tracking-tight leading-none group-hover/logo:text-[#514DA6] transition-colors">
              MediKiosk
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8587A7] font-normal tracking-tight leading-tight mt-1">
              Your Health Companion
            </span>
          </div>
        </div>
      </div>

      {/* ── CENTER: Global Search Bar ── */}
      <div className="relative flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-[460px] mx-2 sm:mx-4">
        <div className="relative flex items-center w-full">
          <Search
            className="w-4 h-4 text-[#514DA6] absolute left-3.5 pointer-events-none transition-colors"
            strokeWidth={1.8}
          />
          <input
            id="medikiosk-global-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records, reports, or conditions..."
            className="w-full bg-[#F5F5FD] hover:bg-[#EFEFFB] focus:bg-white text-[#292A46] text-xs sm:text-[13px] placeholder-[#8B8DAA] pl-9 sm:pl-10 pr-8 sm:pr-9 h-[38px] sm:h-[40px] rounded-full border border-[#504BA0]/[0.08] focus:border-[#514DA6]/40 focus:outline-none focus:ring-2 focus:ring-[#514DA6]/10 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-[#8B8DAA] hover:text-[#292A46] px-1.5 py-0.5 rounded-full bg-white shadow-2xs cursor-pointer"
              aria-label="Clear search query"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT: Notification, Language, & Patient Profile (Date Removed) ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
        {/* Notification Bell with Coral Indicator Dot */}
        <div className="relative flex-shrink-0">
          <button
            id="header-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            type="button"
            className="relative w-9 h-9 rounded-full bg-transparent hover:bg-[#F5F5FD] text-[#292A46] hover:text-[#514DA6] flex items-center justify-center transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#514DA6]/30"
            aria-label="View notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4 text-[#292A46]" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F4775D] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_12px_32px_rgba(70,65,150,0.14)] border border-[#E5E5F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5F0] px-1">
                <div className="font-semibold text-sm text-[#292A46]">Notifications</div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#514DA6] hover:underline font-medium cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#E5E5F0] max-h-64 overflow-y-auto mt-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl text-left transition ${
                      notif.unread ? 'bg-[#F5F5FD]' : 'hover:bg-[#F5F5FD]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#292A46]">{notif.title}</span>
                      <span className="text-[10px] text-[#8B8DAA]">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-[#292A46]/80 mt-0.5 leading-snug">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector Pill */}
        <div className="relative flex-shrink-0">
          <button
            id="header-language-btn"
            onClick={() => setShowLanguages(!showLanguages)}
            type="button"
            className="h-[38px] sm:h-[40px] flex items-center gap-1.5 px-3 sm:px-3.5 rounded-full text-xs sm:text-[12.5px] font-medium text-[#292A46] bg-[#F5F5FD] hover:bg-[#EFEFFB] transition-all border border-[#504BA0]/[0.08] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#514DA6]/30"
            aria-expanded={showLanguages}
            aria-label="Select application language"
          >
            <Globe className="w-4 h-4 text-[#514DA6]" strokeWidth={1.8} />
            <span className="hidden sm:inline font-medium">{selectedLang}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#8B8DAA] transition-transform duration-200 ${
                showLanguages ? 'rotate-180' : ''
              }`}
              strokeWidth={1.8}
            />
          </button>

          {/* Languages Dropdown Menu */}
          {showLanguages && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_12px_32px_rgba(70,65,150,0.14)] border border-[#E5E5F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8B8DAA] uppercase tracking-wider">
                Select Language
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.label);
                    setShowLanguages(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-[#F5F5FD] transition text-[#292A46] cursor-pointer"
                >
                  <span>
                    {lang.label} <span className="text-[#8B8DAA] text-[11px]">({lang.native})</span>
                  </span>
                  {selectedLang === lang.label && (
                    <Check className="w-3.5 h-3.5 text-[#514DA6]" strokeWidth={2.2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Patient Profile Account Pill */}
        <button
          id="header-profile-btn"
          onClick={onOpenProfile}
          type="button"
          className="h-[38px] sm:h-[40px] flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-2.5 sm:pr-3 rounded-full bg-[#F5F5FD] hover:bg-[#EFEFFB] border border-[#504BA0]/[0.08] transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#514DA6]/30 flex-shrink-0"
          aria-label={`Open account profile for ${patient.name}`}
        >
          {/* Circular avatar with user silhouette on soft lavender background */}
          <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#EAE8FA] text-[#514DA6] font-bold text-xs flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#514DA6]" strokeWidth={2} />
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs sm:text-[12.5px] font-bold text-[#292A46] leading-tight">
              {patient.name}
            </span>
            <span className="text-[10px] text-[#8587A7] font-medium leading-none mt-0.5">
              {patient.abhaId}
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-[#8B8DAA]" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
};
