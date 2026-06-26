import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CatAssistant } from "@/components/CatAssistant";
import {
  MessagesSquare,
  Bookmark,
  Plus,
  Search,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Pin,
  Filter,
  Settings,
  Bell,
  MessageCircle,
  Eye,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  Hash,
  Mail,
  X,
  Bold,
  Italic,
  Link2,
  ListOrdered,
  List,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
  Tag,
  ArrowLeft,
  Reply,
  Quote,
  CornerDownRight,
} from "lucide-react";

export const Route = createFileRoute("/foros")({
  head: () => ({
    meta: [
      { title: "Ágora — Foros colaborativos" },
      { name: "description", content: "Foros con subforos anidados y estilo glassmorphism, en modo claro y oscuro." },
      { property: "og:title", content: "Ágora — Foros colaborativos" },
      { property: "og:description", content: "Espacios de conversación con clasificación por subforos." },
    ],
  }),
  component: ForosPage,
});

type Subforum = {
  id: string;
  initials: string;
  name: string;
  org: string;
  unread?: number;
  color: string;
};

type Forum = {
  id: string;
  name: string;
  description: string;
  subforums: Subforum[];
};

const forums: Forum[] = [
  {
    id: "ops",
    name: "Operaciones",
    description: "Coordinación logística y de proveedores",
    subforums: [
      { id: "ln", initials: "LN", name: "Cadena de suministro", org: "Logística Norte", unread: 3, color: "from-rose-400 to-orange-400" },
      { id: "vt", initials: "VT", name: "Proveedores TI", org: "Vértice TI", color: "from-sky-400 to-indigo-500" },
      { id: "dl", initials: "DL", name: "Distribución LATAM", org: "Red de socios", unread: 1, color: "from-emerald-400 to-teal-500" },
    ],
  },
  {
    id: "proj",
    name: "Proyectos",
    description: "Iniciativas activas entre equipos",
    subforums: [
      { id: "ba", initials: "BA", name: "Proyecto Atlas", org: "Banco Andino", unread: 5, color: "from-violet-400 to-fuchsia-500" },
      { id: "nx", initials: "NX", name: "Lanzamiento Nexus", org: "Nordia", color: "from-amber-400 to-pink-500" },
    ],
  },
  {
    id: "qa",
    name: "Calidad y procesos",
    description: "Normativa, auditorías y mejora continua",
    subforums: [
      { id: "cc", initials: "CC", name: "Comité de Calidad", org: "ISO 9001", color: "from-cyan-400 to-blue-500" },
      { id: "au", initials: "AU", name: "Auditoría interna", org: "Nordia", color: "from-slate-400 to-slate-600" },
    ],
  },
];

type Thread = {
  id: number;
  title: string;
  author: string;
  authorInitials: string;
  org: string;
  time: string;
  tags: { label: string; tone: string }[];
  replies: number;
  views: number;
  likes: number;
  pinned?: boolean;
  excerpt: string;
};

