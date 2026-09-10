import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewAppointment: (apt: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewAppointment,
}) => {
  return (
    <div
      id="upcoming-appointment-compact-card"
      onClick={() => onViewAppointment(appointment)}
      className="p-4 bg-white rounded-2xl border border-[#E5E5F0] hover:border-[#817EC1]/50 hover:shadow-xs transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F0F1FA] text-[#4C499E] flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5" strokeWidth={1.8} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#4C499E]">
              Upcoming Appointment
            </span>
            <span className="text-[10px] font-semibold bg-[#F0F1FA] text-[#4C499E] px-2 py-0.5 rounded-full border border-[#E2E2EE]">
              {appointment.department}
            </span>
          </div>
          <div className="font-bold text-sm text-[#2E2C3A] mt-0.5">
            {appointment.doctorName}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8B8BA5] mt-0.5">
            <span className="flex items-center gap-1 font-medium text-[#2E2C3A]">
              <Clock className="w-3.5 h-3.5 text-[#4C499E]" strokeWidth={1.8} />
              {appointment.time} • {appointment.date}
            </span>
            <span>•</span>
            <span>{appointment.room}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-[#4C499E] self-end sm:self-center pr-2 group-hover:translate-x-0.5 transition-transform">
        <span>View Appointment</span>
        <ArrowRight className="w-4 h-4" strokeWidth={2} />
      </div>
    </div>
  );
};
