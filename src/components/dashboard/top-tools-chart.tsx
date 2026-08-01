"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TopToolsChartProps = {
  data: { name: string; count: number }[];
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { name: string } }[];
}) {
  if (!active || !payload?.length) return null;

  const { name } = payload[0].payload;
  const { value } = payload[0];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-zinc-950">{name}</p>
      <p className="text-zinc-500">
        {value} {value === 1 ? "execução" : "execuções"}
      </p>
    </div>
  );
}

export function TopToolsChart({ data }: TopToolsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="#f4f4f5" />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 11, fill: "#3f3f46" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fafafa" }} />
        <Bar dataKey="count" fill="#18181b" radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
