import { motion } from "framer-motion";
import { Globe, MessageCircle, Clock, Heart } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/375299746157";
const FACEBOOK_LINK = "https://www.facebook.com/profile.php?id=61588211300827";

export default function About() {
  const languages = ["English", "Hindi", "Chinese", "Spanish", "French", "Italian", "German"];

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left — Avatar card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-8 border border-violet-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  K
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Kystameelion A.</h3>
                  <p className="text-violet-600 font-medium text-sm">HTML & CSS Developer</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Average response time: 1 hour
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-violet-400" />
                  On platform since March 2026
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-slate-700">Languages:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-full bg-white border border-violet-100 text-xs font-medium text-slate-600"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6 flex gap-3">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={FACEBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-violet-600 uppercase tracking-wider">About the developer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
                Attention to every detail
              </h2>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed">
              Professional front-end developer specializing in HTML, CSS, and XHTML. 
              I create clean, responsive, and high-performance websites with strong attention to detail, 
              ensuring cross-browser compatibility and smooth user experience across all devices.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <MessageCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Tip:</span> Please contact me before placing an order — 
                let's discuss your project and find the best solution for you 💛
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
