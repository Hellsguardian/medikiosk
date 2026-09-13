import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  QrCode,
  Phone,
  AlertOctagon,
  HeartPulse,
  Share2,
  Copy,
  Check,
  LogOut,
} from 'lucide-react';
import { PatientProfile } from '../types';

interface ProfileModalProps {
  patient: PatientProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  patient,
  isOpen,
  onClose,
  onLogout,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyAbha = () => {
    navigator.clipboard?.writeText(patient.fullAbha);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="patient-profile-modal"
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-mk-surface-tint border-b border-mk-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-mk-lavender-pale text-mk-primary-dark font-bold text-base flex items-center justify-center border-2 border-white shadow-2xs">
              {patient.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-mk-text-primary">{patient.name}</h3>
                <span className="text-[10px] font-bold bg-[#EAF5EF] text-[#3D9970] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#CEEAD9]">
                  <ShieldCheck className="w-3 h-3" /> Verified ABHA
                </span>
              </div>
              <p className="text-xs text-mk-text-secondary mt-0.5">
                {patient.gender} • {patient.age} years • Blood Group: {patient.bloodGroup}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-mk-text-muted hover:text-mk-text-primary flex items-center justify-center border border-mk-border transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-mk-text-primary">
          {/* Digital Health ID Card */}
          <div className="p-5 rounded-2xl bg-mk-primary text-white shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-mk-lavender-light">
                  Ayushman Bharat Digital Health Card
                </span>
                <div className="text-lg font-bold mt-1 text-white tracking-wide">
                  {patient.name}
                </div>
                <div className="text-xs text-mk-lavender-light mt-0.5 font-mono">
                  {patient.fullAbha}
                </div>
              </div>

              {/* QR Code representation */}
              <div className="w-16 h-16 bg-white p-1.5 rounded-xl shadow-xs flex items-center justify-center text-mk-primary">
                <QrCode className="w-full h-full" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80">
              <span>Scan at any MediKiosk Terminal</span>
              <button
                type="button"
                onClick={copyAbha}
                className="flex items-center gap-1 text-white hover:underline text-[10px] font-semibold bg-white/15 px-2.5 py-1 rounded-lg"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy ABHA'}</span>
              </button>
            </div>
          </div>

          {/* Emergency Contact & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-mk-surface-secondary border border-mk-border-light">
              <div className="text-[10px] uppercase font-bold text-mk-text-muted mb-1">
                Registered Contact
              </div>
              <div className="font-bold text-mk-text-primary">{patient.phone}</div>
              <div className="text-[11px] text-mk-text-secondary mt-0.5">Primary OTP verification</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-mk-surface-secondary border border-mk-border-light">
              <div className="text-[10px] uppercase font-bold text-mk-text-muted mb-1">
                Emergency Contact
              </div>
              <div className="font-bold text-mk-text-primary">
                {patient.emergencyContact.name} ({patient.emergencyContact.relation})
              </div>
              <div className="text-[11px] text-mk-text-secondary mt-0.5">
                {patient.emergencyContact.phone}
              </div>
            </div>
          </div>

          {/* Known Allergies */}
          <div className="p-4 rounded-2xl bg-[#FFF9F9] border border-[#FCDCDC]">
            <div className="flex items-center gap-1.5 text-[#E03A2F] font-bold text-xs uppercase mb-2">
              <AlertOctagon className="w-4 h-4" />
              <span>Known Drug Allergies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((alg, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#FFEAE8] text-[#D83226] font-semibold text-xs border border-[#F7C6C2]"
                >
                  {alg}
                </span>
              ))}
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="p-4 rounded-2xl bg-mk-surface-secondary border border-mk-border-light">
            <div className="flex items-center gap-1.5 text-mk-primary-dark font-bold text-xs uppercase mb-2">
              <HeartPulse className="w-4 h-4" />
              <span>Chronic Medical History</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-mk-lavender-pale text-mk-primary-dark font-medium text-xs border border-mk-border-light"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-mk-surface-secondary border-t border-mk-border flex items-center justify-between">
          {onLogout ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#D93856] hover:text-[#B0203B] hover:bg-[#FDECEF] px-3 py-1.5 rounded-xl border border-[#F5CCD3] transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          ) : (
            <div className="text-xs text-mk-text-muted">
              Profile synchronized with ABDM
            </div>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
