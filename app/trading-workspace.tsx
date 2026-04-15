"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type TabId =
  | "home"
  | "time-zones"
  | "lot-size"
  | "forex-factory"
  | "journal"
  | "risk-manager"
  | "session-tracker"
  | "backtesting"
  | "market-notes"
  | "settings"
  | "ff-calendar"
  | "playbook"
  | "downloads"
  | "analytics";

type SessionId = "London" | "New York" | "Tokyo" | "Sydney";
type TradeOutcome = "Win" | "Loss" | "BE";
type ThemeMode = "dark" | "light";
type AssetType = "forex" | "gold" | "index";

type NavItem = {
  id: TabId;
  label: string;
  description: string;
  icon: string;
};

type SessionConfig = {
  id: SessionId;
  timezone: string;
  openHour: number;
  closeHour: number;
  accent: string;
};

type JournalTrade = {
  id: string;
  date: string;
  session: SessionId;
  type: TradeOutcome;
  pnl: number;
  rr: number;
  notes: string;
};

type BacktestTrade = {
  id: string;
  date: string;
  setup: string;
  outcome: TradeOutcome;
  rr: number;
  pnl: number;
};

type PlaybookEntry = {
  id: string;
  name: string;
  rules: string;
  invalidations: string;
  targets: string;
};

type MarketNotes = {
  fvg: string;
  ifvg: string;
  liquidity: string;
  bias: string;
};

type SettingsState = {
  theme: ThemeMode;
};

type DownloadButton = {
  title: string;
  url: string;
  description: string;
  action: "open" | "download";
};

type LotCalculatorState = {
  assetType: AssetType;
  symbol: string;
  accountBalance: number;
  riskPercent: number;
  stopLoss: number;
  price: number;
};

type RiskManagerState = {
  accountBalance: number;
  dailyRiskPercent: number;
  perTradeRiskPercent: number;
  startingEquity: number;
  currentEquity: number;
};

type SessionStats = {
  session: SessionId;
  trades: number;
  wins: number;
  pnl: number;
};

const STORAGE_KEYS = {
  journal: "atlas-trade-journal",
  backtests: "atlas-backtests",
  notes: "atlas-market-notes",
  playbook: "atlas-playbook",
  settings: "atlas-settings",
  lotCalc: "atlas-lot-calculator",
  risk: "atlas-risk-manager",
} as const;

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    description: "Dashboard hub for every tool in the workspace.",
    icon: "01",
  },
  {
    id: "time-zones",
    label: "Time Zones",
    description: "Track sessions, overlaps, and compare time zones on a timeline.",
    icon: "02",
  },
  {
    id: "lot-size",
    label: "Lot Size Calculator",
    description: "Risk-based sizing for forex, gold, and US500-style indices.",
    icon: "03",
  },
  {
    id: "forex-factory",
    label: "Forex Factory",
    description: "Quick access to news with a high-impact preview panel.",
    icon: "04",
  },
  {
    id: "journal",
    label: "Trading Journal",
    description: "Notion-style trade tracking with live metrics and local persistence.",
    icon: "05",
  },
  {
    id: "risk-manager",
    label: "Risk Manager",
    description: "Set daily limits, monitor drawdown, and size your trade count.",
    icon: "06",
  },
  {
    id: "session-tracker",
    label: "Session Tracker",
    description: "Measure win rate and PnL by London, New York, Tokyo, and Sydney.",
    icon: "07",
  },
  {
    id: "backtesting",
    label: "Backtesting Tool",
    description: "Log manual test trades and watch the equity curve evolve.",
    icon: "08",
  },
  {
    id: "market-notes",
    label: "Market Structure Notes",
    description: "Store markdown notes for FVG, IFVG, liquidity, and directional bias.",
    icon: "09",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Control theme mode, local data behavior, and resets.",
    icon: "10",
  },
  {
    id: "ff-calendar",
    label: "FF Calendar",
    description: "Open the Forex Factory calendar instantly.",
    icon: "11",
  },
  {
    id: "playbook",
    label: "Trade Playbook",
    description: "Build your strategy library with reusable setup rules.",
    icon: "12",
  },
  {
    id: "downloads",
    label: "Downloads",
    description: "HTML-style link hub for files, downloads, and external resources.",
    icon: "13",
  },
  {
    id: "analytics",
    label: "Performance Analytics",
    description: "Visualize equity, drawdown, best days, and win/loss distribution.",
    icon: "14",
  },
];

const HOME_PRIMARY_CARDS: TabId[] = [
  "time-zones",
  "lot-size",
  "forex-factory",
  "journal",
  "risk-manager",
  "session-tracker",
  "backtesting",
];

const HOME_SECONDARY_CARDS: TabId[] = [
  "market-notes",
  "settings",
  "ff-calendar",
  "playbook",
  "downloads",
  "analytics",
];

const SESSION_CONFIGS: SessionConfig[] = [
  {
    id: "New York",
    timezone: "America/New_York",
    openHour: 8,
    closeHour: 17,
    accent: "from-sky-400/70 to-cyan-400/40",
  },
  {
    id: "London",
    timezone: "Europe/London",
    openHour: 8,
    closeHour: 16,
    accent: "from-violet-400/70 to-indigo-400/40",
  },
  {
    id: "Tokyo",
    timezone: "Asia/Tokyo",
    openHour: 9,
    closeHour: 18,
    accent: "from-emerald-400/70 to-teal-400/40",
  },
  {
    id: "Sydney",
    timezone: "Australia/Sydney",
    openHour: 8,
    closeHour: 17,
    accent: "from-amber-300/70 to-orange-400/40",
  },
];

const FOREX_SYMBOLS = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "NZDUSD", "USDCHF", "USDCAD"];

const UPCOMING_NEWS = [
  { time: "5:30pm", currency: "AUD", event: "CB Leading Index m/m", impact: "High" },
  { time: "5:30pm", currency: "USD", event: "Crude Oil Inventories", impact: "High" },
  { time: "6:50pm", currency: "GBP", event: "BOE Gov Bailey Speaks", impact: "High" },
  { time: "8:45pm", currency: "USD", event: "FOMC Member Bowman Speaks", impact: "High" },
  { time: "9:00pm", currency: "USD", event: "Beige Book", impact: "High" },
  { time: "10:30pm", currency: "EUR", event: "ECB President Lagarde Speaks", impact: "High" },
];

const DEFAULT_JOURNAL: JournalTrade[] = [
  {
    id: createId(),
    date: "2026-04-11",
    session: "London",
    type: "Win",
    pnl: 420,
    rr: 2.4,
    notes: "London sweep into FVG continuation.",
  },
  {
    id: createId(),
    date: "2026-04-13",
    session: "New York",
    type: "Loss",
    pnl: -180,
    rr: -1,
    notes: "Chased the move before confirmation.",
  },
  {
    id: createId(),
    date: "2026-04-14",
    session: "Tokyo",
    type: "BE",
    pnl: 0,
    rr: 0,
    notes: "Protected at break-even after liquidity tap.",
  },
];

const DEFAULT_BACKTESTS: BacktestTrade[] = [
  {
    id: createId(),
    date: "2026-04-08",
    setup: "London Sweep",
    outcome: "Win",
    rr: 2.2,
    pnl: 220,
  },
  {
    id: createId(),
    date: "2026-04-09",
    setup: "NY Reversal",
    outcome: "Loss",
    rr: -1,
    pnl: -100,
  },
  {
    id: createId(),
    date: "2026-04-10",
    setup: "FVG Entry",
    outcome: "Win",
    rr: 3.1,
    pnl: 310,
  },
];

