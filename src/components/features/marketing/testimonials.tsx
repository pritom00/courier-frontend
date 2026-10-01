import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REVIEWS = [
  { name: "Farhana Akter", role: "Online boutique owner, Dhaka", quote: "CourierHub cut our average delivery time almost in half. The live tracking means fewer customer calls asking 'where's my order?'" },
  { name: "Tanvir Hossain", role: "Courier partner", quote: "The app tells me exactly which job to pick up next and I get paid reliably. Best platform I've worked with." },
  { name: "Nusrat Jahan", role: "Frequent sender", quote: "I ship gifts to family in Chattogram every month. Payment and tracking are seamless from start to finish." },
];

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {REVIEWS.map((r) => (
        <Card key={r.name}>
          <CardContent className="p-6">
            <div className="mb-3 flex gap-0.5 text-warning" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-foreground/90">&ldquo;{r.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