const threads: Thread[] = [
  {
    id: 1,
    title: "Retraso en la ruta R-204: replanteamiento de entregas de marzo",
    author: "Ana Requena",
    authorInitials: "AR",
    org: "Logística Norte",
    time: "Hace 12 min",
    tags: [
      { label: "Urgente", tone: "bg-rose-500/15 text-rose-500 ring-rose-500/30" },
      { label: "Logística", tone: "bg-amber-400/15 text-amber-600 ring-amber-400/30 dark:text-amber-300" },
    ],
    replies: 7,
    views: 124,
    likes: 12,
    pinned: true,
    excerpt: "Tenemos un retraso confirmado de 36h en la ruta R-204. Propongo reasignar las entregas críticas a la ruta R-118…",
  },
  {
    id: 2,
    title: "Nuevo protocolo de etiquetado de pallets — feedback antes del viernes",
    author: "Elena Costa",
    authorInitials: "EC",
    org: "Logística Norte",
    time: "Hace 1 h",
    tags: [
      { label: "Revisión", tone: "bg-violet-500/15 text-violet-500 ring-violet-500/30" },
      { label: "Logística", tone: "bg-amber-400/15 text-amber-600 ring-amber-400/30 dark:text-amber-300" },
    ],
    replies: 4,
    views: 58,
    likes: 6,
    excerpt: "Adjunto la propuesta v3 con el cambio de QR y los códigos de zona. Necesito comentarios del equipo de recepción…",
  },
  {
    id: 3,
    title: "Facturación de febrero: discrepancia en 3 albaranes",
    author: "Marc Soler",
    authorInitials: "MS",
    org: "Nordia",
    time: "Hace 4 h",
    tags: [
      { label: "Facturación", tone: "bg-sky-500/15 text-sky-500 ring-sky-500/30" },
    ],
    replies: 2,
    views: 41,
    likes: 3,
    excerpt: "He detectado diferencias entre los albaranes 2041, 2058 y 2073 frente a la factura emitida…",
  },
  {
    id: 4,
    title: "Resumen de la reunión operativa semanal",
    author: "Laura Vidal",
    authorInitials: "LV",
    org: "Nordia",
    time: "Hace 4 días",
    tags: [
      { label: "Logística", tone: "bg-amber-400/15 text-amber-600 ring-amber-400/30 dark:text-amber-300" },
    ],
    replies: 11,
    views: 230,
    likes: 18,
    excerpt: "Cierro el resumen con los acuerdos: 1) revisar SLA con transportistas 2) actualizar plantilla de incidencias…",
  },
];

type Post = {
  id: number;
  author: string;
  initials: string;
  org: string;
  role?: string;
  time: string;
  body: string;
  likes: number;
  color: string;
  isOp?: boolean;
  replyTo?: string;
};

const threadPostsByThread: Record<number, Post[]> = {
  1: [
    {
      id: 1,
      author: "Ana Requena",
      initials: "AR",
      org: "Logística Norte",
      role: "Autora · Coord. operaciones",
      time: "Hace 12 min",
      isOp: true,
      color: "from-rose-400 to-orange-400",
      likes: 12,
      body: "Confirmado el retraso de 36h en la ruta R-204 por el cierre temporal del paso fronterizo. Propongo:\n\n1) Reasignar las entregas críticas (clientes A1, A3, B7) a la ruta R-118.\n2) Avisar a recepción de Nordia para reorganizar los turnos del jueves.\n3) Revisar penalizaciones contractuales con el transportista.\n\n¿Cómo lo veis desde planificación?",
    },
    {
      id: 2,
      author: "Marc Soler",
      initials: "MS",
      org: "Nordia",
      role: "Planificación",
      time: "Hace 9 min",
      color: "from-sky-400 to-indigo-500",
      likes: 4,
      body: "Por planificación lo veo viable. La R-118 tiene capacidad para asumir A1 y A3, pero B7 va muy justa. ¿Podríamos partir B7 entre R-118 y R-205?",
    },
    {
      id: 3,
      author: "Elena Costa",
      initials: "EC",
      org: "Logística Norte",
      role: "Recepción",
      time: "Hace 4 min",
      color: "from-emerald-400 to-teal-500",
      likes: 2,
      replyTo: "Marc Soler",
      body: "Desde recepción podemos reorganizar los turnos del jueves sin problema si confirmamos antes de las 18:00 de hoy. Mejor que enviéis el plan definitivo por aquí para dejar traza.",
    },
    {
      id: 4,
      author: "Laura Vidal",
      initials: "LV",
      org: "Nordia",
      role: "Admin",
      time: "Hace 1 min",
      color: "from-fuchsia-400 to-violet-500",
      likes: 1,
      body: "Apruebo el plan. Marc, prepara la propuesta de reparto B7 y la cuelgas aquí en cuanto la tengas. Yo me encargo de hablar con el transportista por el SLA.",
    },
  ],
};

function getThreadPosts(threadId: number): Post[] {
  return threadPostsByThread[threadId] ?? threadPostsByThread[1];
}

function ForosPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [openForums, setOpenForums] = useState<Record<string, boolean>>({ ops: true, proj: true, qa: false });
  const [activeSub, setActiveSub] = useState<string>("ln");
  const [filter, setFilter] = useState<"todos" | "sin-leer" | "fijados">("todos");
  const [composeOpen, setComposeOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const activeSubforum = useMemo(() => {
    for (const f of forums) {
      const s = f.subforums.find((x) => x.id === activeSub);
      if (s) return { forum: f, sub: s };
    }
    return { forum: forums[0], sub: forums[0].subforums[0] };
  }, [activeSub]);

  const visibleThreads = filter === "fijados" ? threads.filter((t) => t.pinned) : threads;

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-[1500px] gap-4 p-4 lg:p-6">
        {/* Sidebar */}
        <aside className="glass-panel hidden w-72 shrink-0 flex-col rounded-3xl p-4 lg:flex">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <MessagesSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">Ágora</h1>
              <p className="text-xs text-muted-foreground">Nordia · Espacio compartido</p>
            </div>
          </div>



          <nav className="mb-4 space-y-1">
            <SidebarItem icon={Mail} label="Sin leer" count={6} />
            <SidebarItem icon={Bookmark} label="Guardados" />
          </nav>

          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Foros</span>
            <button className="rounded-lg p-1 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {forums.map((forum) => {
              const open = openForums[forum.id];
              return (
                <div key={forum.id}>
                  <button
                    onClick={() => setOpenForums((s) => ({ ...s, [forum.id]: !s[forum.id] }))}
                    className="flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
                  >
                    {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    <Hash className="h-3 w-3" />
                    {forum.name}
                  </button>
                  {open && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/60 pl-2">
                      {forum.subforums.map((sub) => {
                        const active = sub.id === activeSub;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setActiveSub(sub.id)}
                            className={`group flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition ${
                              active
                                ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
                                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                            }`}
                          >
                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${sub.color} text-[10px] font-bold text-white shadow`}>
                              {sub.initials}
                            </span>
                            <span className="flex-1 truncate">
                              <span className="block truncate text-sm font-medium leading-tight">{sub.name}</span>
                              <span className="block truncate text-[11px] text-muted-foreground">{sub.org}</span>
                            </span>
                            {sub.unread ? (
                              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                {sub.unread}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-foreground/[0.04] p-2.5 ring-1 ring-border/60">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-500 text-xs font-bold text-white">LV</div>
            <div className="flex-1 leading-tight">
              <div className="text-sm font-medium">Laura Vidal</div>
              <div className="text-[11px] text-muted-foreground">Nordia · Admin</div>
            </div>
            <button className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Top bar */}
          <div className="glass-panel flex items-center gap-3 rounded-3xl px-4 py-3">
            <Link to="/" className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/60 transition hover:bg-foreground/5 hover:text-foreground">
              ← Nexus
            </Link>
            <div className="glass-soft flex flex-1 items-center gap-2 rounded-2xl px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar hilos, autores, etiquetas…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded-md bg-foreground/10 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
            </div>
            <button className="rounded-xl p-2 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {activeThreadId ? (
            <ThreadDetail
              thread={threads.find((t) => t.id === activeThreadId)!}
              forumName={activeSubforum.forum.name}
              subforumName={activeSubforum.sub.name}
              onBack={() => setActiveThreadId(null)}
            />
          ) : (
          <>
          {/* Subforum header */}
          <div className="overflow-hidden rounded-3xl bg-card/70 ring-1 ring-border/80 backdrop-blur-xl">
            <div className="h-1 bg-primary/80" />
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg`}>
                    {activeSubforum.sub.initials}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {activeSubforum.forum.name} · {activeSubforum.sub.org}
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">{activeSubforum.sub.name}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                      Coordinación operativa, incidencias y acuerdos entre los equipos del subforo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setComposeOpen(true)}
                  className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Crear hilo
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-foreground/[0.03] px-6 py-3">
              {(["todos", "sin-leer", "fijados"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow shadow-primary/30"
                      : "bg-foreground/[0.04] text-muted-foreground ring-1 ring-border/60 hover:text-foreground"
                  }`}
                >
                  {f.replace("-", " ")}
                </button>
              ))}
              <span className="mx-1 text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{visibleThreads.length} hilos · Recientes</span>
              <div className="ml-auto flex items-center gap-2">
                {["Urgente", "Logística", "Revisión", "Facturación"].map((t) => (
                  <span key={t} className="rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border/60">
                    #{t}
                  </span>
                ))}
                <button className="rounded-xl p-1.5 text-muted-foreground ring-1 ring-border/60 transition hover:bg-foreground/5 hover:text-foreground">
                  <Filter className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Thread list */}
          <div className="space-y-3">
            {visibleThreads.map((t) => (
              <article
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className="glass-panel group cursor-pointer rounded-3xl p-5 transition hover:ring-1 hover:ring-primary/30"
              >
                <div className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white shadow">
                    {t.authorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{t.author}</span>
                      <span>·</span>
                      <span>{t.org}</span>
                      <span>·</span>
                      <span>{t.time}</span>
                      {t.pinned && (
                        <span className="ml-1 flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500 ring-1 ring-amber-400/30">
                          <Pin className="h-3 w-3" /> Fijado
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground group-hover:text-primary">
                      {t.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.excerpt}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {t.tags.map((tag) => (
                        <span key={tag.label} className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${tag.tone}`}>
                          {tag.label}
                        </span>
                      ))}
                      <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" /> {t.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> {t.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" /> {t.likes}
                        </span>
                        <button className="rounded-lg p-1 transition hover:bg-foreground/5 hover:text-foreground">
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                        <button className="rounded-lg p-1 transition hover:bg-foreground/5 hover:text-foreground">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          </>
          )}
        </main>
      </div>

      {composeOpen && (
        <CreateThreadModal
          subforumName={activeSubforum.sub.name}
          forumName={activeSubforum.forum.name}
          onClose={() => setComposeOpen(false)}
        />
      )}

      <CatAssistant />
    </div>
  );
}

