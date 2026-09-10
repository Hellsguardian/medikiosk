import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Building,
  CheckCircle2,
  CalendarPlus,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  onClose,
}) => {
  const [confirmedAdded, setConfirmedAdded] = useState(false);

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="appointment-detail-modal"
        className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-mk-surface-tint border-b border-mk-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-mk-lavender-pale text-mk-primary-dark flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-mk-primary">
                Consultation Appointment
              </span>
              <h3 className="text-xl font-bold text-mk-text-primary mt-0.5">
                {appointment.department}
              </h3>
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
        <div className="p-6 space-y-4 text-xs text-mk-text-primary">
          {/* Doctor Info Card */}
          <div className="p-4 rounded-2xl bg-mk-surface-secondary border border-mk-border-light flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-mk-text-primary">{appointment.doctorName}</div>
              <div className="text-mk-text-secondary mt-0.5">Consultant Gastroenterologist & Hepatologist</div>
              <div className="text-[11px] text-mk-text-muted mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-mk-primary" />
                <span>{appointment.hospital}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#E8F8F2] text-[#2EA07B] font-bold text-[11px]">
                {appointment.status}
              </span>
              <div className="text-[10px] text-mk-text-muted mt-1">Token #14</div>
            </div>
          </div>

          {/* Time & Location Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-mk-border">
              <div className="flex items-center gap-1.5 text-mk-primary font-bold text-[10px] uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Date & Time</span>
              </div>
              <div className="font-bold text-sm text-mk-text-primary mt-1">{appointment.time}</div>
              <div className="text-mk-text-secondary text-[11px]">{appointment.date}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-mk-border">
              <div className="flex items-center gap-1.5 text-mk-primary font-bold text-[10px] uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </div>
              <div className="font-bold text-sm text-mk-text-primary mt-1">{appointment.room}</div>
              <div className="text-mk-text-secondary text-[11px]">OPD Registration Desk B</div>
            </div>
          </div>

          {/* Preparation Advice */}
          <div className="p-3.5 rounded-xl bg-[#FFFDF5] border border-[#F6E9C8] flex items-start gap-2.5 text-[#52411C]">
            <AlertCircle className="w-4 h-4 text-[#A87212] flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold">Instructions for Appointment:</div>
              <p className="text-[11px] leading-relaxed">
                Please bring your latest LFT report (05 Sep 2026). Fasting for 8 hours is advised in case repeat liver enzyme panel or ultrasound verification is required.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-mk-surface-secondary border-t border-mk-border-light flex items-center justify-between">
          <button
            onClick={() => {
              setConfirmedAdded(true);
              setTimeout(() => setConfirmedAdded(false), 2500);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-mk-primary hover:underline"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>{confirmedAdded ? 'Added to Calendar!' : 'Add to Calendar'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
