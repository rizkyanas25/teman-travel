"use client";
import { useTranslations } from "next-intl";
import { FiCheck, FiX } from "react-icons/fi";
interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PackageDetailsModal({ open, onClose }: Props) {
  const t = useTranslations("packages");
  const tc = useTranslations("common");

  if (!open) return null;

  const includes = [
    t("sharedIncludes.hotel"),
    t("sharedIncludes.hotelArea"),
    t("sharedIncludes.sunsetDinner"),
    t("sharedIncludes.privateTour"),
    t("sharedIncludes.baliNusaPenida"),
    t("sharedIncludes.entranceFee"),
    t("sharedIncludes.pickup"),
    t("sharedIncludes.driverGuide"),
    t("sharedIncludes.cinematicVideo"),
    t("sharedIncludes.water"),
  ];

  const excludes = [
    t("sharedExcludes.flights"),
    t("sharedExcludes.shopping"),
    t("sharedExcludes.activities"),
    t("sharedExcludes.kecak"),
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-dark-800 rounded-2xl border border-white/10 shadow-2xl animate-[fadeInUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
            {t("infoTitle")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Included */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-green-400" />
              </span>
              {tc("included")}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {includes.map((item) => (
                <div key={item} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5">
                  <FiCheck className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <FiX className="w-4 h-4 text-red-400" />
              </span>
              {tc("excluded")}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {excludes.map((item) => (
                <div key={item} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5">
                  <FiX className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="p-4 bg-gold-400/5 rounded-xl border border-gold-400/20">
            <p className="text-xs text-gold-400/90 font-medium mb-2">ℹ️ {t("notesTitle")}</p>
            <p className="text-xs text-white/50">• {tc("childNote")}</p>
            <p className="text-xs text-white/50 mt-1">• {tc("toddlerNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