function SidebarItem({ icon: Icon, label, count }: { icon: React.ElementType; label: string; count?: number }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground">
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {count ? (
        <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold">{count}</span>
      ) : null}
    </button>
  );
}

function CreateThreadModal({
  subforumName,
  forumName,
  onClose,
}: {
  subforumName: string;
  forumName: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [pinned, setPinned] = useState(false);

  const availableTags = ["Urgente", "Logística", "Revisión", "Facturación", "Anuncio", "Pregunta"];

  const toggleTag = (t: string) =>
    setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const addCustomTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags((s) => [...s, v]);
    setTagInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 p-4 backdrop-blur-md sm:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="glass-panel relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {forumName} · {subforumName}
            </div>
            <h3 className="truncate text-base font-semibold tracking-tight">Crear nuevo hilo</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume el tema del hilo en una frase…"
              className="glass-soft w-full rounded-2xl px-4 py-3 text-sm outline-none ring-1 ring-border/60 placeholder:text-muted-foreground focus:ring-primary/50"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Contenido</label>
              <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.04] p-1 ring-1 ring-border/60">
                {[Bold, Italic, Link2, List, ListOrdered].map((Icon, i) => (
                  <button
                    key={i}
                    className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Describe el contexto, comparte datos o lanza la pregunta al equipo…"
              className="glass-soft w-full resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed outline-none ring-1 ring-border/60 placeholder:text-muted-foreground focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Tag className="h-3 w-3" /> Etiquetas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((t) => {
                const active = tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition ${
                      active
                        ? "bg-primary text-primary-foreground ring-primary/40"
                        : "bg-foreground/[0.04] text-muted-foreground ring-border/60 hover:text-foreground"
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
              {tags
                .filter((t) => !availableTags.includes(t))
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground ring-1 ring-primary/40"
                  >
                    #{t}
                  </button>
                ))}
              <div className="flex items-center gap-1 rounded-full bg-foreground/[0.04] px-2 py-0.5 ring-1 ring-border/60">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag();
                    }
                  }}
                  placeholder="nueva…"
                  className="w-20 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={addCustomTag}
                  className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="Añadir etiqueta"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-foreground/[0.03] px-3 py-2.5 text-sm ring-1 ring-border/60">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 rounded accent-primary"
            />
            <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Fijar este hilo en la parte superior del subforo</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-foreground/[0.03] px-6 py-3">
          <div className="flex items-center gap-1">
            {[Paperclip, ImageIcon, Smile].map((Icon, i) => (
              <button
                key={i}
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-2xl px-4 py-2 text-sm font-medium text-muted-foreground ring-1 ring-border/60 transition hover:bg-foreground/5 hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              disabled={!title.trim()}
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" /> Publicar hilo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadDetail({
  thread,
  forumName,
  subforumName,
  onBack,
}: {
  thread: Thread;
  forumName: string;
  subforumName: string;
  onBack: () => void;
}) {
  const posts = getThreadPosts(thread.id);
  const [reply, setReply] = useState("");

  return (
    <div className="flex flex-col gap-4">
      {/* Thread header */}
      <div className="overflow-hidden rounded-3xl bg-card/70 ring-1 ring-border/80 backdrop-blur-xl">
        <div className="h-1 bg-primary/80" />
        <div className="p-6">
          <button
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/60 transition hover:bg-foreground/5 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al subforo
          </button>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {forumName} · {subforumName}
          </div>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight">{thread.title}</h2>
            {thread.pinned && (
              <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-500 ring-1 ring-amber-400/30">
                <Pin className="h-3 w-3" /> Fijado
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {thread.tags.map((tag) => (
              <span
                key={tag.label}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${tag.tone}`}
              >
                {tag.label}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> {posts.length} mensajes
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {thread.views}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" /> {thread.likes}
              </span>
              <button className="rounded-lg p-1 transition hover:bg-foreground/5 hover:text-foreground">
                <Share2 className="h-3.5 w-3.5" />
              </button>
              <button className="rounded-lg p-1 transition hover:bg-foreground/5 hover:text-foreground">
                <Bookmark className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((p, idx) => (
          <article
            key={p.id}
            className={`glass-panel rounded-3xl p-5 ${p.isOp ? "ring-1 ring-primary/30" : ""}`}
          >
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${p.color} text-xs font-bold text-white shadow`}
                >
                  {p.initials}
                </div>
                <span className="rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border/60">
                  #{idx + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{p.author}</span>
                  {p.isOp && (
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/30">
                      OP
                    </span>
                  )}
                  <span>·</span>
                  <span>{p.org}</span>
                  {p.role && (
                    <>
                      <span>·</span>
                      <span>{p.role}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{p.time}</span>
                </div>
                {p.replyTo && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground ring-1 ring-border/60">
                    <CornerDownRight className="h-3 w-3" />
                    En respuesta a <span className="font-medium text-foreground">{p.replyTo}</span>
                  </div>
                )}
                <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {p.body}
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-foreground/5 hover:text-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" /> {p.likes}
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-foreground/5 hover:text-foreground">
                    <Reply className="h-3.5 w-3.5" /> Responder
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-foreground/5 hover:text-foreground">
                    <Quote className="h-3.5 w-3.5" /> Citar
                  </button>
                  <button className="ml-auto rounded-lg p-1 transition hover:bg-foreground/5 hover:text-foreground">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Reply box */}
      <div className="glass-panel rounded-3xl p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Reply className="h-3.5 w-3.5" /> Responder al hilo
        </div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          placeholder="Escribe tu respuesta…"
          className="glass-soft w-full resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed outline-none ring-1 ring-border/60 placeholder:text-muted-foreground focus:ring-primary/50"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[Bold, Italic, Link2, Paperclip, ImageIcon, Smile].map((Icon, i) => (
              <button
                key={i}
                className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <button
            disabled={!reply.trim()}
            onClick={() => setReply("")}
            className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Publicar respuesta
          </button>
        </div>
      </div>
    </div>
  );
}