const DEFAULT_PLAYBOOK: PlaybookEntry[] = [
  {
    id: createId(),
    name: "London Sweep",
    rules: "- Sweep Asian range\n- Wait for displacement\n- Enter first clean retest",
    invalidations: "- No displacement candle\n- Mid-range chop\n- Opposing high-impact news",
    targets: "- Previous daily high\n- External liquidity\n- Scale remainder into momentum",
  },
  {
    id: createId(),
    name: "NY Reversal",
    rules: "- London trend exhausts into HTF level\n- NY open fails to continue\n- MSS confirms shift",
    invalidations: "- Strong macro trend continuation\n- News spike through structure",
    targets: "- Return to intraday mean\n- Opposing session range low/high",
  },
];

const DEFAULT_NOTES: MarketNotes = {
  fvg: "## FVG\n\n- Look for displacement first.\n- Favor gaps aligned with HTF bias.",
  ifvg: "## IFVG\n\n- Note when an imbalance flips into support or resistance after structure breaks.",
  liquidity: "## Liquidity\n\n- Mark Asia highs/lows.\n- Note equal highs, equal lows, and session sweeps.",
  bias: "## Bias\n\n- Weekly: bullish\n- Daily: waiting for discount array reaction\n- Intraday: neutral before NY",
};

const DEFAULT_SETTINGS: SettingsState = {
  theme: "dark",
};

const DEFAULT_LOT_CALCULATOR: LotCalculatorState = {
  assetType: "forex",
  symbol: "EURUSD",
  accountBalance: 10000,
  riskPercent: 1,
  stopLoss: 20,
  price: 1.085,
};

const DEFAULT_RISK_MANAGER: RiskManagerState = {
  accountBalance: 10000,
  dailyRiskPercent: 2,
  perTradeRiskPercent: 0.5,
  startingEquity: 10000,
  currentEquity: 9640,
};

