import React, { useState } from 'react';
import { FileText, Upload, Search, Download, Eye, Filter } from 'lucide-react';
import { MedicalReport } from '../../types';

interface DocumentsViewProps {
  documents: MedicalReport[];
  onSelectDocument: (doc: MedicalReport) => void;
  onOpenUpload: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [query, setQuery] = useState('');

  const docTypes = ['All', 'Liver Function Test', 'Ultrasound', 'Blood Test', 'Prescription', 'CT Scan'];

  const filtered = documents.filter((doc) => {
    const matchesType = filterType === 'All' || doc.type === filterType;
    const matchesSearch =
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.facility.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div id="documents-full-view" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-mk-text-primary tracking-tight">
            Medical Documents & Reports
          </h2>
          <p className="text-xs sm:text-sm text-mk-text-secondary">
            Digitized laboratory investigations, radiology scans, and prescriptions.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold shadow-md transition self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload / Scan New</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-mk-border">
        <div className="flex items-center gap-2 flex-wrap">
          {docTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filterType === type
                  ? 'bg-mk-primary text-white shadow-2xs'
                  : 'bg-mk-surface-secondary text-mk-text-secondary hover:bg-mk-lavender-very-pale'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-mk-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter documents..."
            className="bg-mk-surface-secondary text-xs text-mk-text-primary placeholder-mk-text-muted pl-8 pr-3 py-1.5 rounded-full border border-transparent focus:border-mk-primary focus:outline-none w-full sm:w-48 transition"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className="p-4 bg-white rounded-2xl border border-mk-border hover:border-mk-primary-light hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'Normal'
                      ? 'bg-[#E8F8F2] text-[#2EA07B]'
                      : doc.status === 'Critical'
                      ? 'bg-[#FFEAE8] text-[#E03A2F]'
                      : 'bg-[#FFF6E5] text-[#C27D00]'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <h4 className="font-bold text-sm text-mk-text-primary line-clamp-1">{doc.title}</h4>
              <p className="text-xs text-mk-text-secondary mt-0.5">{doc.facility}</p>
              <p className="text-[11px] text-mk-text-muted mt-0.5">Date: {doc.date}</p>

              {doc.keyFindings && (
                <p className="text-[11px] text-mk-text-secondary mt-2.5 bg-mk-surface-secondary p-2 rounded-xl border border-mk-border-light line-clamp-2">
                  {doc.keyFindings}
                </p>
              )}
            </div>

            <div className="mt-4 pt-2.5 border-t border-mk-border-light flex items-center justify-between text-xs text-mk-primary-dark font-semibold">
              <span>View & Extract</span>
              <span className="text-[11px] text-mk-text-muted font-normal">{doc.fileSize || 'PDF'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
