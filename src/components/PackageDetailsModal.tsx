"use client";
import { useTranslations, useMessages } from "next-intl";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";
interface Props {
  packageIndex: number | null;
  onClose: () => void;
}

export default function PackageDetailsModal({ packageIndex, onClose }: Props) {
  const t = useTranslations("packages");
  const tc = useTranslations("common");
  const messages = useMessages();

  if (packageIndex === null) return null;

  const packagesMessages = messages.packages as { items: any[] };
  const pkg = packagesMessages.items[packageIndex];

  if (!pkg) return null;

  const includes = pkg.includes as { title: string; description: string }[];
  const excludes = pkg.excludes as { title: string; description: string }[];
  const agentTip = pkg.agentTip as string | undefined;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center lg:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full h-screen h-[100dvh] lg:h-auto lg:max-h-[85vh] lg:max-w-2xl flex flex-col bg-dark-800 lg:rounded-2xl lg:border border-white/10 shadow-2xl animate-[fadeInUp_0.3s_ease] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at top */}
        <div className="bg-dark-800 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white">
            {t("packageIncludes", { name: pkg.title })}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Global Agent Tip Box - STA-B.1 */}
          {agentTip && (
            <div className="p-4 bg-white/5 rounded-xl border border-gold-400/20 flex flex-col gap-2.5 animate-[fadeInUp_0.2s_ease]">
              {/* Baris Judul & Ikon - Sejajar Sempurna */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-400/10 flex items-center justify-center shrink-0">
                  <FiInfo className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <h4 className="text-sm font-semibold text-gold-400">
                  {t("agentInsightTitle")}
                </h4>
              </div>
              
              {/* Baris Deskripsi - Indentasi Lurus Sejajar Teks Judul */}
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed italic pl-9">
                "{agentTip}"
              </p>
            </div>
          )}

          {/* Included Section */}
          <div>
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">
              {tc("included")}
            </h4>
            <div className="space-y-3">
              {pkg.includes.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck className="w-3 text-green-500" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white/90 leading-tight">{item.title}</h5>
                    <p className="text-xs text-white/50 leading-relaxed mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Included Section */}
          <div>
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">
              {tc("excluded")}
            </h4>
            <div className="space-y-3">
              {pkg.excludes.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <FiX className="w-3 text-red-500" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white/90 leading-tight">{item.title}</h5>
                    <p className="text-xs text-white/50 leading-relaxed mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="p-4 bg-gold-400/5 rounded-xl border border-gold-400/20">
            <p className="text-xs text-gold-400/90 font-medium mb-2">{t("notesTitle")}</p>
            <p className="text-xs text-white/50">• {tc("childNote")}</p>
            <p className="text-xs text-white/50 mt-1">• {tc("toddlerNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
