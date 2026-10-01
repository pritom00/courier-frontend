import { Check, CircleDot } from "lucide-react";
import { STATUS_LABEL } from "@/lib/constants";
import type { TrackingEvent } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

export function ShipmentTimeline({ events }: { events: TrackingEvent[] }) {
  if (!events.length) return <p className="text-sm text-muted-foreground">No tracking events recorded yet.</p>;
  const ordered = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <ol className="relative space-y-6 border-l-2 border-accent pl-6" aria-label="Shipment tracking timeline">
      {ordered.map((event, i) => {
        const latest = i === ordered.length - 1;
        return (
          <li key={event.id} className="relative">
            <span
              className={cn(
                "absolute -left-[35px] flex size-6 items-center justify-center rounded-full border-2 bg-background",
                latest ? "border-primary text-primary" : "border-accent text-muted-foreground",
              )}
            >
              {latest ? <CircleDot className="size-3.5" aria-hidden /> : <Check className="size-3.5" aria-hidden />}
            </span>
            <p className={cn("text-sm font-semibold", latest && "text-primary")}>{STATUS_LABEL[event.status]}</p>
            {event.note && <p className="text-sm text-muted-foreground">{event.note}</p>}
            <time dateTime={event.createdAt} className="text-xs text-muted-foreground">
              {formatDateTime(event.createdAt)}
            </time>
          </li>
        );
      })}
    </ol>
  );
}
