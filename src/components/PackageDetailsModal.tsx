"use client";
import { useTranslations, useMessages } from "next-intl";
import { FiCheck, FiX } from "react-icons/fi";
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
            {t("packageIncludes", { name: pkg.title })}
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
            <div className="space-y-3">
              {includes.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                  <FiCheck className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-white mb-0.5">{item.title}</h5>
                    <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                  </div>
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
            <div className="space-y-3">
              {excludes.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                  <FiX className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-white mb-0.5">{item.title}</h5>
                    <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                  </div>
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
