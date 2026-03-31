import { motion } from "framer-motion";
import { Check, Star, Sparkles } from "lucide-react";

const FIVERR_LINK = "https://www.fiverr.com/ascheleo/create-html-css-website-and-deliver-source-files";

const plans = [
  {
    name: "Basic",
    subtitle: "Basic HTML Page",
    price: "€73",
    delivery: "2 days",
    revisions: "1 revision",
    pages: "1 page",
    features: [
      "1 responsive HTML/CSS page",
      "Clean and structured code",
      "Functional website",
      "Social media icons",
    ],
    popular: false,
    color: "border-slate-200",
  },
  {
    name: "Standard",
    subtitle: "Standard Website",
    price: "€82",
    delivery: "3 days",
    revisions: "3 revisions",
    pages: "up to 3 pages",
    features: [
      "Up to 3 responsive HTML/CSS pages",
      "Clean and structured code",
      "Functional website",
      "Social media icons",
      "More revisions for your comfort",
    ],
    popular: true,
    color: "border-violet-300",
  },
  {
    name: "Premium",
    subtitle: "Full Website",
    price: "€91",
    delivery: "5 days",
    revisions: "3 revisions",
    pages: "up to 5 pages",
    features: [
      "Up to 5 responsive HTML/CSS pages",
      "Clean and structured code",
      "Functional website",
      "Social media icons",
      "Complete multi-page website",
    ],
    popular: false,
    color: "border-slate-200",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            Fair prices, excellent results
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Choose the right package — each includes responsive design and clean code 💜
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl bg-white border-2 ${plan.color} hover:shadow-lg hover:shadow-violet-50 transition-all duration-300 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-lg">
                    <Star className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                <p className="text-sm text-slate-400">{plan.subtitle}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
              </div>

              <div className="flex gap-4 mb-6 text-sm text-slate-500">
                <span>📦 {plan.delivery}</span>
                <span>🔄 {plan.revisions}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={FIVERR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300"
                    : "bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Order Now
                </span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Soft note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-400 mt-8"
        >
          ✨ Contact me before ordering — I might find an even better option for you
        </motion.p>
      </div>
    </section>
  );
}
