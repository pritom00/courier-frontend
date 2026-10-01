import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PRICING } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const TIERS = [
  { name: "Standard", price: PRICING.base, features: [`$${PRICING.perKg}/kg after base fare`, "Same-city & inter-city routes", "Live tracking timeline", "Email support"] },
  { name: "Fragile handling", price: PRICING.base + PRICING.fragile, features: ["Everything in Standard", "Reinforced handling", "Priority hub transfer", "Damage-aware routing"], highlight: true },
  { name: "Bulk / business", price: PRICING.base, features: ["Custom volume pricing", "Dedicated hub coordination", "Priority courier assignment", "Contact sales for a quote"] },
];

export function PricingTable() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {TIERS.map((tier) => (
        <Card key={tier.name} className={tier.highlight ? "border-2 border-primary shadow-lg" : ""}>
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>
              From <span className="text-2xl font-bold text-foreground">{formatCurrency(tier.price)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
