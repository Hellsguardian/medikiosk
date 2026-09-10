import React from 'react';
import {
  FileText,
  ArrowRight,
  Upload,
  FlaskConical,
  Scan,
  Pill,
  Droplets,
} from 'lucide-react';
import { MedicalReport } from '../types';

interface RecentDocumentsProps {
  documents: MedicalReport[];
  onViewReport: (doc: MedicalReport) => void;
  onUploadClick: () => void;
  onViewAllClick: () => void;
}

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({
  documents,
  onViewReport,
  onUploadClick,
  onViewAllClick,
}) => {
  /**
   * Refined document-specific color identity and iconography:
   * - Liver Function Test: soft coral / peach (#FFF0EB, #F17861)
   * - Ultrasound Abdomen: soft lavender / blue (#EEF1FF, #6966C8)
   * - Prescription: soft pink (#FFF0F7, #E65A9D)
   * - Blood Test Report: soft mint / green (#EAF9F2, #42B987)
   */
  const getDocumentTypeMeta = (doc: MedicalReport) => {
    const titleLower = doc.title.toLowerCase();
    const typeLower = (doc.type || '').toLowerCase();

    if (titleLower.includes('liver') || typeLower.includes('liver')) {
      return {
        bg: 'bg-[#FFF0EB]',
        iconColor: 'text-[#F17861]',
        border: 'border-[#FFE2D9]',
        icon: <FlaskConical className="w-5 h-5" strokeWidth={1.9} />,
      };
    }

    if (titleLower.includes('ultrasound') || typeLower.includes('ultrasound') || typeLower.includes('imaging')) {
      return {
        bg: 'bg-[#EEF1FF]',
        iconColor: 'text-[#6966C8]',
        border: 'border-[#DBE1FF]',
        icon: <Scan className="w-5 h-5" strokeWidth={1.9} />,
      };
    }

    if (titleLower.includes('prescription') || typeLower.includes('prescription')) {
      return {
        bg: 'bg-[#FFF0F7]',
        iconColor: 'text-[#E65A9D]',
        border: 'border-[#FDDDEE]',
        icon: <Pill className="w-5 h-5" strokeWidth={1.9} />,
      };
    }

    if (titleLower.includes('blood') || typeLower.includes('blood') || titleLower.includes('cbc')) {
      return {
        bg: 'bg-[#EAF9F2]',
        iconColor: 'text-[#42B987]',
        border: 'border-[#D1F5E2]',
        icon: <Droplets className="w-5 h-5" strokeWidth={1.9} />,
      };
    }

    // Default document styling
    return {
      bg: 'bg-[#F0EFFB]',
      iconColor: 'text-[#514DA6]',
      border: 'border-[#E4E4F1]',
      icon: <FileText className="w-5 h-5" strokeWidth={1.9} />,
    };
  };

  return (
    <section
      id="recent-documents-section"
      aria-label="Recent Documents Library"
      className="relative w-full overflow-hidden pt-1"
    >
      {/* Subtle ambient lavender glow behind the library grid */}
      <div
        className="absolute top-0 right-1/4 w-80 h-36 rounded-full bg-radial from-[#ECEBFA]/30 to-transparent blur-3xl pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTION HEADER & PRIMARY ACTIONS */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5 sm:mb-6 px-[7px]">
        {/* Title + Subtitle with vertical gradient accent matching Medical History */}
        <div className="flex items-start gap-3">
          <div
            className="w-1.5 h-11 rounded-full bg-gradient-to-b from-[#716BE0] via-[#514DA6] to-[#423E8E] flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-[22px] sm:text-[24px] font-bold text-[#292A46] tracking-tight leading-snug">
              Recent Documents
            </h3>
            <p className="text-[13.5px] sm:text-[14px] text-[#8587A7] font-normal mt-0.5">
              Diagnostic tests, imaging, and prescriptions
            </p>
          </div>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Upload / Scan Action Button */}
          <button
            id="recent-documents-upload-btn"
            onClick={onUploadClick}
            type="button"
            className="group/upload flex items-center gap-2 px-3.5 py-2 rounded-[16px] text-[12.5px] sm:text-[13px] font-semibold text-[#514DA6] bg-[#F1F0FC] hover:bg-[#E9E7FA] border border-[#514DA6]/10 shadow-2xs hover:shadow-[0_4px_16px_rgba(81,77,166,0.12)] hover:-translate-y-[1.5px] active:translate-y-0 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#514DA6]/30 select-none"
            aria-label="Upload or scan a new medical report"
          >
            <Upload className="w-3.5 h-3.5 text-[#514DA6] group-hover/upload:scale-110 transition-transform duration-200" strokeWidth={2} />
            <span>Upload / Scan</span>
          </button>

          {/* View All Secondary Action Link */}
          <button
            id="recent-documents-view-all-btn"
            onClick={onViewAllClick}
            type="button"
            className="group/viewall flex items-center gap-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#514DA6] hover:text-[#37338A] px-2 py-1.5 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#514DA6]/30 rounded-lg"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#514DA6] group-hover/viewall:translate-x-1 transition-transform duration-200" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* RESPONSIVE FOUR-CARD DOCUMENT GRID */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
        {documents.slice(0, 4).map((doc) => {
          const meta = getDocumentTypeMeta(doc);

          return (
            <div
              key={doc.id}
              id={`document-card-${doc.id}`}
              onClick={() => onViewReport(doc)}
              className="group relative bg-white rounded-[20px] border border-[#E5E5F2] hover:border-[#514DA6]/25 p-4 sm:p-4.5 flex flex-col justify-between cursor-pointer select-none shadow-[0_6px_22px_rgba(70,65,150,0.05)] hover:shadow-[0_12px_28px_rgba(70,65,150,0.10)] hover:-translate-y-[2.5px] active:translate-y-0 transition-all duration-200 ease-out min-h-[176px]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewReport(doc);
                }
              }}
              aria-label={`View details for ${doc.title}, dated ${doc.date}, size ${doc.fileSize || 'PDF'}`}
            >
              {/* Top Row: Color-coded Document Icon + File Size */}
              <div>
                <div className="flex items-center justify-between">
                  {/* 44x44px Document icon container with subtle border & highlight */}
                  <div
                    className={`w-[44px] h-[44px] rounded-[14px] ${meta.bg} ${meta.iconColor} border ${meta.border} flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]`}
                  >
                    {meta.icon}
                  </div>

                  {/* Secondary File Size Badge */}
                  <span className="text-[12px] font-normal text-[#8B8DAA] tracking-tight">
                    {doc.fileSize || 'PDF'}
                  </span>
                </div>

                {/* Middle: Document Title & Date */}
                <h4 className="font-bold text-[15.5px] sm:text-[16px] text-[#292A46] group-hover:text-[#514DA6] line-clamp-1 transition-colors mt-3.5 leading-snug tracking-tight">
                  {doc.title}
                </h4>
                <p className="text-[12.5px] sm:text-[13px] text-[#898BAA] mt-1 font-normal">
                  {doc.date}
                </p>
              </div>

              {/* Bottom Action Area: Subtle Divider + "View details" & interactive arrow */}
              <div className="mt-4 pt-3 border-t border-[#E9E8F2] flex items-center justify-between text-[13px] font-semibold text-[#514DA6] transition-colors">
                <span className="group-hover:text-[#3A3686] transition-colors">
                  View details
                </span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:bg-[#F2F1FB] transition-colors">
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#514DA6] group-hover:translate-x-1 transition-transform duration-200"
                    strokeWidth={2.2}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