const DOWNLOAD_BUTTONS: DownloadButton[] = [
  // КНОПКА 1: поменяй `url` на свою ссылку. `action: "open"` откроет ссылку в новой вкладке.
  { title: "геод 5.3", url: "https://drive.google.com/file/d/13Jr9eERs9OmrXwfkYZvb94WUV6Wj9xxV/view?usp=drive_link", description: "", action: "open" },
  // КНОПКА 2: для скачивания файла поставь прямую ссылку на файл и `action: "download"`.
  { title: "МХ", url: "https://geometriodash.ru/chity/mega-hack", description: "MegaHack 9.11", action: "open" },
  // КНОПКА 3: можно вставить Telegram, Google Drive, Dropbox, сайт и т.д.
  { title: "Кнопка 3", url: "https://example.com/3", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_3", action: "open" },
  // КНОПКА 4: меняй только `title`, `url`, `description`, `action`.
  { title: "Кнопка 4", url: "https://example.com/4", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_4", action: "open" },
  // КНОПКА 5: если ссылка временно не нужна, можешь оставить пример и потом заменить.
  { title: "Кнопка 5", url: "https://example.com/5", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_5", action: "open" },
  // КНОПКА 6
  { title: "Кнопка 6", url: "https://example.com/6", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_6", action: "open" },
  // КНОПКА 7
  { title: "Кнопка 7", url: "https://example.com/7", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_7", action: "open" },
  // КНОПКА 8
  { title: "Кнопка 8", url: "https://example.com/8", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_8", action: "open" },
  // КНОПКА 9
  { title: "Кнопка 9", url: "https://example.com/9", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_9", action: "open" },
  // КНОПКА 10
  { title: "Кнопка 10", url: "https://example.com/10", description: "ВСТАВЬ_СЮДА_ОПИСАНИЕ_10", action: "open" },
];

export default function TradingWorkspace() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(new Date());
  const [compareUtcHour, setCompareUtcHour] = useState(13);
  const [selectedSessions, setSelectedSessions] = useState<SessionId[]>([
    "London",
    "New York",
    "Tokyo",
  ]);
  const [journalTrades, setJournalTrades] = useLocalStorageState<JournalTrade[]>(
    STORAGE_KEYS.journal,
    DEFAULT_JOURNAL,
  );
  const [backtests, setBacktests] = useLocalStorageState<BacktestTrade[]>(
    STORAGE_KEYS.backtests,
    DEFAULT_BACKTESTS,
  );
  const [marketNotes, setMarketNotes] = useLocalStorageState<MarketNotes>(
    STORAGE_KEYS.notes,
    DEFAULT_NOTES,
  );
  const [playbook, setPlaybook] = useLocalStorageState<PlaybookEntry[]>(
    STORAGE_KEYS.playbook,
    DEFAULT_PLAYBOOK,
  );
  const [settings, setSettings] = useLocalStorageState<SettingsState>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
  );
  const [lotCalculator, setLotCalculator] = useLocalStorageState<LotCalculatorState>(
    STORAGE_KEYS.lotCalc,
    DEFAULT_LOT_CALCULATOR,
  );
  const [riskManager, setRiskManager] = useLocalStorageState<RiskManagerState>(
    STORAGE_KEYS.risk,
    DEFAULT_RISK_MANAGER,
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    document.documentElement.dataset.theme = settings.theme;
  }, [hydrated, settings.theme]);

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) ?? NAV_ITEMS[0];
  const homeCardsPrimary = NAV_ITEMS.filter((item) => HOME_PRIMARY_CARDS.includes(item.id));
  const homeCardsSecondary = NAV_ITEMS.filter((item) => HOME_SECONDARY_CARDS.includes(item.id));

  const journalMetrics = useMemo(() => getJournalMetrics(journalTrades), [journalTrades]);
  const sessionStats = useMemo(() => getSessionStats(journalTrades), [journalTrades]);
  const backtestMetrics = useMemo(() => getBacktestMetrics(backtests), [backtests]);
  const analytics = useMemo(() => getAnalytics(journalTrades), [journalTrades]);
  const lotOutput = useMemo(() => calculateLotSize(lotCalculator), [lotCalculator]);
  const riskOutput = useMemo(() => calculateRiskManager(riskManager), [riskManager]);

  const visibleSessions = SESSION_CONFIGS.filter((session) =>
    selectedSessions.includes(session.id),
  );

  const handleReset = () => {
    const approved = window.confirm("Reset all locally saved trading data and return to defaults?");
    if (!approved) {
      return;
    }

    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    setJournalTrades(DEFAULT_JOURNAL);
    setBacktests(DEFAULT_BACKTESTS);
    setMarketNotes(DEFAULT_NOTES);
    setPlaybook(DEFAULT_PLAYBOOK);
    setSettings(DEFAULT_SETTINGS);
    setLotCalculator(DEFAULT_LOT_CALCULATOR);
    setRiskManager(DEFAULT_RISK_MANAGER);
    setActiveTab("home");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(84,104,255,0.18),_transparent_28%),radial-gradient(circle_at_right,_rgba(32,196,167,0.16),_transparent_24%),linear-gradient(180deg,_var(--page-start),_var(--page-end))]">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col gap-4 px-3 py-3 md:flex-row md:px-5 md:py-5">
        <aside className="glass-panel flex w-full shrink-0 flex-col gap-5 p-4 md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] md:w-72 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted">Atlas Trade Desk</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Premium Trading Workspace
              </h1>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  theme: current.theme === "dark" ? "light" : "dark",
                }))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-sm text-foreground transition hover:bg-white/12"
              aria-label="Toggle theme"
            >
              {settings.theme === "dark" ? "DN" : "LT"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Market Clock</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{formatTime(now, "UTC")}</p>
            <p className="mt-1 text-sm text-muted">{formatDate(now)}</p>
          </div>

          <nav className="flex min-h-0 flex-col gap-2 overflow-x-auto md:overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-white/15 bg-white/14 shadow-[0_10px_40px_rgba(20,20,30,0.35)]"
                      : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/8"
                  }`}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-xs font-medium text-muted">
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-muted">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass-panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Workspace</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {activeItem.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                {activeItem.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MetricChip label="Journal PnL" value={formatCurrency(journalMetrics.totalPnl)} />
              <MetricChip label="Win Rate" value={`${journalMetrics.winRate.toFixed(1)}%`} />
              <MetricChip label="Theme" value={settings.theme} />
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/14"
              >
                Back to Home
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.main
              key={activeTab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="min-w-0"
            >
              {activeTab === "home" && (
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                    <GlassPanel className="p-5 md:p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Home</p>
                      <h3 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                        Clean tools for fast decisions.
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                        Atlas combines session awareness, position sizing, journaling, playbooks,
                        analytics, and note-taking into one calm trading dashboard. Everything saves
                        locally and every page routes back here instantly.
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <MetricCard
                          title="Active Sessions"
                          value={`${SESSION_CONFIGS.filter((session) => isSessionOpen(session, now)).length}/4`}
                          tone="cyan"
                        />
                        <MetricCard
                          title="Tracked Trades"
                          value={String(journalTrades.length)}
                          tone="violet"
                        />
                        <MetricCard
                          title="Backtest Edge"
                          value={`${backtestMetrics.expectancy.toFixed(2)}R`}
                          tone="emerald"
                        />
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-5 md:p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Focus Today</p>
                      <div className="mt-4 space-y-3">
                        {UPCOMING_NEWS.slice(0, 4).map((news) => (
                          <div
                            key={`${news.time}-${news.event}`}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">{news.event}</p>
                              <p className="text-xs text-muted">
                                {news.currency} · {news.time}
                              </p>
                            </div>
                            <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-200">
                              {news.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>
                  </div>

                  <SectionTitle
                    title="Core Workspace"
                    description="The main trading tools you will use every session."
                  />
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {homeCardsPrimary.map((item) => (
                      <HomeCard key={item.id} item={item} onOpen={() => setActiveTab(item.id)} />
                    ))}
                  </div>

                  <SectionTitle
                    title="Library & Notes"
                    description="Strategy references, calendar shortcuts, settings, and analytics."
                  />
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {homeCardsSecondary.map((item) => (
                      <HomeCard key={item.id} item={item} onOpen={() => setActiveTab(item.id)} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "time-zones" && (
                <TabPage
                  title="Trading Sessions"
                  description="Monitor live session status, compare zones, and scrub a UTC slider to visualize local session timing."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <GlassPanel className="p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        {SESSION_CONFIGS.map((session) => {
                          const sessionTime = formatTime(now, session.timezone);
                          const open = isSessionOpen(session, now);
                          const selected = selectedSessions.includes(session.id);
                          return (
                            <button
                              key={session.id}
                              type="button"
                              onClick={() =>
                                setSelectedSessions((current) =>
                                  current.includes(session.id)
                                    ? current.filter((item) => item !== session.id)
                                    : [...current, session.id],
                                )
                              }
                              className={`rounded-3xl border p-4 text-left transition ${
                                selected
                                  ? "border-white/16 bg-white/12"
                                  : "border-white/8 bg-white/5 hover:bg-white/8"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                                    {session.timezone.replace("_", " ")}
                                  </p>
                                  <h4 className="mt-2 text-2xl font-semibold text-foreground">
                                    {session.id}
                                  </h4>
                                </div>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    open
                                      ? "bg-emerald-500/16 text-emerald-200"
                                      : "bg-white/8 text-muted"
                                  }`}
                                >
                                  {open ? "Open" : "Closed"}
                                </span>
                              </div>
                              <p className="mt-4 text-3xl font-semibold text-foreground">
                                {sessionTime}
                              </p>
                              <p className="mt-2 text-sm text-muted">
                                Session hours: {padHour(session.openHour)}:00 - {padHour(session.closeHour)}:00
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Compare</p>
                      <div className="mt-4 rounded-3xl border border-white/10 bg-white/6 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Interactive UTC slider
                            </p>
                            <p className="text-xs text-muted">
                              Selected UTC hour: {padHour(compareUtcHour)}:00
                            </p>
                          </div>
                          <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-muted">
                            {selectedSessions.length} selected
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={23}
                          value={compareUtcHour}
                          onChange={(event) => setCompareUtcHour(Number(event.target.value))}
                          className="mt-5 w-full accent-[var(--accent)]"
                        />
                      </div>
                      <div className="mt-4 space-y-3">
                        {visibleSessions.map((session) => {
                          const comparisonHour = getHourForZoneAtUtcHour(
                            session.timezone,
                            compareUtcHour,
                          );
                          return (
                            <div key={session.id} className="rounded-3xl border border-white/10 bg-white/6 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{session.id}</p>
                                  <p className="text-xs text-muted">
                                    Local time at selected UTC: {padHour(comparisonHour)}:00
                                  </p>
                                </div>
                                <span className="text-xs text-muted">
                                  {isHourInSession(comparisonHour, session.openHour, session.closeHour)
                                    ? "In session"
                                    : "Off session"}
                                </span>
                              </div>
                              <SessionTimeline session={session} markerHour={comparisonHour} />
                            </div>
                          );
                        })}
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "lot-size" && (
                <TabPage
                  title="Lot Size Calculator"
                  description="Risk-based position sizing with asset-aware logic for forex, gold, and US500/SPX-style index products."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                    <GlassPanel className="p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Asset Type">
                          <select
                            value={lotCalculator.assetType}
                            onChange={(event) =>
                              setLotCalculator((current) => ({
                                ...current,
                                assetType: event.target.value as AssetType,
                                symbol:
                                  event.target.value === "forex"
                                    ? "EURUSD"
                                    : event.target.value === "gold"
                                      ? "XAUUSD"
                                      : "US500",
                                stopLoss: event.target.value === "forex" ? 20 : 10,
                                price:
                                  event.target.value === "forex"
                                    ? 1.085
                                    : event.target.value === "gold"
                                      ? 2350
                                      : 5200,
                              }))
                            }
                            className="field-input"
                          >
                            <option value="forex">Forex Pairs</option>
                            <option value="gold">Gold (XAUUSD)</option>
                            <option value="index">S&amp;P 500 / US500</option>
                          </select>
                        </Field>

                        <Field label="Symbol">
                          {lotCalculator.assetType === "forex" ? (
                            <select
                              value={lotCalculator.symbol}
                              onChange={(event) =>
                                setLotCalculator((current) => ({
                                  ...current,
                                  symbol: event.target.value,
                                  price: event.target.value === "USDJPY" ? 154.2 : 1.085,
                                }))
                              }
                              className="field-input"
                            >
                              {FOREX_SYMBOLS.map((symbol) => (
                                <option key={symbol} value={symbol}>
                                  {symbol}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={lotCalculator.symbol}
                              onChange={(event) =>
                                setLotCalculator((current) => ({
                                  ...current,
                                  symbol: event.target.value,
                                }))
                              }
                              className="field-input"
                            />
                          )}
                        </Field>

                        <Field label="Account Balance">
                          <input
                            type="number"
                            value={lotCalculator.accountBalance}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setLotCalculator((current) => ({
                                  ...current,
                                  accountBalance: value,
                                })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>

                        <Field label="Risk %">
                          <input
                            type="number"
                            step="0.1"
                            value={lotCalculator.riskPercent}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setLotCalculator((current) => ({
                                  ...current,
                                  riskPercent: value,
                                })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>

                        <Field label={lotCalculator.assetType === "forex" ? "Stop Loss (pips)" : "Stop Loss (points)"}>
                          <input
                            type="number"
                            step="0.1"
                            value={lotCalculator.stopLoss}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setLotCalculator((current) => ({
                                  ...current,
                                  stopLoss: value,
                                })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>

                        <Field label="Current Price">
                          <input
                            type="number"
                            step="0.001"
                            value={lotCalculator.price}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setLotCalculator((current) => ({
                                  ...current,
                                  price: value,
                                })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-5">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard title="Risk Amount" value={formatCurrency(lotOutput.riskAmount)} tone="rose" />
                        <MetricCard title="Lot Size" value={lotOutput.lotSize.toFixed(2)} tone="cyan" />
                        <MetricCard title="Value / Point" value={formatCurrency(lotOutput.valuePerUnit)} tone="emerald" />
                        <MetricCard title="Contract Logic" value={lotOutput.contractLabel} tone="violet" />
                      </div>
                      <div className="mt-4 rounded-3xl border border-white/10 bg-white/6 p-4">
                        <p className="text-sm font-medium text-foreground">Sizing model</p>
                        <p className="mt-2 text-sm leading-7 text-muted">
                          {lotOutput.explanation}
                        </p>
                        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted">
                          {lotCalculator.assetType === "forex"
                            ? "Assumes a USD account and common CFD/standard-lot pricing."
                            : "Assumptions can vary by broker; verify contract specs before live use."}
                        </p>
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "forex-factory" && (
                <TabPage
                  title="Forex Factory News"
                  description="Quick-access market news with a premium preview panel and direct link to the live website."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
                    <GlassPanel className="p-5">
                      <div className="flex flex-col gap-3">
                        <a
                          href="https://www.forexfactory.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
                        >
                          Open in new tab
                        </a>
                        <button
                          type="button"
                          onClick={() => setActiveTab("ff-calendar")}
                          className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-white/14"
                        >
                          Open calendar shortcut
                        </button>
                      </div>
                      <div className="mt-5 space-y-3">
                        {UPCOMING_NEWS.map((news) => (
                          <div
                            key={`${news.time}-${news.event}`}
                            className="rounded-3xl border border-white/10 bg-white/6 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-foreground">{news.event}</p>
                              <span className="rounded-full bg-rose-500/16 px-3 py-1 text-xs font-medium text-rose-200">
                                {news.impact}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-muted">
                              {news.currency} · {news.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-4">
                      <div className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/70">
                        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          <p className="ml-2 text-xs uppercase tracking-[0.28em] text-muted">
                            Embedded preview
                          </p>
                        </div>
                        <iframe
                          src="https://www.forexfactory.com"
                          title="Forex Factory"
                          className="h-[620px] w-full"
                        />
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "journal" && (
                <TabPage
                  title="Trading Journal"
                  description="Editable Notion-style trade table with auto-calculated PnL, win rate, and average RR."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MetricCard title="Total PnL" value={formatCurrency(journalMetrics.totalPnl)} tone="emerald" />
                      <MetricCard title="Win Rate" value={`${journalMetrics.winRate.toFixed(1)}%`} tone="cyan" />
                      <MetricCard title="Average RR" value={`${journalMetrics.averageRr.toFixed(2)}R`} tone="violet" />
                      <MetricCard title="Trades" value={String(journalTrades.length)} tone="amber" />
                    </div>

                    <GlassPanel className="overflow-hidden p-0">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-white/8 text-left text-xs uppercase tracking-[0.22em] text-muted">
                            <tr>
                              {["Date", "Session", "Trade Type", "RR", "Profit/Loss ($)", "Notes", ""].map((header) => (
                                <th key={header} className="px-4 py-4 font-medium">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {journalTrades.map((trade) => (
                              <tr key={trade.id} className="border-t border-white/8">
                                <td className="px-4 py-3">
                                  <input
                                    type="date"
                                    value={trade.date}
                                    onChange={(event) =>
                                      setJournalTrades((current) =>
                                        current.map((item) =>
                                          item.id === trade.id ? { ...item, date: event.target.value } : item,
                                        ),
                                      )
                                    }
                                    className="field-input"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={trade.session}
                                    onChange={(event) =>
                                      setJournalTrades((current) =>
                                        current.map((item) =>
                                          item.id === trade.id
                                            ? { ...item, session: event.target.value as SessionId }
                                            : item,
                                        ),
                                      )
                                    }
                                    className="field-input"
                                  >
                                    {SESSION_CONFIGS.map((session) => (
                                      <option key={session.id} value={session.id}>
                                        {session.id}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={trade.type}
                                    onChange={(event) =>
                                      setJournalTrades((current) =>
                                        current.map((item) =>
                                          item.id === trade.id
                                            ? { ...item, type: event.target.value as TradeOutcome }
                                            : item,
                                        ),
                                      )
                                    }
                                    className="field-input"
                                  >
                                    <option value="Win">Win</option>
                                    <option value="Loss">Loss</option>
                                    <option value="BE">BE</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={trade.rr}
                                    onChange={(event) =>
                                      updateNumberState(event.target.value, (value) =>
                                        setJournalTrades((current) =>
                                          current.map((item) =>
                                            item.id === trade.id ? { ...item, rr: value } : item,
                                          ),
                                        ),
                                      )
                                    }
                                    className="field-input"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={trade.pnl}
                                    onChange={(event) =>
                                      updateNumberState(event.target.value, (value) =>
                                        setJournalTrades((current) =>
                                          current.map((item) =>
                                            item.id === trade.id ? { ...item, pnl: value } : item,
                                          ),
                                        ),
                                      )
                                    }
                                    className="field-input"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    value={trade.notes}
                                    onChange={(event) =>
                                      setJournalTrades((current) =>
                                        current.map((item) =>
                                          item.id === trade.id ? { ...item, notes: event.target.value } : item,
                                        ),
                                      )
                                    }
                                    className="field-input min-w-[220px]"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setJournalTrades((current) =>
                                        current.filter((item) => item.id !== trade.id),
                                      )
                                    }
                                    className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-medium text-muted transition hover:bg-white/14"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="border-t border-white/8 px-4 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setJournalTrades((current) => [
                              ...current,
                              {
                                id: createId(),
                                date: new Date().toISOString().slice(0, 10),
                                session: "London",
                                type: "Win",
                                pnl: 100,
                                rr: 1.5,
                                notes: "New trade",
                              },
                            ])
                          }
                          className="rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-slate-950 transition hover:opacity-90"
                        >
                          Add trade
                        </button>
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "risk-manager" && (
                <TabPage
                  title="Risk Manager"
                  description="Define your daily loss ceiling, cap your trade count, and keep drawdown visible while you trade."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <GlassPanel className="p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Account Balance">
                          <input
                            type="number"
                            value={riskManager.accountBalance}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setRiskManager((current) => ({ ...current, accountBalance: value })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>
                        <Field label="Daily Risk Limit %">
                          <input
                            type="number"
                            step="0.1"
                            value={riskManager.dailyRiskPercent}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setRiskManager((current) => ({ ...current, dailyRiskPercent: value })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>
                        <Field label="Per Trade Risk %">
                          <input
                            type="number"
                            step="0.1"
                            value={riskManager.perTradeRiskPercent}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setRiskManager((current) => ({ ...current, perTradeRiskPercent: value })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>
                        <Field label="Starting Equity">
                          <input
                            type="number"
                            value={riskManager.startingEquity}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setRiskManager((current) => ({ ...current, startingEquity: value })),
                              )
                            }
                            className="field-input"
                          />
                        </Field>
                        <Field label="Current Equity">
                          <input
                            type="number"
                            value={riskManager.currentEquity}
                            onChange={(event) =>
                              updateNumberState(event.target.value, (value) =>
                                setRiskManager((current) => ({ ...current, currentEquity: value })),
                              )
                            }
                            className="field-input md:col-span-2"
                          />
                        </Field>
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-5">
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard title="Daily Risk" value={formatCurrency(riskOutput.dailyRiskLimit)} tone="rose" />
                        <MetricCard title="Max Trades" value={String(riskOutput.maxTrades)} tone="amber" />
                        <MetricCard title="Drawdown" value={`${riskOutput.drawdownPercent.toFixed(1)}%`} tone="violet" />
                        <MetricCard title="Buffer Left" value={formatCurrency(riskOutput.bufferLeft)} tone="cyan" />
                      </div>
                      <div className="mt-5 space-y-4">
                        <ProgressBlock
                          label="Daily risk used"
                          value={riskOutput.usedRiskPercent}
                          tone="rose"
                          detail={`${riskOutput.usedRiskPercent.toFixed(1)}% used`}
                        />
                        <ProgressBlock
                          label="Drawdown tracker"
                          value={riskOutput.drawdownPercent}
                          tone="violet"
                          detail={`${formatCurrency(riskManager.startingEquity - riskManager.currentEquity)} below start`}
                        />
                        <ProgressBlock
                          label="Trade allocation"
                          value={Math.min(100, riskOutput.maxTrades * 12.5)}
                          tone="cyan"
                          detail={`${riskOutput.maxTrades} full-risk trades available`}
                        />
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "session-tracker" && (
                <TabPage
                  title="Session Tracker"
                  description="Break down journal performance by session to see where your edge is strongest."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                    <GlassPanel className="p-5">
                      <div className="space-y-3">
                        {sessionStats.map((stat) => (
                          <div
                            key={stat.session}
                            className="rounded-3xl border border-white/10 bg-white/6 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-lg font-semibold text-foreground">{stat.session}</p>
                                <p className="text-sm text-muted">{stat.trades} tracked trades</p>
                              </div>
                              <span className="text-sm font-medium text-foreground">
                                {formatCurrency(stat.pnl)}
                              </span>
                            </div>
                            <div className="mt-4">
                              <ProgressBlock
                                label="Win rate"
                                value={stat.trades ? (stat.wins / stat.trades) * 100 : 0}
                                tone="emerald"
                                detail={`${stat.trades ? ((stat.wins / stat.trades) * 100).toFixed(1) : "0.0"}%`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Session PnL</p>
                      <div className="mt-5">
                        <BarChart
                          items={sessionStats.map((stat) => ({
                            label: stat.session,
                            value: stat.pnl,
                          }))}
                        />
                      </div>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {sessionStats.map((stat) => (
                          <MetricCard
                            key={`${stat.session}-metric`}
                            title={`${stat.session} Win Rate`}
                            value={`${stat.trades ? ((stat.wins / stat.trades) * 100).toFixed(1) : "0.0"}%`}
                            tone="cyan"
                          />
                        ))}
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "backtesting" && (
                <TabPage
                  title="Backtesting Tool"
                  description="Log manual test trades, build a sample size, and inspect the evolving equity curve."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <MetricCard title="Net PnL" value={formatCurrency(backtestMetrics.totalPnl)} tone="emerald" />
                      <MetricCard title="Hit Rate" value={`${backtestMetrics.winRate.toFixed(1)}%`} tone="cyan" />
                      <MetricCard title="Expectancy" value={`${backtestMetrics.expectancy.toFixed(2)}R`} tone="violet" />
                      <MetricCard title="Trades" value={String(backtests.length)} tone="amber" />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                      <GlassPanel className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Equity Curve</p>
                        <div className="mt-4">
                          <LineChart
                            points={buildEquityCurve(backtests.map((trade) => trade.pnl))}
                            labels={backtests.map((trade) => trade.date)}
                          />
                        </div>
                      </GlassPanel>

                      <GlassPanel className="p-5">
                        <div className="space-y-3">
                          {backtests.map((trade) => (
                            <div
                              key={trade.id}
                              className="grid gap-3 rounded-3xl border border-white/10 bg-white/6 p-4 md:grid-cols-[0.8fr_1fr_0.8fr_auto]"
                            >
                              <input
                                type="date"
                                value={trade.date}
                                onChange={(event) =>
                                  setBacktests((current) =>
                                    current.map((item) =>
                                      item.id === trade.id ? { ...item, date: event.target.value } : item,
                                    ),
                                  )
                                }
                                className="field-input"
                              />
                              <input
                                value={trade.setup}
                                onChange={(event) =>
                                  setBacktests((current) =>
                                    current.map((item) =>
                                      item.id === trade.id ? { ...item, setup: event.target.value } : item,
                                    ),
                                  )
                                }
                                className="field-input"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={trade.rr}
                                  onChange={(event) =>
                                    updateNumberState(event.target.value, (value) =>
                                      setBacktests((current) =>
                                        current.map((item) =>
                                          item.id === trade.id ? { ...item, rr: value } : item,
                                        ),
                                      ),
                                    )
                                  }
                                  className="field-input"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={trade.pnl}
                                  onChange={(event) =>
                                    updateNumberState(event.target.value, (value) =>
                                      setBacktests((current) =>
                                        current.map((item) =>
                                          item.id === trade.id ? { ...item, pnl: value } : item,
                                        ),
                                      ),
                                    )
                                  }
                                  className="field-input"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setBacktests((current) => current.filter((item) => item.id !== trade.id))
                                }
                                className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-xs font-medium text-muted transition hover:bg-white/14"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setBacktests((current) => [
                              ...current,
                              {
                                id: createId(),
                                date: new Date().toISOString().slice(0, 10),
                                setup: "Manual Setup",
                                outcome: "Win",
                                rr: 1,
                                pnl: 100,
                              },
                            ])
                          }
                          className="mt-4 rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-slate-950 transition hover:opacity-90"
                        >
                          Add backtest trade
                        </button>
                      </GlassPanel>
                    </div>
                  </div>
                </TabPage>
              )}

              {activeTab === "market-notes" && (
                <TabPage
                  title="Market Structure Notes"
                  description="A lightweight markdown workspace for FVG, IFVG, liquidity, and directional bias."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-2">
                    {(Object.entries(marketNotes) as Array<[keyof MarketNotes, string]>).map(([key, value]) => (
                      <GlassPanel key={key} className="grid gap-4 p-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-muted">Section</p>
                          <h4 className="mt-2 text-2xl font-semibold text-foreground">
                            {formatLabel(key)}
                          </h4>
                        </div>
                        <textarea
                          value={value}
                          onChange={(event) =>
                            setMarketNotes((current) => ({ ...current, [key]: event.target.value }))
                          }
                          rows={10}
                          className="field-input min-h-[220px] resize-y"
                        />
                        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                          <p className="text-xs uppercase tracking-[0.28em] text-muted">Preview</p>
                          <div className="mt-3 space-y-2 text-sm leading-7 text-foreground">
                            {renderMarkdownPreview(value)}
                          </div>
                        </div>
                      </GlassPanel>
                    ))}
                  </div>
                </TabPage>
              )}

              {activeTab === "settings" && (
                <TabPage
                  title="Settings"
                  description="Choose your theme, confirm local-first storage, and reset everything when you want a clean slate."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <GlassPanel className="p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Appearance</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setSettings((current) => ({ ...current, theme: "dark" }))}
                          className={`rounded-3xl border p-4 text-left transition ${
                            settings.theme === "dark"
                              ? "border-white/16 bg-white/12"
                              : "border-white/10 bg-white/6 hover:bg-white/10"
                          }`}
                        >
                          <p className="text-lg font-semibold text-foreground">Dark</p>
                          <p className="mt-1 text-sm text-muted">TradingView-inspired low-light workspace.</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettings((current) => ({ ...current, theme: "light" }))}
                          className={`rounded-3xl border p-4 text-left transition ${
                            settings.theme === "light"
                              ? "border-white/16 bg-white/12"
                              : "border-white/10 bg-white/6 hover:bg-white/10"
                          }`}
                        >
                          <p className="text-lg font-semibold text-foreground">Light</p>
                          <p className="mt-1 text-sm text-muted">Clean paper-like view for review sessions.</p>
                        </button>
                      </div>
                    </GlassPanel>

                    <GlassPanel className="p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Data</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <MetricCard title="Storage" value="localStorage" tone="cyan" />
                        <MetricCard title="Autosave" value="Enabled" tone="emerald" />
                        <MetricCard title="Journal Rows" value={String(journalTrades.length)} tone="violet" />
                        <MetricCard title="Playbook Setups" value={String(playbook.length)} tone="amber" />
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/18"
                      >
                        Reset data
                      </button>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "ff-calendar" && (
                <TabPage
                  title="Forex Factory Calendar"
                  description="Minimal quick-access calendar page with a one-click external link and a clean embedded view."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4">
                    <GlassPanel className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Quick Access</p>
                        <h4 className="mt-2 text-2xl font-semibold text-foreground">
                          Open the full economic calendar instantly.
                        </h4>
                      </div>
                      <a
                        href="https://www.forexfactory.com/calendar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
                      >
                        Open Forex Factory Calendar
                      </a>
                    </GlassPanel>

                    <GlassPanel className="p-4">
                      <div className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/70">
                        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          <p className="ml-2 text-xs uppercase tracking-[0.28em] text-muted">
                            Calendar preview
                          </p>
                        </div>
                        <iframe
                          src="https://www.forexfactory.com/calendar"
                          title="Forex Factory Calendar"
                          className="h-[620px] w-full"
                        />
                      </div>
                    </GlassPanel>
                  </div>
                </TabPage>
              )}

              {activeTab === "playbook" && (
                <TabPage
                  title="Trade Playbook"
                  description="Structured strategy library for setup names, rules, invalidations, and target logic."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4">
                    {playbook.map((setup) => (
                      <GlassPanel key={setup.id} className="p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <input
                            value={setup.name}
                            onChange={(event) =>
                              setPlaybook((current) =>
                                current.map((item) =>
                                  item.id === setup.id ? { ...item, name: event.target.value } : item,
                                ),
                              )
                            }
                            className="field-input text-lg font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPlaybook((current) => current.filter((item) => item.id !== setup.id))
                            }
                            className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-muted transition hover:bg-white/14"
                          >
                            Delete setup
                          </button>
                        </div>
                        <div className="mt-4 grid gap-4 xl:grid-cols-3">
                          <PlaybookField
                            label="Rules"
                            value={setup.rules}
                            onChange={(value) =>
                              setPlaybook((current) =>
                                current.map((item) =>
                                  item.id === setup.id ? { ...item, rules: value } : item,
                                ),
                              )
                            }
                          />
                          <PlaybookField
                            label="Invalidations"
                            value={setup.invalidations}
                            onChange={(value) =>
                              setPlaybook((current) =>
                                current.map((item) =>
                                  item.id === setup.id ? { ...item, invalidations: value } : item,
                                ),
                              )
                            }
                          />
                          <PlaybookField
                            label="Target Logic"
                            value={setup.targets}
                            onChange={(value) =>
                              setPlaybook((current) =>
                                current.map((item) =>
                                  item.id === setup.id ? { ...item, targets: value } : item,
                                ),
                              )
                            }
                          />
                        </div>
                      </GlassPanel>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setPlaybook((current) => [
                          ...current,
                          {
                            id: createId(),
                            name: "New Setup",
                            rules: "- Define entry criteria",
                            invalidations: "- Define what breaks the idea",
                            targets: "- Define target logic",
                          },
                        ])
                      }
                      className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
                    >
                      Add setup
                    </button>
                  </div>
                </TabPage>
              )}

              {activeTab === "downloads" && (
                <TabPage
                  title="Downloads & Links"
                  description="Простая вкладка с 10 готовыми кнопками. Нажал и сразу открыл или скачал. Действия кнопок меняются прямо в коде."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4">
                    <GlassPanel className="p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Code Setup</p>
                      <div className="mt-4 rounded-3xl border border-white/10 bg-white/6 p-4 font-mono text-xs leading-7 text-muted">
                        <p>{`// ИЩИ В КОДЕ: const DOWNLOAD_BUTTONS = [`}</p>
                        <p>{`// МЕНЯЙ: title, url, description, action`}</p>
                        <p>{`// action: "open" | "download"`}</p>
                        <p>{`// url: сюда вставляй свою ссылку`}</p>
                      </div>
                    </GlassPanel>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {DOWNLOAD_BUTTONS.map((button, index) => (
                        <GlassPanel key={`${button.title}-${index}`} className="p-5">
                          <p className="text-xs uppercase tracking-[0.28em] text-muted">
                            Slot {index + 1}
                          </p>
                          <h4 className="mt-3 text-xl font-semibold text-foreground">{button.title}</h4>
                          <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted">
                            {button.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDownloadButtonClick(button)}
                            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
                          >
                            {button.action === "download" ? "Скачать" : "Открыть"}
                          </button>
                        </GlassPanel>
                      ))}
                    </div>
                  </div>
                </TabPage>
              )}

              {activeTab === "analytics" && (
                <TabPage
                  title="Performance Analytics"
                  description="Advanced dashboard built from the trading journal with equity, distribution, and day-level performance views."
                  onBack={() => setActiveTab("home")}
                >
                  <div className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                      <MetricCard title="Win Rate" value={`${analytics.winRate.toFixed(1)}%`} tone="emerald" />
                      <MetricCard title="Average RR" value={`${analytics.averageRr.toFixed(2)}R`} tone="cyan" />
                      <MetricCard title="Max Drawdown" value={formatCurrency(analytics.maxDrawdown)} tone="rose" />
                      <MetricCard title="Best Day" value={formatCurrency(analytics.bestDayValue)} tone="violet" />
                      <MetricCard title="Worst Day" value={formatCurrency(analytics.worstDayValue)} tone="amber" />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                      <GlassPanel className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">PnL Over Time</p>
                        <div className="mt-4">
                          <LineChart
                            points={analytics.equityCurve}
                            labels={analytics.dates}
                          />
                        </div>
                      </GlassPanel>

                      <GlassPanel className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Win/Loss Distribution</p>
                        <div className="mt-4">
                          <BarChart
                            items={[
                              { label: "Wins", value: analytics.wins },
                              { label: "Losses", value: analytics.losses },
                              { label: "BE", value: analytics.breakEven },
                            ]}
                          />
                        </div>
                      </GlassPanel>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-3">
                      <GlassPanel className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Daily Extremes</p>
                        <div className="mt-4 space-y-3">
                          <MetricRow label="Best day" value={`${analytics.bestDay} · ${formatCurrency(analytics.bestDayValue)}`} />
                          <MetricRow label="Worst day" value={`${analytics.worstDay} · ${formatCurrency(analytics.worstDayValue)}`} />
                          <MetricRow label="Total PnL" value={formatCurrency(analytics.totalPnl)} />
                        </div>
                      </GlassPanel>
                      <GlassPanel className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Discipline Snapshot</p>
                        <div className="mt-4 space-y-4">
                          <ProgressBlock label="Win consistency" value={analytics.winRate} tone="emerald" detail={`${analytics.wins} wins`} />
                          <ProgressBlock label="Drawdown control" value={analytics.totalPnl > 0 ? Math.max(5, 100 - (analytics.maxDrawdown / Math.max(analytics.totalPnl, 1)) * 100) : 25} tone="violet" detail={formatCurrency(analytics.maxDrawdown)} />
                        </div>
                      </GlassPanel>
                      <GlassPanel className="p-5">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Data Source</p>
                        <p className="mt-4 text-sm leading-7 text-muted">
                          This analytics page is fully derived from your `Trading Journal` entries, so
                          updating the journal immediately refreshes every headline metric and chart.
                        </p>
                      </GlassPanel>
                    </div>
                  </div>
                </TabPage>
              )}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TabPage({
  title,
  description,
  onBack,
  children,
}: {
  title: string;
  description: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Tool</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-white/14"
        >
          Back to Home
        </button>
      </GlassPanel>
      {children}
    </div>
  );
}

