import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Inbox,
  Send,
  Archive,
  Trash2,
  FileText,
  Star,
  Newspaper,
  Calendar,
  CheckSquare,
  Tag,
  Search,
  Settings,
  HelpCircle,
  Grid3x3,
  Filter,
  PenSquare,
  Sun,
  Moon,
  Paperclip,
  Reply,
  Forward,
  MoreHorizontal,
  ChevronLeft,
  Plus,
  X,
  Image as ImageIcon,
  Smile,
  Link2,
  Bold,
  Italic,
  Underline,
  List,
  Send as SendIcon,
  Save,
  Trash,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus — Mensajería moderna" },
      { name: "description", content: "Sistema de intercambio de mensajes con diseño glassmorphism, en modo claro y oscuro." },
      { property: "og:title", content: "Nexus — Mensajería moderna" },
      { property: "og:description", content: "Bandeja de entrada elegante con efecto cristal." },
    ],
  }),
  component: Inbox404,
});

type Folder = { icon: typeof Inbox; label: string; count?: number };

const folders: Folder[] = [
  { icon: Inbox, label: "Bandeja de Entrada", count: 8 },
  { icon: Newspaper, label: "Bandeja News", count: 1 },
  { icon: Star, label: "Favoritos", count: 5 },
  { icon: Send, label: "Bandeja de Salida" },
  { icon: Send, label: "Enviados" },
  { icon: Archive, label: "Archivados", count: 4 },
  { icon: FileText, label: "Borradores" },
  { icon: Trash2, label: "Papelera", count: 1 },
];

const labels = [
  { color: "bg-rose-500", name: "URGENTE", count: 1 },
  { color: "bg-amber-400", name: "Trabajo" },
  { color: "bg-emerald-400", name: "Personal" },
  { color: "bg-sky-400", name: "Finanzas" },
];

type Message = {
  id: number;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  tag?: { label: string; tone: "urgent" | "work" | "info" | "neutral" };
  unread?: boolean;
  starred?: boolean;
  hasAttachment?: boolean;
  initials: string;
  avatarColor: string;
};

const messages: Message[] = [
  {
    id: 1,
    sender: "Sofía Jiménez",
    email: "sofia.j@empresa.com",
    subject: "Actualización del proyecto Alborada — revisión final",
    preview: "Hola equipo, adjunto los entregables del sprint 12. Necesitamos cerrar la revisión antes del viernes para...",
    time: "11:52",
    tag: { label: "Urgente", tone: "urgent" },
    unread: true,
    starred: true,
    hasAttachment: true,
    initials: "SJ",
    avatarColor: "from-rose-400 to-pink-500",
  },
  {
    id: 2,
    sender: "Marcos Vinicius",
    email: "marcos@diseño.studio",
    subject: "Diseños finales del rebranding",
    preview: "Te envío los archivos en alta resolución más la guía de marca actualizada. Cualquier ajuste me dices.",
    time: "10:40",
    tag: { label: "Trabajo", tone: "work" },
    unread: true,
    hasAttachment: true,
    initials: "MV",
    avatarColor: "from-violet-400 to-indigo-500",
  },
  {
    id: 3,
    sender: "Banda News",
    email: "news@digest.io",
    subject: "Tu resumen semanal #44 — IA, diseño y producto",
    preview: "Lo mejor de la semana: nuevos modelos, herramientas para diseñadores y entrevistas exclusivas.",
    time: "Ayer",
    tag: { label: "Newsletter", tone: "info" },
    initials: "BN",
    avatarColor: "from-sky-400 to-cyan-500",
  },
  {
    id: 4,
    sender: "Finanzas",
    email: "finanzas@empresa.com",
    subject: "Comprobante de pago recibido #23",
    preview: "Hemos confirmado tu pago por el monto de $2,450.00 USD. Puedes descargar tu factura desde el panel.",
    time: "Ayer",
    starred: true,
    initials: "FN",
    avatarColor: "from-emerald-400 to-teal-500",
  },
  {
    id: 5,
    sender: "Soporte Técnico",
    email: "soporte@empresa.com",
    subject: "Ticket #8821 resuelto",
    preview: "Hemos cerrado tu solicitud sobre la integración de API. Si vuelves a tener problemas, no dudes en escribir.",
    time: "10 Jun",
    tag: { label: "Soporte", tone: "neutral" },
    initials: "ST",
    avatarColor: "from-amber-400 to-orange-500",
  },
  {
    id: 6,
    sender: "Logística Global",
    email: "envios@logistica.com",
    subject: "Tu envío #98223 está en camino",
    preview: "El paquete fue despachado y llegará entre hoy y mañana. Sigue tu pedido en tiempo real.",
    time: "9 Jun",
    initials: "LG",
    avatarColor: "from-fuchsia-400 to-purple-500",
  },
  {
    id: 7,
    sender: "admin@example.com",
    email: "admin@example.com",
    subject: "Re: Solicitud aprobación #4",
    preview: "Aprobado. Procede con la siguiente fase del proceso y mantén informado al equipo.",
    time: "8 Jun",
    initials: "AD",
    avatarColor: "from-slate-400 to-slate-600",
  },
];

