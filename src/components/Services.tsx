import { motion } from "framer-motion";
import { Layout, Paintbrush, Code, Zap, Share2, BarChart3, Map, Image, FileText } from "lucide-react";

const services = [
  {
    icon: Layout,
    title: "Landing Pages",
    desc: "Bright, stylish one-page websites that captivate from the first glance",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Paintbrush,
    title: "Business Websites",
    desc: "Simple and elegant multi-page websites for your business",
    color: "from-sky-500 to-cyan-500",
  },
  {
    icon: Code,
    title: "Design → HTML/CSS",
    desc: "I'll turn your mockup into live, working code with pixel-perfect accuracy",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Fast & Clean Code",
    desc: "Optimized code that loads fast and is easy to maintain",
    color: "from-amber-500 to-orange-500",
  },
];

const features = [
  { icon: Share2, name: "Social Media" },
  { icon: BarChart3, name: "Analytics" },
  { icon: FileText, name: "Forms" },
  { icon: Map, name: "Maps" },
  { icon: Image, name: "Gallery" },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 bg-gradient-to-b from-violet-50/50 to-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            How can I help you?
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Have an idea or a ready design? I'll turn it into a working website with love for details ✨
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Features pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-slate-400 mb-4">Additional features:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-sm text-slate-600 hover:border-violet-200 transition-colors"
              >
                <f.icon className="w-4 h-4 text-violet-400" />
                {f.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