function GlassPanel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={`glass-panel ${className}`}>{children}</section>;
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-1">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

function HomeCard({ item, onOpen }: { item: NavItem; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="glass-panel flex min-h-[180px] flex-col justify-between p-5 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-sm font-medium text-muted">
          {item.icon}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          Open
        </span>
      </div>
      <div>
        <h4 className="text-xl font-semibold text-foreground">{item.label}</h4>
        <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
      </div>
    </motion.button>
  );
}

function MetricCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "emerald" | "cyan" | "violet" | "amber" | "rose";
}) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${toneClasses[tone]} p-4`}>
      <p className="text-xs uppercase tracking-[0.28em] text-muted">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted">
      {label}: <span className="text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.26em] text-muted">{label}</span>
      {children}
    </label>
  );
}

function PlaybookField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.26em] text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        className="field-input min-h-[180px] resize-y"
      />
    </label>
  );
}

function ProgressBlock({
  label,
  value,
  tone,
  detail,
}: {
  label: string;
  value: number;
  tone: "emerald" | "cyan" | "violet" | "amber" | "rose";
  detail: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-muted">{detail}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${progressClasses[tone]}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function SessionTimeline({
  session,
  markerHour,
}: {
  session: SessionConfig;
  markerHour: number;
}) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-12 gap-1 md:grid-cols-24">
        {Array.from({ length: 24 }, (_, hour) => {
          const active = isHourInSession(hour, session.openHour, session.closeHour);
          const marker = hour === markerHour;
          return (
            <div
              key={`${session.id}-${hour}`}
              className={`relative h-7 rounded-lg border ${
                active ? "border-transparent bg-white/18" : "border-white/6 bg-white/6"
              }`}
              title={`${padHour(hour)}:00`}
            >
              {marker && (
                <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-6 gap-2 text-[10px] uppercase tracking-[0.2em] text-muted md:grid-cols-12">
        {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((hour) => (
          <span key={`${session.id}-label-${hour}`}>{padHour(hour)}</span>
        ))}
      </div>
    </div>
  );
}

function LineChart({ points, labels }: { points: number[]; labels: string[] }) {
  const normalized = normalizeSeries(points);
  const path = normalized
    .map((value, index) => `${index === 0 ? "M" : "L"} ${index * (320 / Math.max(points.length - 1, 1))} ${120 - value * 100}`)
    .join(" ");

  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
      <svg viewBox="0 0 320 140" className="h-[220px] w-full">
        <defs>
          <linearGradient id="equityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(110,231,183,0.7)" />
            <stop offset="100%" stopColor="rgba(110,231,183,0)" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80, 100].map((line) => (
          <line
            key={`grid-${line}`}
            x1="0"
            y1={140 - line}
            x2="320"
            y2={140 - line}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 6"
          />
        ))}
        <path d={`${path} L 320 140 L 0 140 Z`} fill="url(#equityGradient)" opacity="0.6" />
        <path d={path} fill="none" stroke="rgba(110,231,183,0.95)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
        {labels.map((label, index) => (
          <span key={`${label}-${index}`} className="rounded-full bg-white/6 px-3 py-1">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChart({ items }: { items: Array<{ label: string; value: number }> }) {
  const max = Math.max(...items.map((item) => Math.abs(item.value)), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const width = (Math.abs(item.value) / max) * 100;
        const positive = item.value >= 0;
        return (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-foreground">{item.label}</span>
              <span className="text-muted">{Number.isInteger(item.value) ? item.value : item.value.toFixed(2)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/8">
              <div
                className={`h-full rounded-full ${positive ? "bg-[var(--accent)]" : "bg-rose-400/80"}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderMarkdownPreview(value: string) {
  const lines = value.split("\n").filter((line, index, array) => line.trim() !== "" || array[index - 1]?.trim() !== "");
  return lines.map((line, index) => {
    if (line.startsWith("## ")) {
      return (
        <h5 key={`${line}-${index}`} className="text-lg font-semibold text-foreground">
          {line.replace("## ", "")}
        </h5>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <p key={`${line}-${index}`} className="text-sm text-muted">
          • {line.replace("- ", "")}
        </p>
      );
    }
    return (
      <p key={`${line}-${index}`} className="text-sm text-muted">
        {line}
      </p>
    );
  });
}

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      setReady(true);
      return;
    }

    try {
      setState(JSON.parse(raw) as T);
    } catch {
      window.localStorage.removeItem(key);
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, ready, state]);

  return [state, setState] as const;
}

