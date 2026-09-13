import React from 'react';
import { AlertOctagon, Phone, ShieldAlert, ArrowRight } from 'lucide-react';

interface SafetyAlertCardProps {
  reason: string;
  onAcknowledgeEmergency: () => void;
  onContinueCarefully: () => void;
}

export const SafetyAlertCard: React.FC<SafetyAlertCardProps> = ({
  reason,
  onAcknowledgeEmergency,
  onContinueCarefully,
}) => {
  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FFF2F4] via-[#FFE8EC] to-[#FFDFE5] border-2 border-[#E85A74] shadow-lg shadow-[#E85A74]/15 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E83C5A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A81A34] bg-[#FFD1D9] px-2.5 py-0.5 rounded-full border border-[#FCA5B5]">
                Urgent Medical Notice
              </span>
            </div>
            <h4 className="text-base font-bold text-[#800F25] mt-1">
              Safety Triage: In-Person Medical Attention Advised
            </h4>
          </div>
        </div>

        {/* Reason Explanation */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#FDC2CC] text-xs sm:text-sm text-[#731225] leading-relaxed space-y-2">
          <p>
            <strong className="font-bold text-[#8F0D27]">Clinical Flag: </strong>
            {reason}
          </p>
          <p className="text-xs text-[#96253A]">
            MediKiosk is an interactive intake assistant and <strong>does not provide medical diagnoses or emergency care</strong>. Severe or rapidly worsening symptoms warrant urgent clinical evaluation by a physician.
          </p>
        </div>

        {/* Emergency Contacts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href="tel:112"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E83C5A] hover:bg-[#C92240] text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call National Emergency (112)</span>
          </a>
          <a
            href="tel:108"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F0D27] hover:bg-[#70061B] text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Ambulance (108)</span>
          </a>
        </div>

        {/* User Choice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F9C3CD]">
          <p className="text-[11px] text-[#8A2437]">
            If you are safe and wish to continue documenting symptoms for OPD:
          </p>
          <button
            type="button"
            onClick={onContinueCarefully}
            className="text-xs font-bold text-[#691829] hover:text-[#420B16] bg-white hover:bg-[#FFF0F3] px-3.5 py-2 rounded-xl border border-[#FCA5B5] transition-all flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>I Understand, Continue Intake</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
