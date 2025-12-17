"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SummaryProps {
  saldoAnterior: number;
  entradas: number;
  saidas: number;
  saldoFinal: number;
}

export function FinanceSummary({
  saldoAnterior,
  entradas,
  saidas,
  saldoFinal,
}: SummaryProps) {
  const summaryData = [
    { name: "Entradas", value: entradas, fill: "#22c55e" },
    { name: "Saídas", value: saidas, fill: "#ef4444" },
  ];

  return (
    <div className="border rounded-lg p-4 shadow-md col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Resumo</h2>
      <div className="flex justify-between items-center">
        <div>
          <p>
            Saldo anterior:{" "}
            <span className="font-semibold">
              {saldoAnterior.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
          <p>
            Entradas:{" "}
            <span className="text-green-500 font-semibold">
              {entradas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
          <p>
            Saídas:{" "}
            <span className="text-red-500 font-semibold">
              {saidas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
          <p>
            Saldo final:{" "}
            <span className="font-bold text-lg">
              {saldoFinal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
        </div>
        <div style={{ width: "150px", height: "150px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={summaryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
              >
                {summaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