function getJournalMetrics(trades: JournalTrade[]) {
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const wins = trades.filter((trade) => trade.type === "Win").length;
  const total = trades.length;
  const averageRr =
    trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.rr, 0) / trades.length : 0;

  return {
    totalPnl,
    winRate: total > 0 ? (wins / total) * 100 : 0,
    averageRr,
  };
}

function getSessionStats(trades: JournalTrade[]): SessionStats[] {
  return SESSION_CONFIGS.map((session) => {
    const sessionTrades = trades.filter((trade) => trade.session === session.id);
    const wins = sessionTrades.filter((trade) => trade.type === "Win").length;
    return {
      session: session.id,
      trades: sessionTrades.length,
      wins,
      pnl: sessionTrades.reduce((sum, trade) => sum + trade.pnl, 0),
    };
  });
}

function getBacktestMetrics(trades: BacktestTrade[]) {
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const wins = trades.filter((trade) => trade.pnl > 0).length;
  const expectancy =
    trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.rr, 0) / trades.length : 0;

  return {
    totalPnl,
    winRate: trades.length > 0 ? (wins / trades.length) * 100 : 0,
    expectancy,
  };
}

function getAnalytics(trades: JournalTrade[]) {
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const averageRr =
    trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.rr, 0) / trades.length : 0;
  const wins = trades.filter((trade) => trade.type === "Win").length;
  const losses = trades.filter((trade) => trade.type === "Loss").length;
  const breakEven = trades.filter((trade) => trade.type === "BE").length;
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;

  const dailyMap = new Map<string, number>();
  trades.forEach((trade) => {
    dailyMap.set(trade.date, (dailyMap.get(trade.date) ?? 0) + trade.pnl);
  });

  const sortedDays = [...dailyMap.entries()].sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
  const equityCurve = buildEquityCurve(sortedDays.map(([, pnl]) => pnl));
  const dates = sortedDays.map(([date]) => date);

  let running = 0;
  let peak = 0;
  let maxDrawdown = 0;
  sortedDays.forEach(([, pnl]) => {
    running += pnl;
    peak = Math.max(peak, running);
    maxDrawdown = Math.max(maxDrawdown, peak - running);
  });

  const bestDayEntry = sortedDays.reduce(
    (best, entry) => (entry[1] > best[1] ? entry : best),
    sortedDays[0] ?? ["No data", 0],
  );
  const worstDayEntry = sortedDays.reduce(
    (worst, entry) => (entry[1] < worst[1] ? entry : worst),
    sortedDays[0] ?? ["No data", 0],
  );

  return {
    totalPnl,
    averageRr,
    wins,
    losses,
    breakEven,
    winRate,
    equityCurve,
    dates,
    maxDrawdown,
    bestDay: bestDayEntry[0],
    bestDayValue: bestDayEntry[1],
    worstDay: worstDayEntry[0],
    worstDayValue: worstDayEntry[1],
  };
}

