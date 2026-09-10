import React, { useState } from 'react';
import {
  X,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { MedicalReport } from '../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: MedicalReport) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [docType, setDocType] = useState<MedicalReport['type']>('Liver Function Test');
  const [docTitle, setDocTitle] = useState('');
  const [facility, setFacility] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      // Trigger simulated OCR extraction
      triggerOcrExtraction();
    }
  };

  const triggerOcrExtraction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOcrSuccess(true);
      if (!docTitle) setDocTitle('Liver Function Panel (Recent)');
      if (!facility) setFacility('City Healthcare Diagnostics Lab');
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: MedicalReport = {
      id: `doc-${Date.now()}`,
      title: docTitle || `${docType} Report`,
      type: docType,
      date: '09 Sep 2026',
      facility: facility || 'Verified Healthcare Clinic',
      status: 'Normal',
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
      keyFindings: 'Document scanned & digitized via MediKiosk OCR. Ready for clinical review.',
    };
    onDocumentAdded(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="upload-scan-modal"
        className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-mk-surface-tint border-b border-mk-border-light flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-mk-primary">
              Add to Medical Record
            </span>
            <h3 className="text-xl font-bold text-mk-text-primary mt-0.5">
              Upload or Scan Medical Document
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-mk-text-muted hover:text-mk-text-primary flex items-center justify-center border border-mk-border transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Document Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-2">
              Document Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Liver Function Test',
                'Blood Test',
                'Ultrasound',
                'Prescription',
                'Discharge Summary',
                'CT Scan',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocType(type as any)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                    docType === type
                      ? 'bg-mk-primary text-white border-mk-primary font-bold shadow-xs'
                      : 'bg-white text-mk-text-primary border-mk-border hover:bg-mk-surface-secondary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Upload / Scan Drag & Drop Box */}
          <div className="relative border-2 border-dashed border-mk-border hover:border-mk-primary rounded-2xl p-6 text-center bg-mk-surface-secondary transition group">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            <div className="flex flex-col items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-mk-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin text-mk-primary" />
                ) : ocrSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-[#2EA07B]" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              {isProcessing ? (
                <div className="text-xs font-bold text-mk-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scanning & Extracting Clinical Data (OCR)...</span>
                </div>
              ) : ocrSuccess ? (
                <div>
                  <span className="text-xs font-bold text-[#2EA07B] block">
                    Document Scanned & Parameters Extracted!
                  </span>
                  <span className="text-[11px] text-mk-text-secondary">
                    {selectedFile?.name || 'Medical_Record.pdf'}
                  </span>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-mk-text-primary">
                    Click to select file or drag & drop here
                  </div>
                  <div className="text-[11px] text-mk-text-muted mt-0.5">
                    Supports camera photos, PDF, PNG, JPG (up to 25 MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title & Facility Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Ultrasound Abdomen & Pelvis"
                className="w-full px-3.5 py-2 rounded-xl border border-mk-border text-xs text-mk-text-primary placeholder-mk-text-muted outline-none focus:border-mk-primary transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-1">
                Hospital or Diagnostic Lab Name
              </label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="e.g. Apollo Health City Diagnostic Lab"
                className="w-full px-3.5 py-2 rounded-xl border border-mk-border text-xs text-mk-text-primary placeholder-mk-text-muted outline-none focus:border-mk-primary transition"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-mk-text-secondary hover:bg-mk-surface-secondary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-bold shadow-xs transition"
            >
              Save to Health Records
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