function Inbox404() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedFolder, setSelectedFolder] = useState("Bandeja de Entrada");
  const [selectedId, setSelectedId] = useState<number>(1);
  const [composeOpen, setComposeOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const selected = messages.find((m) => m.id === selectedId)!;

  const tagStyles: Record<string, string> = {
    urgent: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
    work: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
    info: "bg-sky-500/15 text-sky-700 ring-sky-500/20 dark:text-sky-300",
    neutral: "bg-muted text-muted-foreground ring-border",
  };

  return (
    <div className="min-h-screen w-full p-3 sm:p-6">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-3rem)] max-w-[1600px] gap-4">
        {/* Sidebar */}
        <aside className="glass-panel hidden lg:flex w-72 shrink-0 flex-col rounded-3xl p-5">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/30">
              <div className="size-4 rounded-md bg-primary-foreground/90" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">Nexus</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Inbox · v2
              </span>
            </div>
          </div>

          {/* Compose */}
          <button
            onClick={() => setComposeOpen(true)}
            className="group mb-6 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
          >
            <PenSquare className="size-4" />
            Redactar
          </button>

          {/* Folders */}
          <nav className="space-y-0.5 overflow-y-auto pr-1">
            {folders.map((f) => {
              const active = selectedFolder === f.label;
              const Icon = f.icon;
              return (
                <button
                  key={f.label}
                  onClick={() => setSelectedFolder(f.label)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all ${
                    active
                      ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 dark:bg-primary/15"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{f.label}</span>
                  </span>
                  {f.count != null && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active ? "bg-primary/20 text-primary" : "bg-foreground/5 text-muted-foreground"
                      }`}
                    >
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="my-4 flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Mis carpetas
              </span>
              <button className="grid size-5 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                <Plus className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5">
              <span className="flex items-center gap-3">
                <Inbox className="size-4" /> Mensajes admin
              </span>
            </div>

            <div className="mt-4 space-y-2 px-3 py-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Calendario</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tareas</span>
              </div>
            </div>

            <div className="my-4 flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Etiquetas
              </span>
              <button className="grid size-5 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                <Plus className="size-3.5" />
              </button>
            </div>

            {labels.map((l) => (
              <div
                key={l.name}
                className="flex items-center justify-between rounded-xl px-3 py-1.5 text-xs text-muted-foreground hover:bg-foreground/5"
              >
                <span className="flex items-center gap-2.5">
                  <span className={`size-2 rounded-full ${l.color}`} />
                  {l.name}
                </span>
                {l.count != null && (
                  <span className="rounded-full bg-foreground/5 px-1.5 py-0.5 text-[10px] font-bold">
                    {l.count}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Profile */}
          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-border/60 bg-foreground/[0.02] p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
              ER
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Elena Ríos</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                Pro Plan
              </p>
            </div>
            <button className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5">
              <Settings className="size-4" />
            </button>
          </div>
        </aside>

        {/* Message List */}
        <section className="glass-panel flex w-full flex-col overflow-hidden rounded-3xl md:w-[420px] md:shrink-0">
          {/* Top bar */}
          <header className="flex items-center gap-2 border-b border-border/60 p-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="En todas las bandejas..."
                className="w-full rounded-xl border border-transparent bg-foreground/5 py-2 pl-10 pr-10 text-sm outline-none transition focus:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/20"
              />
              <Filter className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-foreground/[0.03] text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Cambiar tema"
            >
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
          </header>

          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <div className="flex items-center gap-2">
              <Inbox className="size-4 text-primary" />
              <h1 className="text-sm font-bold">{selectedFolder}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{messages.length} mensajes</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                Sin leer
              </span>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1.5">
              {messages.map((m) => {
                const active = selectedId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={`group relative w-full rounded-2xl p-3.5 text-left transition-all ${
                      active
                        ? "bg-gradient-to-br from-primary/10 to-primary-glow/5 ring-1 ring-primary/30 shadow-sm"
                        : "hover:bg-foreground/[0.04]"
                    }`}
                  >
                    {m.unread && !active && (
                      <span className="absolute left-1 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <div className="flex items-start gap-3">
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${m.avatarColor} text-xs font-bold text-white shadow-sm`}
                      >
                        {m.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`truncate text-sm ${
                              m.unread ? "font-bold text-foreground" : "font-semibold text-foreground/90"
                            }`}
                          >
                            {m.sender}
                          </span>
                          <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                            {m.time}
                          </span>
                        </div>
                        <p
                          className={`mt-0.5 truncate text-sm ${
                            m.unread ? "font-semibold text-foreground" : "text-foreground/80"
                          }`}
                        >
                          {m.subject}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{m.preview}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {m.tag && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                                tagStyles[m.tag.tone]
                              }`}
                            >
                              {m.tag.label}
                            </span>
                          )}
                          {m.hasAttachment && (
                            <Paperclip className="size-3 text-muted-foreground" />
                          )}
                          {m.starred && (
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reader */}
        <section className="glass-panel hidden flex-1 flex-col overflow-hidden rounded-3xl md:flex">
          <header className="flex items-center justify-between gap-3 border-b border-border/60 p-5">
            <button className="grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-foreground/5 md:hidden">
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-border/60 bg-foreground/[0.03] px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-foreground/5">
                <Archive className="inline size-3.5" />
              </button>
              <button className="rounded-xl border border-border/60 bg-foreground/[0.03] px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-foreground/5">
                <Trash2 className="inline size-3.5" />
              </button>
              <button className="rounded-xl border border-border/60 bg-foreground/[0.03] px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-foreground/5">
                <Tag className="inline size-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-foreground/5">
                <HelpCircle className="size-4" />
              </button>
              <button className="grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-foreground/5">
                <Grid3x3 className="size-4" />
              </button>
              <button className="grid size-9 place-items-center rounded-xl text-muted-foreground hover:bg-foreground/5">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap gap-2">
                  {selected.tag && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                        tagStyles[selected.tag.tone]
                      }`}
                    >
                      {selected.tag.label}
                    </span>
                  )}
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary ring-1 ring-primary/20">
                    Bandeja
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {selected.subject}
                </h2>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {selected.time} · Hoy
              </span>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-foreground/[0.02] p-3">
              <div
                className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${selected.avatarColor} text-sm font-bold text-white`}
              >
                {selected.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{selected.sender}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {selected.email} · para mí
                </p>
              </div>
              <button className="hidden rounded-xl bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:bg-foreground/10 sm:inline-flex">
                Ver hilo
              </button>
            </div>

            <article className="prose prose-sm max-w-none space-y-4 text-[15px] leading-relaxed text-foreground/90">
              <p>Hola Elena,</p>
              <p>
                Te escribo para confirmar que hemos cerrado la revisión técnica del proyecto y todo
                está listo para pasar a la siguiente fase. {selected.preview}
              </p>
              <p>
                Adjunto encontrarás el documento con el resumen ejecutivo, los entregables del
                sprint y la propuesta de cronograma para las próximas dos semanas. Cualquier
                comentario o ajuste, no dudes en escribirnos.
              </p>
              <p>Saludos cordiales,</p>
              <p className="font-semibold">{selected.sender}</p>
            </article>

            {selected.hasAttachment && (
              <div className="mt-6 flex flex-wrap gap-3">
                {["Brief-final.pdf", "Cronograma.xlsx"].map((file) => (
                  <div
                    key={file}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-foreground/[0.03] px-4 py-3"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Paperclip className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{file}</p>
                      <p className="text-xs text-muted-foreground">2.4 MB · PDF</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-border/60 p-5">
            <div className="flex gap-2">
              <button
                onClick={() => setComposeOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-[1.01] hover:bg-primary/90 active:scale-[0.99]"
              >
                <Reply className="size-4" /> Responder
              </button>
              <button
                onClick={() => setComposeOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-border/60 bg-foreground/[0.03] px-4 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-foreground/5"
              >
                <Forward className="size-4" /> Reenviar
              </button>
            </div>
          </footer>
        </section>
      </div>

      {composeOpen && <ComposeModal onClose={() => setComposeOpen(false)} />}
    </div>
  );
}

function ComposeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-background/40 backdrop-blur-md"
      />

      {/* Panel */}
      <div className="glass-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
              <PenSquare className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Nuevo mensaje</h2>
              <p className="text-[11px] text-muted-foreground">Redactando como elena@nexus.app</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </button>
            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Para */}
          <div className="flex items-center gap-3 border-b border-border/40 py-2.5">
            <label className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Para
            </label>
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                <span className="grid size-4 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-[8px] text-white">
                  MV
                </span>
                Marcos Vinicius
                <X className="size-3 cursor-pointer opacity-60 hover:opacity-100" />
              </span>
              <input
                type="text"
                placeholder="Añadir destinatario..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-2 text-[11px] font-semibold text-muted-foreground">
              <button className="hover:text-foreground">Cc</button>
              <button className="hover:text-foreground">Cco</button>
            </div>
          </div>

          {/* Asunto */}
          <div className="flex items-center gap-3 border-b border-border/40 py-2.5">
            <label className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Asunto
            </label>
            <input
              type="text"
              placeholder="Escribe un asunto claro y conciso"
              className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Body */}
          <textarea
            placeholder="Hola,

Escribe aquí tu mensaje..."
            className="mt-4 min-h-[220px] w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />

          {/* Attachment chip */}
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-foreground/[0.03] px-3 py-2">
              <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Paperclip className="size-3.5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold">Propuesta-v3.pdf</p>
                <p className="text-[10px] text-muted-foreground">1.8 MB</p>
              </div>
              <button className="ml-1 grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                <X className="size-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-t border-border/60 bg-foreground/[0.02] px-3 py-2">
          <div className="flex items-center gap-0.5">
            {[Bold, Italic, Underline, List, Link2, ImageIcon, Smile].map((Icon, i) => (
              <button
                key={i}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <Icon className="size-3.5" />
              </button>
            ))}
            <div className="mx-1 h-5 w-px bg-border/60" />
            <button className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground">
              <Paperclip className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground sm:inline-flex"
            >
              <Trash className="size-3.5" /> Descartar
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-foreground/[0.03] px-3 py-2 text-xs font-semibold text-foreground/80 transition hover:bg-foreground/5">
              <Save className="size-3.5" /> Borrador
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]">
              <SendIcon className="size-3.5" /> Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
