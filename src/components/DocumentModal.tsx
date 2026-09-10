import React, { useState } from 'react';
import { X, FileText, Download, Share2, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { MedicalReport } from '../types';

interface DocumentModalProps {
  report: MedicalReport | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ report, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!report) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="document-viewer-modal"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-mk-surface-tint border-b border-mk-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-mk-lavender-pale text-mk-primary-dark flex items-center justify-center">
              <FileText className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-mk-text-primary">{report.title}</h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    report.status === 'Normal'
                      ? 'bg-[#EDF5F2] text-[#44836D] border-[#D4E8DF]'
                      : report.status === 'Critical'
                      ? 'bg-[#FDF2F0] text-[#D45547] border-[#F8D5D1]'
                      : 'bg-[#FEF7EC] text-[#B87820] border-[#F6E3BE]'
                  }`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-mk-text-secondary mt-0.5">
                {report.facility} • {report.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-mk-text-muted hover:text-mk-text-primary flex items-center justify-center border border-mk-border transition"
          >
            <X className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Key Findings banner */}
          {report.keyFindings && (
            <div className="p-4 rounded-2xl bg-mk-surface-secondary border border-mk-border-light">
              <div className="text-xs font-bold uppercase tracking-wider text-mk-primary mb-1">
                Clinical Impression & Key Findings
              </div>
              <p className="text-sm font-medium text-mk-text-primary">{report.keyFindings}</p>
            </div>
          )}

          {/* Test parameters table if available */}
          {report.values && report.values.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-mk-text-secondary mb-2.5">
                Diagnostic Parameters & Laboratory Values
              </h4>
              <div className="border border-mk-border-light rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-mk-surface-secondary text-mk-text-secondary uppercase font-semibold text-[10px] border-b border-mk-border-light">
                    <tr>
                      <th className="p-3 pl-4">Parameter</th>
                      <th className="p-3">Observed Value</th>
                      <th className="p-3">Reference Range</th>
                      <th className="p-3 pr-4 text-right">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mk-border-light text-mk-text-primary">
                    {report.values.map((v, i) => (
                      <tr key={i} className={v.isAbnormal ? 'bg-[#FFF9F9]' : 'hover:bg-mk-surface-secondary'}>
                        <td className="p-3 pl-4 font-medium">{v.parameter}</td>
                        <td className="p-3 font-bold">
                          {v.value} <span className="text-[11px] font-normal text-mk-text-muted">{v.unit}</span>
                        </td>
                        <td className="p-3 text-mk-text-secondary">
                          {v.normalRange} {v.unit}
                        </td>
                        <td className="p-3 pr-4 text-right">
                          {v.isAbnormal ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E03A2F] bg-[#FFEAEA] px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" /> High
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2EA07B] bg-[#E8F8F2] px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> In Range
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Document metadata info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-mk-surface-secondary border border-mk-border-light text-xs">
            <div>
              <span className="text-[10px] text-mk-text-muted uppercase font-bold block">Document Type</span>
              <span className="font-semibold text-mk-text-primary">{report.type}</span>
            </div>
            <div>
              <span className="text-[10px] text-mk-text-muted uppercase font-bold block">Verification</span>
              <span className="font-semibold text-[#2EA07B] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Signed
              </span>
            </div>
            <div>
              <span className="text-[10px] text-mk-text-muted uppercase font-bold block">Security</span>
              <span className="font-semibold text-mk-primary-dark">ABHA Linked</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-mk-surface-secondary border-t border-mk-border-light flex items-center justify-between">
          <div className="text-xs text-mk-text-muted">
            {downloadSuccess ? (
              <span className="text-[#44836D] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.8} /> Downloaded successfully
              </span>
            ) : (
              <span>File size: {report.fileSize || '1.4 MB'} • PDF</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-mk-border text-xs font-semibold text-mk-primary-dark hover:bg-mk-lavender-very-pale transition"
            >
              <Printer className="w-4 h-4" strokeWidth={1.8} />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold transition shadow-xs"
            >
              <Download className="w-4 h-4" strokeWidth={1.8} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