function calculateLotSize(inputs: LotCalculatorState) {
  const riskAmount = (inputs.accountBalance * inputs.riskPercent) / 100;

  if (inputs.assetType === "gold") {
    const valuePerUnit = 100;
    const lotSize = riskAmount / Math.max(inputs.stopLoss * valuePerUnit, 0.0001);
    return {
      riskAmount,
      lotSize,
      valuePerUnit,
      contractLabel: "100 oz / lot",
      explanation:
        "Gold sizing assumes 1 standard lot controls 100 ounces, so each 1.0 point move risks about $100 per lot.",
    };
  }

  if (inputs.assetType === "index") {
    const valuePerUnit = 1;
    const lotSize = riskAmount / Math.max(inputs.stopLoss * valuePerUnit, 0.0001);
    return {
      riskAmount,
      lotSize,
      valuePerUnit,
      contractLabel: "$1 / point",
      explanation:
        "Index sizing uses a simple CFD-style $1 per point per lot model. Adjust against your broker contract size before execution.",
    };
  }

  const pipSize = inputs.symbol.includes("JPY") ? 0.01 : 0.0001;
  const contractSize = 100000;
  let pipValuePerLot = contractSize * pipSize;

  if (inputs.symbol.startsWith("USD")) {
    pipValuePerLot = (contractSize * pipSize) / Math.max(inputs.price, 0.0001);
  } else if (!inputs.symbol.endsWith("USD")) {
    pipValuePerLot = (contractSize * pipSize) / Math.max(inputs.price, 0.0001);
  }

  const lotSize = riskAmount / Math.max(inputs.stopLoss * pipValuePerLot, 0.0001);

  return {
    riskAmount,
    lotSize,
    valuePerUnit: pipValuePerLot,
    contractLabel: "100k units / lot",
    explanation:
      "Forex sizing uses standard-lot pip valuation for a USD account. USD-quoted pairs use direct pip value, while USD base pairs are adjusted by price.",
  };
}

