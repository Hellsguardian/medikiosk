import React from 'react';
import { Calendar, Clock, MapPin, Building, Plus, ArrowRight } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onBookNew: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onSelectAppointment,
  onBookNew,
}) => {
  return (
    <div id="appointments-full-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-mk-text-primary tracking-tight">
            Consultations & OPD Visits
          </h2>
          <p className="text-xs sm:text-sm text-mk-text-secondary">
            Hospital OPD appointments and follow-up schedules with attending doctors.
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            onClick={() => onSelectAppointment(apt)}
            className="p-5 bg-white rounded-2xl border border-mk-border hover:border-mk-primary-light hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-mk-surface-secondary text-mk-primary-dark flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-mk-text-primary">{apt.doctorName}</h4>
                  <span className="text-[10px] font-bold bg-[#E8F8F2] text-[#2EA07B] px-2.5 py-0.5 rounded-full">
                    {apt.status}
                  </span>
                </div>
                <div className="text-xs text-mk-text-secondary mt-0.5">{apt.department}</div>
                <div className="flex items-center gap-3 text-[11px] text-mk-text-muted mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-mk-primary" /> {apt.time}, {apt.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-mk-primary" /> {apt.room}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button className="px-4 py-2 rounded-xl bg-mk-surface-secondary text-mk-primary-dark text-xs font-semibold hover:bg-mk-lavender-very-pale transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
