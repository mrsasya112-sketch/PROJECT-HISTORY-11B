import { motion } from "framer-motion";

const reasons = [
  {
    title: "Responsive Design",
    desc: "Your website will look great on phones, tablets, and desktops",
    emoji: "📱",
  },
  {
    title: "Clean Code",
    desc: "Readable, organized code that's easy to maintain and scale",
    emoji: "✨",
  },
  {
    title: "Fast Delivery",
    desc: "Quick turnaround without compromising quality — you'll get your site on time",
    emoji: "🚀",
  },
  {
    title: "Great Communication",
    desc: "Always available, attentive to your needs and open to dialogue",
    emoji: "💬",
  },
];

export default function WhyMe() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-violet-50/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Advantages</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            Why choose me?
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">{r.emoji}</div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{r.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
