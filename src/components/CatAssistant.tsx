import { useEffect, useRef, useState } from "react";
import { Cat, Send, X, Sparkles } from "lucide-react";

type ChatMsg = { id: number; role: "user" | "assistant"; text: string };

const CANNED: string[] = [
  "Miau 🐾 He marcado ese hilo como importante. ¿Quieres que redacte una respuesta?",
  "Listo — he buscado en tu bandeja los mensajes relacionados. Hay 3 conversaciones abiertas.",
  "Puedo etiquetar este mensaje como “Urgente” y archivarlo cuando lo respondas. ¿Lo hago?",
  "He resumido el hilo: el cliente pide cerrar la revisión antes del viernes y adjunta el sprint 12.",
  "Ronroneo… te he programado un recordatorio para mañana a las 9:00. 🐱",
];

const SUGGESTIONS = [
  "Resume mi bandeja de hoy",
  "Redacta una respuesta breve",
  "Etiqueta como urgente",
];

export function CatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 1,
      role: "assistant",
      text: "¡Hola! Soy **Miso**, tu asistente felino. 🐾 Puedo resumir hilos, redactar respuestas y etiquetar mensajes. ¿En qué te ayudo?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const userMsg: ChatMsg = { id: Date.now(), role: "user", text: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const reply = CANNED[Math.floor(Math.random() * CANNED.length)];
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente Miso"}
        className="group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 ring-1 ring-primary/30 transition hover:scale-105 active:scale-95"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/40 opacity-0 transition group-hover:opacity-100 group-hover:blur-xl" />
        {open ? <X className="size-6" /> : <Cat className="size-7" strokeWidth={2.2} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-emerald-400 ring-2 ring-background">
            <span className="size-1.5 rounded-full bg-emerald-700/70" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Asistente Miso"
          className="glass-panel fixed bottom-24 right-5 z-40 flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/30 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-border/60 p-4">
            <div className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md shadow-primary/30">
              <Cat className="size-5" strokeWidth={2.2} />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-bold">
                Miso <Sparkles className="size-3 text-amber-400" />
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Asistente felino · en línea
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-xl text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) =>
              m.role === "assistant" ? (
                <div key={m.id} className="flex items-end gap-2">
                  <div className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                    <Cat className="size-3.5" strokeWidth={2.4} />
                  </div>
                  <div
                    className="max-w-[80%] rounded-2xl rounded-bl-md border border-border/60 bg-foreground/[0.04] px-3.5 py-2 text-sm leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{
                      __html: m.text.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="font-semibold text-foreground">$1</strong>',
                      ),
                    }}
                  />
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm leading-relaxed text-primary-foreground shadow-sm shadow-primary/25">
                    {m.text}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex items-end gap-2">
                <div className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Cat className="size-3.5" strokeWidth={2.4} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border/60 bg-foreground/[0.04] px-3.5 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/40" />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border/60 bg-foreground/[0.03] px-3 py-1 text-[11px] font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border/60 p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-foreground/[0.03] p-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Pregunta algo a Miso…"
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
