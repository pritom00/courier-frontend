"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { STATUS_LABEL } from "@/lib/constants";
import type { ShipmentStatus } from "@/lib/types";

export function StatusChart({ data }: { data: { status: ShipmentStatus; count: number }[] }) {
  const chartData = data.map((d) => ({ name: STATUS_LABEL[d.status], count: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipments by status</CardTitle>
        <CardDescription>Current distribution across the delivery pipeline</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.every((d) => d.count === 0) ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No shipment data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" angle={-40} textAnchor="end" interval={0} height={70} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent))" }}
                contentStyle={{ borderRadius: 8, borderColor: "hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
