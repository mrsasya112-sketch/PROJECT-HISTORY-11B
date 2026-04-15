import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

type Scene = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ambience: string;
  frequency: number;
};

const scenes: Scene[] = [
  {
    id: "flight",
    title: "triply",
    subtitle: "Начните путь в небе: группа еще в хаосе, но маршрут уже собирается в фоне.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80",
    ambience: "Engine hum",
    frequency: 115,
  },
  {
    id: "paris",
    title: "Парижское кафе",
    subtitle: "Вместо сотни сообщений: общий чат, таймслоты и роли по задачам в одном слое.",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=80",
    ambience: "Cafe chatter",
    frequency: 160,
  },
  {
    id: "coast",
    title: "Побережье",
    subtitle: "AI собирает дневной план по интересам, бюджету и темпу группы за 40 секунд.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
    ambience: "Sea breeze",
    frequency: 190,
  },
  {
    id: "night",
    title: "Ночной город",
    subtitle: "Карты, бронирования и платежи синхронизированы, пока история путешествия продолжается.",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1800&q=80",
    ambience: "City pulse",
    frequency: 230,
  },
];

type PlannerState = {
  style: "culture" | "nature" | "food";
  pace: "slow" | "balanced" | "intense";
  budget: "smart" | "comfort" | "premium";
  groupSize: number;
};

const initialPlanner: PlannerState = {
  style: "culture",
  pace: "balanced",
  budget: "comfort",
  groupSize: 6,
};