function calculateRiskManager(inputs: RiskManagerState) {
  const dailyRiskLimit = (inputs.accountBalance * inputs.dailyRiskPercent) / 100;
  const perTradeRisk = (inputs.accountBalance * inputs.perTradeRiskPercent) / 100;
  const maxTrades = Math.max(0, Math.floor(dailyRiskLimit / Math.max(perTradeRisk, 0.0001)));
  const drawdownPercent =
    inputs.startingEquity > 0
      ? ((inputs.startingEquity - inputs.currentEquity) / inputs.startingEquity) * 100
      : 0;
  const usedRisk = Math.max(0, inputs.startingEquity - inputs.currentEquity);
  const usedRiskPercent = dailyRiskLimit > 0 ? (usedRisk / dailyRiskLimit) * 100 : 0;

  return {
    dailyRiskLimit,
    maxTrades,
    drawdownPercent,
    usedRiskPercent,
    bufferLeft: Math.max(0, dailyRiskLimit - usedRisk),
  };
}

function buildEquityCurve(values: number[]) {
  const curve: number[] = [];
  let running = 0;
  values.forEach((value) => {
    running += value;
    curve.push(running);
  });
  return curve.length > 0 ? curve : [0];
}

function normalizeSeries(points: number[]) {
  if (points.length === 0) {
    return [0];
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  if (max === min) {
    return points.map(() => 0.5);
  }
  return points.map((point) => (point - min) / (max - min));
}

function isSessionOpen(session: SessionConfig, now: Date) {
  const localHour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: session.timezone,
    }).format(now),
  );

  return isHourInSession(localHour, session.openHour, session.closeHour);
}

