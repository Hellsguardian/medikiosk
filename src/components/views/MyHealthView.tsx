import React, { useState } from 'react';
import { Calendar, FileText, Pill, ArrowRight, Activity, Clock, Shield } from 'lucide-react';
import { MedicalEpisode } from '../../types';
import { LiverIconSmall } from '../SvgIllustrations';

interface MyHealthViewProps {
  episodes: MedicalEpisode[];
  onSelectEpisode: (ep: MedicalEpisode) => void;
  onStartConsultation: () => void;
}

export const MyHealthView: React.FC<MyHealthViewProps> = ({
  episodes,
  onSelectEpisode,
  onStartConsultation,
}) => {
  const [activeYear, setActiveYear] = useState<'All' | '2026' | '2025'>('All');

  const filtered = episodes.filter((ep) => {
    if (activeYear === 'All') return true;
    return ep.startDate.includes(activeYear);
  });

  return (
    <div id="my-health-full-view" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-mk-text-primary tracking-tight">
            Longitudinal Health Record
          </h2>
          <p className="text-xs sm:text-sm text-mk-text-secondary">
            Comprehensive multi-year medical history mapped to your ABHA health locker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', '2026', '2025'].map((yr) => (
            <button
              key={yr}
              onClick={() => setActiveYear(yr as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                activeYear === yr
                  ? 'bg-mk-primary text-white shadow-xs'
                  : 'bg-white text-mk-text-secondary border border-mk-border hover:bg-mk-surface-secondary'
              }`}
            >
              {yr === 'All' ? 'All Years' : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline view by year */}
      <div className="space-y-6">
        {/* Group by Year */}
        {['2026', '2025'].map((year) => {
          const yearEpisodes = filtered.filter((ep) => ep.startDate.includes(year));
          if (yearEpisodes.length === 0) return null;

          return (
            <div key={year} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-mk-primary bg-mk-surface-secondary px-3 py-1 rounded-full border border-mk-border">
                  {year} Episodes ({yearEpisodes.length})
                </span>
                <div className="flex-1 h-px bg-mk-border-light" />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {yearEpisodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onSelectEpisode(ep)}
                    className="p-5 bg-white rounded-2xl border border-mk-border hover:border-mk-primary-light hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: ep.categoryColor }}
                      >
                        {ep.iconType === 'liver' ? (
                          <LiverIconSmall className="w-6 h-6 text-white" />
                        ) : ep.iconType === 'brain' ? (
                          <span className="text-xl">🧠</span>
                        ) : (
                          <span className="text-xl">🩹</span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-mk-text-primary">{ep.condition}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              ep.status === 'Ongoing'
                                ? 'bg-[#FFAAA6]/20 text-[#D85742]'
                                : 'bg-[#E8F8F2] text-[#2EA07B]'
                            }`}
                          >
                            {ep.status}
                          </span>
                        </div>
                        <p className="text-xs text-mk-text-secondary mt-0.5">
                          First recorded on {ep.startDate} • {ep.overview.hospital}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-mk-surface-secondary text-mk-text-secondary font-medium">
                          {ep.visitCount} visits
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-mk-surface-secondary text-mk-text-secondary font-medium">
                          {ep.reportCount} reports
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-mk-surface-secondary text-mk-text-secondary font-medium">
                          {ep.prescriptionCount} rx
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mk-text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
