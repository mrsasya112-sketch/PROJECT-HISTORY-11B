import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";

const FIVERR_LINK = "https://www.fiverr.com/ascheleo/create-html-css-website-and-deliver-source-files";

interface FloatingBannerProps {
  onClose: () => void;
}

export default function FloatingBanner({ onClose }: FloatingBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-violet-100 p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="pr-6">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              💡 Need a beautiful website?
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              I'll help you create a modern responsive website from €73. Contact me — first consultation is free!
            </p>
            <a
              href={FIVERR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
            >
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