function getHourForZoneAtUtcHour(timezone: string, utcHour: number) {
  const base = new Date();
  const utcDate = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), utcHour, 0, 0),
  );

  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).format(utcDate),
  );
}

function isHourInSession(hour: number, openHour: number, closeHour: number) {
  if (openHour < closeHour) {
    return hour >= openHour && hour < closeHour;
  }
  return hour >= openHour || hour < closeHour;
}

function formatTime(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function padHour(hour: number) {
  return hour.toString().padStart(2, "0");
}

function formatLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function handleDownloadButtonClick(button: DownloadButton) {
  if (!button.url) {
    return;
  }

  if (button.action === "download") {
    const link = document.createElement("a");
    link.href = button.url;
    link.download = "";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  window.open(button.url, "_blank", "noopener,noreferrer");
}

function updateNumberState(value: string, onChange: (value: number) => void) {
  const parsed = Number(value);
  if (!Number.isNaN(parsed)) {
    onChange(parsed);
  }
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

const toneClasses = {
  emerald: "from-emerald-400/18 to-emerald-200/4",
  cyan: "from-cyan-400/18 to-sky-200/4",
  violet: "from-violet-400/18 to-indigo-200/4",
  amber: "from-amber-300/18 to-orange-200/4",
  rose: "from-rose-400/18 to-pink-200/4",
};

const progressClasses = {
  emerald: "from-emerald-300 to-emerald-500",
  cyan: "from-sky-300 to-cyan-500",
  violet: "from-violet-300 to-indigo-500",
  amber: "from-amber-300 to-orange-500",
  rose: "from-rose-300 to-pink-500",
};
