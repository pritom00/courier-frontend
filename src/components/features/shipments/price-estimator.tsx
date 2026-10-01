"use client";
import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PRICING } from "@/lib/constants";
import { estimatePrice, formatCurrency } from "@/lib/utils";

/** Public, no-auth pricing calculator (marketing site) - mirrors the backend's exact pricing formula. */
export function PriceEstimator() {
  const [weight, setWeight] = useState(2);
  const [fragile, setFragile] = useState(false);
  const price = estimatePrice(weight, fragile);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5 text-primary" aria-hidden /> Estimate your delivery cost
        </CardTitle>
        <CardDescription>
          Base fare ${PRICING.base} + ${PRICING.perKg}/kg{fragile ? ` + $${PRICING.fragile} fragile handling` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="weight">Package weight (kg)</Label>
          <Input id="weight" type="number" min={0.1} max={500} step={0.1} value={weight} onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))} />
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
          <Label htmlFor="fragile" className="cursor-pointer">
            Fragile / handle with care
          </Label>
          <Switch id="fragile" checked={fragile} onCheckedChange={setFragile} />
        </div>
        <div className="rounded-lg bg-primary px-4 py-4 text-center text-primary-foreground">
          <p className="text-xs uppercase tracking-wide opacity-80">Estimated price</p>
          <p className="text-3xl font-bold">{formatCurrency(price)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