export default function App() {
  const storyRef = useRef<HTMLElement | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [activeScene, setActiveScene] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [planner, setPlanner] = useState<PlannerState>(initialPlanner);
  const [itineraryVisible, setItineraryVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const planeX = useTransform(scrollYProgress, [0, 1], ["-25vw", "110vw"]);
  const planeY = useTransform(scrollYProgress, [0, 0.45, 1], ["10vh", "-2vh", "5vh"]);
  const cloudShift = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(scenes.length - 1, Math.floor(value * scenes.length));
    setActiveScene((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!soundEnabled || !oscillatorRef.current) {
      return;
    }

    oscillatorRef.current.frequency.setTargetAtTime(
      scenes[activeScene].frequency,
      audioContextRef.current?.currentTime ?? 0,
      0.2
    );
  }, [activeScene, soundEnabled]);

  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  const itinerary = useMemo(() => {
    const styleMap: Record<PlannerState["style"], string[]> = {
      culture: ["локальные музеи", "архитектурные прогулки", "вечерний театр"],
      nature: ["видовые маршруты", "поход с гидом", "закат у воды"],
      food: ["рынок и дегустации", "мастер-класс шефа", "гастро-бар маршрут"],
    };

    const paceMap: Record<PlannerState["pace"], string> = {
      slow: "2 активности и длинные паузы",
      balanced: "3 активности и гибкое окно",
      intense: "4 активности и плотный ритм",
    };

    return Array.from({ length: 4 }, (_, day) => ({
      day: day + 1,
      focus: styleMap[planner.style][day % 3],
      cadence: paceMap[planner.pace],
      split: `${Math.max(1, Math.floor(planner.groupSize / 3))} мини-группы для параллельных слотов`,
    }));
  }, [planner]);

  async function toggleSound() {
    if (soundEnabled) {
      gainRef.current?.gain.setTargetAtTime(0, audioContextRef.current?.currentTime ?? 0, 0.08);
      window.setTimeout(() => {
        oscillatorRef.current?.stop();
        oscillatorRef.current = null;
      }, 200);
      setSoundEnabled(false);
      return;
    }

    const context = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = context;
    await context.resume();

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = scenes[activeScene].frequency;

    const gainNode = context.createGain();
    gainNode.gain.value = 0;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    gainNode.gain.setTargetAtTime(0.04, context.currentTime, 0.25);

    oscillatorRef.current = oscillator;
    gainRef.current = gainNode;
    setSoundEnabled(true);
  }

  function handlePlannerSubmit(event: FormEvent) {
    event.preventDefault();
    setItineraryVisible(true);
  }

  return (
    <div className="bg-black text-white">
      <header className="fixed left-0 top-0 z-50 w-full px-6 pt-6 md:px-10">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/80">
          <span className="font-semibold text-white">triply</span>
          <button
            type="button"
            onClick={toggleSound}
            className="border border-white/30 px-3 py-2 text-[10px] tracking-[0.2em] transition hover:border-white"
          >
            {soundEnabled ? "Sound on" : "Sound off"}
          </button>
        </div>
        <div className="mt-3 h-px w-full overflow-hidden bg-white/20">
          <motion.div className="h-full bg-white" style={{ width: progressWidth }} />
        </div>
      </header>

      <section ref={storyRef} className="relative h-[440vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: cloudShift }}>
            {scenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.55)), url(${scene.image})` }}
                animate={{ opacity: activeScene === index ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            ))}
          </motion.div>

          <div className="grain-overlay absolute inset-0" />

          <motion.div
            className="absolute left-0 top-0 text-4xl opacity-80 md:text-6xl"
            style={{ x: planeX, y: planeY }}
            aria-hidden
          >
            ✈
          </motion.div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl items-end px-6 pb-20 md:items-center md:pb-0 md:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={scenes[activeScene].id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/75">{scenes[activeScene].ambience}</p>
                <h1 className="mt-3 text-5xl font-semibold leading-[0.95] md:text-7xl">{scenes[activeScene].title}</h1>
                <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">{scenes[activeScene].subtitle}</p>
                <div className="mt-8 flex gap-4">
                  <a href="#planner" className="border border-white px-6 py-3 text-sm uppercase tracking-[0.18em] hover:bg-white hover:text-black">
                    Построить маршрут
                  </a>
                  <a href="#references" className="text-sm uppercase tracking-[0.18em] text-white/80 transition hover:text-white">
                    Смотреть референсы
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="border-t border-white/15 px-6 py-24 md:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-14 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-200/80">Без Triply</p>
            <h2 className="mt-4 text-3xl font-medium">Хаотичное планирование</h2>
            <p className="mt-3 max-w-md text-white/75">Сообщения теряются, бюджет разъезжается, а решения принимаются в последний момент.</p>
            <ul className="mt-8 space-y-3 text-sm text-red-100/85">
              <li className="chaos-line">17 чатов по одной поездке</li>
              <li className="chaos-line" style={{ animationDelay: "120ms" }}>Дубли бронирований и пересечения</li>
              <li className="chaos-line" style={{ animationDelay: "240ms" }}>Непрозрачные траты для группы</li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">С Triply</p>
            <h2 className="mt-4 text-3xl font-medium">Чистый управляемый маршрут</h2>
            <p className="mt-3 max-w-md text-white/75">Один живой план: кто, где и когда. AI корректирует структуру по ходу поездки.</p>
            <div className="mt-8 space-y-3 text-sm text-emerald-100/90">
              <p>Единая временная линия с ролями.</p>
              <p>Автоматические окна перемещений между точками.</p>
              <p>Split-payments и прозрачный баланс по участникам.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="planner" className="border-t border-white/15 px-6 py-24 md:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-14 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/65">AI Itinerary Builder</p>
            <h2 className="mt-4 text-4xl font-medium leading-tight">Короткий опрос, полноценный план по дням</h2>
            <p className="mt-4 max-w-xl text-white/75">
              Это демо логики основного продукта: ответы группы превращаются в редактируемую структуру маршрута с темпом,
              активностями и разбиением команды.
            </p>
          </div>

          <form onSubmit={handlePlannerSubmit} className="space-y-5 border border-white/20 p-6 md:p-8">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Стиль поездки</span>
              <select
                value={planner.style}
                onChange={(event) => setPlanner((prev) => ({ ...prev, style: event.target.value as PlannerState["style"] }))}
                className="w-full border border-white/25 bg-black px-3 py-3 text-sm"
              >
                <option value="culture">Культура</option>
                <option value="nature">Природа</option>
                <option value="food">Гастро</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Темп</span>
              <select
                value={planner.pace}
                onChange={(event) => setPlanner((prev) => ({ ...prev, pace: event.target.value as PlannerState["pace"] }))}
                className="w-full border border-white/25 bg-black px-3 py-3 text-sm"
              >
                <option value="slow">Спокойный</option>
                <option value="balanced">Сбалансированный</option>
                <option value="intense">Интенсивный</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Бюджет</span>
              <select
                value={planner.budget}
                onChange={(event) => setPlanner((prev) => ({ ...prev, budget: event.target.value as PlannerState["budget"] }))}
                className="w-full border border-white/25 bg-black px-3 py-3 text-sm"
              >
                <option value="smart">Smart</option>
                <option value="comfort">Comfort</option>
                <option value="premium">Premium</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Размер группы: {planner.groupSize}</span>
              <input
                type="range"
                min={3}
                max={12}
                value={planner.groupSize}
                onChange={(event) => setPlanner((prev) => ({ ...prev, groupSize: Number(event.target.value) }))}
                className="w-full"
              />
            </label>

            <button type="submit" className="w-full border border-white px-4 py-3 text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black">
              Сгенерировать 4 дня
            </button>
          </form>
        </div>

        <AnimatePresence>
          {itineraryVisible ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="mx-auto mt-12 w-full max-w-6xl border border-white/20 p-6 md:p-8"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">Предпросмотр маршрута</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {itinerary.map((item) => (
                  <div key={item.day} className="space-y-2 border-l border-white/30 pl-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">Day {item.day}</p>
                    <p className="text-lg">{item.focus}</p>
                    <p className="text-sm text-white/70">{item.cadence}</p>
                    <p className="text-sm text-white/70">{item.split}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section id="references" className="border-t border-white/15 px-6 py-24 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.22em] text-white/65">Референсы cinematic storytelling</p>
          <h2 className="mt-4 text-3xl font-medium">Проекты, на которые стоит смотреть при проектировании 13-15 экранов</h2>
          <p className="mt-4 max-w-3xl text-white/75">
            Ниже реальные публичные примеры, похожие по подходу к скролл-анимации, глубине сцены, саунд-дизайну и презентации сложного продукта.
          </p>
          <ul className="mt-10 space-y-4 text-white/90">
            <li>
              <a href="https://www.polestar.com" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Polestar product storytelling
              </a>
            </li>
            <li>
              <a href="https://www.apple.com/airpods-pro/" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Apple AirPods Pro interactive page
              </a>
            </li>
            <li>
              <a href="https://iceandsky.com/" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Ice and Sky scroll-driven documentary site
              </a>
            </li>
            <li>
              <a href="https://www.awwwards.com/websites/three-js/" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Curated Three.js experiences on Awwwards
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
