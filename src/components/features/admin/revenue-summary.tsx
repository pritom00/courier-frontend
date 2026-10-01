import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function RevenueSummary({ totalRevenue, totalShipments, activeCouriers }: { totalRevenue: number; totalShipments: number; activeCouriers: number }) {
  const data = [
    { name: "Revenue ($)", value: Math.max(totalRevenue, 0.01) },
    { name: "Shipments", value: Math.max(totalShipments, 0.01) },
    { name: "Active couriers", value: Math.max(activeCouriers, 0.01) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operations snapshot</CardTitle>
        <CardDescription>Relative share of key metrics right now</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, borderColor: "hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
