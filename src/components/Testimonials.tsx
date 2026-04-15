import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Kystameelion did exactly what I wanted! The website looks amazing on all devices. Clean code, everything works perfectly. Will definitely come back!",
    name: "Alex M.",
    role: "Business Owner",
    rating: 5,
  },
  {
    text: "Very fast and quality work! Communication was pleasant and clear. My design was perfectly converted to code. Highly recommend!",
    name: "Sarah K.",
    role: "Designer",
    rating: 5,
  },
  {
    text: "A true professional. Took all my wishes into account and even suggested improvements I hadn't thought of. The result exceeded expectations!",
    name: "David L.",
    role: "Entrepreneur",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-violet-50/50 to-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            What clients say 💛
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-violet-200 mb-4" />
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
