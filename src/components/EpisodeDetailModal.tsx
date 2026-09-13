import React, { useState } from 'react';
import {
  X,
  Calendar,
  FileText,
  Pill,
  Clock,
  User,
  Building,
  AlertCircle,
  CheckCircle2,
  Download,
  Share2,
  Sparkles,
  Brain,
  HeartPulse,
} from 'lucide-react';
import { MedicalEpisode, MedicalReport, Prescription } from '../types';
import { LiverIconSmall } from './SvgIllustrations';

interface EpisodeDetailModalProps {
  episode: MedicalEpisode | null;
  onClose: () => void;
  onViewReport: (report: MedicalReport) => void;
}

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  onViewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'prescriptions' | 'visits'>('overview');

  if (!episode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="episode-detail-modal"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-6 pb-5 bg-mk-surface-tint border-b border-mk-border-light flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center text-mk-primary-dark bg-mk-lavender-pale border border-mk-border-light shadow-2xs">
              {episode.iconType === 'liver' ? (
                <LiverIconSmall className="w-6 h-6 text-[#CC76AC]" />
              ) : episode.iconType === 'brain' ? (
                <Brain className="w-6 h-6 text-[#4C499E]" strokeWidth={1.8} />
              ) : (
                <HeartPulse className="w-6 h-6 text-[#10B981]" strokeWidth={1.8} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl font-bold text-mk-text-primary">{episode.condition}</h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    episode.status === 'Ongoing'
                      ? 'bg-mk-lavender-very-pale text-mk-primary-dark border border-mk-lavender-pale'
                      : 'bg-[#EAF5EF] text-[#3D9970] border border-[#CEEAD9]'
                  }`}
                >
                  {episode.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-mk-text-secondary mt-1">
                <span>First recorded: {episode.startDate}</span>
                <span>•</span>
                <span>ICD-10: {episode.icdCode || 'Clinical Episode'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-mk-surface-secondary text-mk-text-muted hover:text-mk-text-primary flex items-center justify-center transition border border-mk-border"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 sm:px-6 border-b border-mk-border-light bg-white gap-2 pt-2 overflow-x-auto whitespace-nowrap">
          {[
            { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} /> },
            { id: 'reports', label: `Reports (${episode.reports.length})`, icon: <FileText className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} /> },
            { id: 'prescriptions', label: `Prescriptions (${episode.prescriptions.length})`, icon: <Pill className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} /> },
            { id: 'visits', label: `Visits (${episode.visits.length})`, icon: <Clock className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition -mb-px flex-shrink-0 ${
                activeTab === tab.id
                  ? 'border-mk-primary text-mk-primary-dark'
                  : 'border-transparent text-mk-text-secondary hover:text-mk-text-primary'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 text-mk-text-primary">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* AI Clinical Summary Card */}
              <div className="rounded-2xl p-5 bg-mk-surface-secondary border border-mk-border-light relative">
                <div className="flex items-center gap-2 text-mk-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Clinical Summary (Longitudinal Health Digest)</span>
                </div>
                <p className="text-xs sm:text-sm text-mk-text-primary leading-relaxed">
                  {episode.overview.clinicalSummary}
                </p>
                <div className="mt-3 pt-2.5 border-t border-mk-border-light text-[11px] text-mk-text-muted italic">
                  Note: AI-generated summary draft for attending clinical review. Certified by Apollo Healthcare Health Exchange.
                </div>
              </div>

              {/* Primary Symptoms */}
              <div>
                <h4 className="text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-2">
                  Key Symptoms Logged
                </h4>
                <div className="flex flex-wrap gap-2">
                  {episode.overview.primarySymptoms.map((symp, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-mk-surface-secondary text-mk-primary-dark text-xs font-medium border border-mk-border-light"
                    >
                      {symp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attending Physician & Facility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-mk-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mk-text-muted uppercase font-bold">Attending Doctor</div>
                    <div className="text-xs sm:text-sm font-bold text-mk-text-primary">
                      {episode.overview.attendingPhysician}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-mk-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-mk-text-muted uppercase font-bold">Facility</div>
                    <div className="text-xs sm:text-sm font-bold text-mk-text-primary">
                      {episode.overview.hospital}
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Advice / Current Assessment */}
              <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#F6E9C8]">
                <div className="text-xs font-bold text-[#A87212] mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Physician Directive & Recommendations</span>
                </div>
                <p className="text-xs text-[#52411C] leading-relaxed">
                  {episode.overview.doctorNotes}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {episode.reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-white border border-mk-border-light hover:border-mk-primary-light hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-mk-text-primary">{report.title}</h5>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            report.status === 'Normal'
                              ? 'bg-[#E8F8F2] text-[#2EA07B]'
                              : report.status === 'Critical'
                              ? 'bg-[#FFEAE8] text-[#E03A2F]'
                              : 'bg-[#FFF6E5] text-[#C27D00]'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p className="text-xs text-mk-text-secondary mt-0.5">
                        {report.facility} • {report.date}
                      </p>
                      {report.keyFindings && (
                        <p className="text-xs text-mk-text-secondary mt-1 bg-mk-surface-secondary p-2 rounded-lg border border-mk-border-light">
                          <span className="font-semibold text-mk-primary-dark">Key finding:</span>{' '}
                          {report.keyFindings}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onViewReport(report)}
                      className="px-3.5 py-1.5 rounded-xl bg-mk-surface-secondary hover:bg-mk-lavender-very-pale text-mk-primary-dark text-xs font-semibold transition"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => onViewReport(report)}
                      className="p-2 rounded-xl text-mk-text-muted hover:text-mk-text-primary hover:bg-mk-surface-secondary transition"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {episode.prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-white border border-mk-border-light shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center">
                        <Pill className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-mk-text-primary">{rx.medicationName}</h5>
                        <p className="text-xs text-mk-text-secondary">
                          Dosage: <strong className="text-mk-text-primary">{rx.dosage}</strong> • {rx.frequency}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        rx.status === 'Active'
                          ? 'bg-[#EDF5F2] text-[#44836D] border-[#D4E8DF]'
                          : 'bg-mk-surface-secondary text-mk-text-muted border-mk-border-light'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>

                  <div className="bg-mk-surface-secondary p-3 rounded-xl border border-mk-border-light text-xs text-mk-text-secondary">
                    <div className="font-medium text-mk-text-primary">Directions: {rx.instructions}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-mk-border-light text-[11px] text-mk-text-muted">
                      <span>Prescribed by: {rx.prescribedBy}</span>
                      <span>Duration: {rx.duration}</span>
                      <span>Refills left: {rx.refillsRemaining}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: VISITS TIMELINE */}
          {activeTab === 'visits' && (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-mk-border-light animate-in fade-in duration-150">
              {episode.visits.map((visit) => (
                <div key={visit.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-mk-primary border-4 border-white shadow-xs" />

                  <div className="bg-white p-4 rounded-2xl border border-mk-border-light shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-mk-text-primary">{visit.title}</h5>
                      <span className="text-xs font-semibold text-mk-primary-dark bg-mk-lavender-very-pale px-2.5 py-0.5 rounded-full">
                        {visit.date}
                      </span>
                    </div>

                    <div className="text-xs text-mk-text-secondary mt-1">
                      {visit.doctorName} • {visit.department}
                    </div>

                    <p className="text-xs text-mk-text-secondary mt-2.5 bg-mk-surface-secondary p-3 rounded-xl border border-mk-border-light leading-relaxed">
                      {visit.notes}
                    </p>

                    {visit.vitals && (
                      <div className="flex flex-wrap gap-3 mt-3 pt-2 border-t border-mk-border-light text-[11px] text-mk-text-secondary">
                        {visit.vitals.bloodPressure && (
                          <span>BP: <strong>{visit.vitals.bloodPressure}</strong></span>
                        )}
                        {visit.vitals.pulse && (
                          <span>Pulse: <strong>{visit.vitals.pulse}</strong></span>
                        )}
                        {visit.vitals.temperature && (
                          <span>Temp: <strong>{visit.vitals.temperature}</strong></span>
                        )}
                        {visit.vitals.weight && (
                          <span>Weight: <strong>{visit.vitals.weight}</strong></span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-mk-surface-secondary border-t border-mk-border flex items-center justify-between">
          <div className="text-xs text-mk-text-muted">
            Digital Health Records are end-to-end encrypted with ABHA consent.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
