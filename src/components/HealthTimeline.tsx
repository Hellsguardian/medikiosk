import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Pill,
  ArrowRight,
  Search,
  Filter,
  Check,
  Brain,
  HeartPulse,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { MedicalEpisode } from '../types';
import { LiverIconSmall } from './SvgIllustrations';

interface HealthTimelineProps {
  episodes: MedicalEpisode[];
  onSelectEpisode: (episode: MedicalEpisode) => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  episodes,
  onSelectEpisode,
}) => {
  const [timelineSearch, setTimelineSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | '2026' | '2025' | 'ongoing'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter episodes based on search & filter
  const filteredEpisodes = episodes.filter((ep) => {
    const matchesSearch =
      ep.condition.toLowerCase().includes(timelineSearch.toLowerCase()) ||
      ep.startDate.toLowerCase().includes(timelineSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === '2026') return ep.startDate.includes('2026');
    if (selectedFilter === '2025') return ep.startDate.includes('2025');
    if (selectedFilter === 'ongoing') return ep.status === 'Ongoing';
    return true;
  });

  const renderIcon = (iconType: MedicalEpisode['iconType']) => {
    switch (iconType) {
      case 'liver':
        return <LiverIconSmall className="w-5 h-5" />;
      case 'brain':
        return <Brain className="w-5 h-5" strokeWidth={1.8} />;
      case 'head':
        return <HeartPulse className="w-5 h-5" strokeWidth={1.8} />;
      default:
        return <Activity className="w-5 h-5" strokeWidth={1.8} />;
    }
  };

  /**
   * Refined condition-specific visual styling
   * Jaundice: Soft coral / peach (#FFF0EB, #F4775D)
   * Migraine: Soft blue (#EDF5FF, #5799E8)
   * Head Injury: Soft mint green (#E9FAF1, #45C98A)
   */
  const getIconStyles = (iconType: MedicalEpisode['iconType']) => {
    switch (iconType) {
      case 'liver':
        return {
          container: 'bg-[#FFF0EB] text-[#F4775D] border border-[#FFE2D9] shadow-[0_2px_8px_rgba(244,119,93,0.12)]',
        };
      case 'brain':
        return {
          container: 'bg-[#EDF5FF] text-[#5799E8] border border-[#DBEBFE] shadow-[0_2px_8px_rgba(87,153,232,0.12)]',
        };
      case 'head':
        return {
          container: 'bg-[#E9FAF1] text-[#45C98A] border border-[#D1F5E2] shadow-[0_2px_8px_rgba(69,201,138,0.12)]',
        };
      default:
        return {
          container: 'bg-[#F2F1FA] text-[#514DA6] border border-[#E3E3F1] shadow-[0_2px_8px_rgba(81,77,166,0.12)]',
        };
    }
  };

  return (
    <div
      id="medical-history-section"
      className="relative w-full bg-white rounded-[26px] p-6 sm:p-7 lg:p-8 border border-[#504BA0]/[0.08] shadow-[0_8px_30px_rgba(70,65,150,0.06)] overflow-hidden transition-all"
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUBTLE AMBIENT LAVENDER GLOW & BACKGROUND DETAIL */}
      {/* Subconscious, extremely low-opacity motifs that never distract */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="absolute top-0 right-0 w-80 h-44 rounded-full bg-radial from-[#ECEBFA]/40 to-transparent blur-3xl pointer-events-none select-none" aria-hidden="true" />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTION HEADER & INTEGRATED TOOLBAR */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Title + Subtitle with refined vertical lavender accent */}
        <div className="flex items-start gap-3">
          {/* Subtle vertical gradient accent pill */}
          <div
            className="w-1.5 h-11 rounded-full bg-gradient-to-b from-[#716BE0] via-[#514DA6] to-[#423E8E] flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-[22px] sm:text-[24px] font-bold text-[#292A46] tracking-tight leading-snug">
              Your Medical History
            </h3>
            <p className="text-[13.5px] sm:text-[14px] text-[#7F82A5] font-normal mt-0.5">
              A timeline of your health records
            </p>
          </div>
        </div>

        {/* Integrated Search & Filter Controls */}
        <div className="flex items-center gap-2.5 sm:self-auto self-stretch">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="w-4 h-4 text-[#7F82A5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              strokeWidth={1.8}
            />
            <input
              type="text"
              value={timelineSearch}
              onChange={(e) => setTimelineSearch(e.target.value)}
              placeholder="Search your history..."
              className="w-full sm:w-52 h-[38px] bg-[#F5F5FD] hover:bg-[#F0EFFC] focus:bg-white text-[12.5px] sm:text-[13px] text-[#292A46] placeholder-[#8B8DAA] pl-9 pr-3.5 rounded-[16px] border border-[#504BA0]/[0.08] focus:border-[#514DA6]/40 focus:ring-2 focus:ring-[#514DA6]/10 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Filter Dropdown Button */}
          <div className="relative flex-shrink-0">
            <button
              id="timeline-filter-btn"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              type="button"
              className="h-[38px] flex items-center gap-2 px-3.5 rounded-[16px] text-[12.5px] font-medium text-[#4C499E] bg-[#F5F5FD] hover:bg-[#EEEDFB] border border-[#504BA0]/[0.08] transition-all duration-200 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#514DA6]/30 cursor-pointer"
              aria-expanded={showFilterMenu}
              aria-label="Filter medical history records"
            >
              <Filter className="w-3.5 h-3.5 text-[#514DA6]" strokeWidth={1.8} />
              <span>Filter</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#7F82A5] transition-transform duration-200 ${
                  showFilterMenu ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {/* Filter Menu Options */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-[20px] shadow-[0_12px_32px_rgba(70,65,150,0.12)] border border-[#E5E5F0] py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10.5px] font-bold text-[#8B8DAA] uppercase tracking-wider">
                  Filter records
                </div>
                {[
                  { id: 'all', label: 'All Episodes' },
                  { id: 'ongoing', label: 'Active Only' },
                  { id: '2026', label: 'Year 2026' },
                  { id: '2025', label: 'Year 2025' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(opt.id as any);
                      setShowFilterMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-[12.5px] text-left hover:bg-[#F5F5FD] transition-colors text-[#292A46] cursor-pointer"
                  >
                    <span className={selectedFilter === opt.id ? 'font-semibold text-[#514DA6]' : 'font-normal'}>
                      {opt.label}
                    </span>
                    {selectedFilter === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#514DA6]" strokeWidth={2.2} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MEDICAL HISTORY TIMELINE ENTRIES */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative space-y-3">
        {/* Subtle vertical timeline connecting guide (dashed line behind condition icons) */}
        <div
          className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-[1.5px] border-l border-dashed border-[#514DA6]/15 pointer-events-none hidden sm:block"
          aria-hidden="true"
        />

        {filteredEpisodes.length === 0 ? (
          <div className="p-8 text-center bg-[#FBFBFE] rounded-[18px] border border-dashed border-[#E3E3F1] text-[13.5px] text-[#7F82A5]">
            No medical records found matching your search.
          </div>
        ) : (
          filteredEpisodes.map((episode) => {
            const isOngoing = episode.status === 'Ongoing';
            const iconStyle = getIconStyles(episode.iconType);

            return (
              <div
                key={episode.id}
                id={`episode-row-${episode.id}`}
                onClick={() => onSelectEpisode(episode)}
                className={`group relative rounded-[18px] border p-4 sm:px-5 sm:py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 cursor-pointer select-none transition-all duration-200 ease-out active:scale-[0.995] ${
                  isOngoing
                    ? 'bg-[#FAF9FE] hover:bg-[#F7F6FF] border-[#514DA6]/25 hover:border-[#514DA6]/40 shadow-[0_4px_16px_rgba(81,77,166,0.06)] hover:shadow-[0_8px_24px_rgba(81,77,166,0.10)]'
                    : 'bg-[#FBFBFE] hover:bg-[#F7F6FF] border-[#E7E7F4] hover:border-[#CBC9EB] hover:shadow-[0_6px_20px_rgba(70,65,150,0.07)]'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectEpisode(episode);
                  }
                }}
                aria-label={`View clinical details for ${episode.condition}, recorded on ${episode.startDate}`}
              >
                {/* LEFT: Condition Icon, Name, Date & Status */}
                <div className="flex items-center gap-3.5 sm:gap-4 md:min-w-[250px] relative z-10">
                  {/* Refined condition icon squircle container */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.03] ${iconStyle.container}`}
                  >
                    {renderIcon(episode.iconType)}
                  </div>

                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h4 className="font-bold text-[#292A46] text-[15.5px] sm:text-[17px] group-hover:text-[#514DA6] transition-colors leading-tight">
                        {episode.condition}
                      </h4>

                      {/* Refined Active status pill with pulsing indicator */}
                      {isOngoing && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEEEFF] text-[#5956B5] border border-[#DDDDF8]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#716BE0] animate-pulse" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[13px] sm:text-[13.5px] text-[#8B8DAA] block mt-0.5 font-normal">
                      {episode.startDate}
                    </span>
                  </div>
                </div>

                {/* MIDDLE: Compact, subtle information chips */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 relative z-10">
                  {/* Visits chip */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[13px] bg-[#F5F5FC] group-hover:bg-white text-[#292A46] text-[11.5px] sm:text-[12px] font-medium border border-[#504BA0]/[0.06] transition-colors">
                    <Calendar className="w-3.5 h-3.5 text-[#514DA6]" strokeWidth={1.8} />
                    <span>
                      {episode.visitCount} {episode.visitCount === 1 ? 'visit' : 'visits'}
                    </span>
                  </span>

                  {/* Reports chip */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[13px] bg-[#F5F5FC] group-hover:bg-white text-[#292A46] text-[11.5px] sm:text-[12px] font-medium border border-[#504BA0]/[0.06] transition-colors">
                    <FileText className="w-3.5 h-3.5 text-[#514DA6]" strokeWidth={1.8} />
                    <span>
                      {episode.reportCount} {episode.reportCount === 1 ? 'report' : 'reports'}
                    </span>
                  </span>

                  {/* Prescriptions chip */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[13px] bg-[#F5F5FC] group-hover:bg-white text-[#292A46] text-[11.5px] sm:text-[12px] font-medium border border-[#504BA0]/[0.06] transition-colors">
                    <Pill className="w-3.5 h-3.5 text-[#514DA6]" strokeWidth={1.8} />
                    <span>
                      {episode.prescriptionCount}{' '}
                      {episode.prescriptionCount === 1 ? 'prescription' : 'prescriptions'}
                    </span>
                  </span>
                </div>

                {/* RIGHT: Circular interaction arrow cue */}
                <div className="flex items-center justify-end md:pl-2 relative z-10">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F2F1FA] group-hover:bg-[#E8E6F8] text-[#7F82A5] group-hover:text-[#514DA6] flex items-center justify-center transition-all duration-200">
                    <ArrowRight
                      className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-200"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
