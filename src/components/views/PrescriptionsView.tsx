import React from 'react';
import { Pill, Clock, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Prescription } from '../../types';

interface PrescriptionsViewProps {
  prescriptions: Prescription[];
  onStartConsultation: () => void;
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  prescriptions,
  onStartConsultation,
}) => {
  return (
    <div id="prescriptions-full-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-mk-text-primary tracking-tight">
            Active Prescriptions & Dosages
          </h2>
          <p className="text-xs sm:text-sm text-mk-text-secondary">
            Current doctor-prescribed medications, schedules, and refill statuses.
          </p>
        </div>

        <button
          onClick={onStartConsultation}
          className="px-4 py-2 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          Request Prescription Refill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="p-5 bg-white rounded-2xl border border-mk-border shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-mk-text-primary">{rx.medicationName}</h4>
                  <div className="text-xs text-mk-text-secondary">
                    Dosage: <strong className="text-mk-text-primary">{rx.dosage}</strong>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  rx.status === 'Active'
                    ? 'bg-[#E8F8F2] text-[#2EA07B]'
                    : 'bg-mk-surface-secondary text-mk-text-muted'
                }`}
              >
                {rx.status}
              </span>
            </div>

            <div className="bg-mk-surface-secondary p-3.5 rounded-xl border border-mk-border-light text-xs space-y-2">
              <div className="flex items-center gap-2 text-mk-text-primary">
                <Clock className="w-3.5 h-3.5 text-mk-primary" />
                <span className="font-medium">{rx.frequency}</span>
              </div>
              <p className="text-mk-text-secondary">{rx.instructions}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-mk-text-muted pt-1 border-t border-mk-border-light">
              <span>Prescribed by: {rx.prescribedBy}</span>
              <span>{rx.refillsRemaining} refills left</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
