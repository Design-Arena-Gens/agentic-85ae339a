"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useMemo } from "react";
import { Expense } from "../types";

const monthLabel = (value: string) => format(parseISO(value + "-01"), "LLLL", { locale: ru });

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

type Props = {
  expenses: Expense[];
};

export function TrendsPanel({ expenses }: Props) {
  const monthlyStats = useMemo(() => {
    const grouped = new Map<string, number>();
    expenses.forEach((expense) => {
      const key = expense.date.slice(0, 7);
      grouped.set(key, (grouped.get(key) ?? 0) + expense.amount);
    });
    const entries = [...grouped.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-6);
    const max = Math.max(1, ...entries.map(([, value]) => value));
    return entries.map(([month, sum]) => ({
      month,
      sum,
      percentage: Math.round((sum / max) * 100),
    }));
  }, [expenses]);

  const categories = useMemo(() => {
    const grouped = new Map<string, number>();
    expenses.forEach((expense) => {
      grouped.set(expense.category, (grouped.get(expense.category) ?? 0) + expense.amount);
    });
    const total = groupedTotal(grouped);
    return [...grouped.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, sum]) => ({
        category,
        sum,
        share: total ? Math.round((sum / total) * 100) : 0,
      }));
  }, [expenses]);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-700 bg-dusk/60 p-6 shadow-lg">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Динамика расходов</h3>
            <p className="text-xs text-slate-400">Последние 6 месяцев</p>
          </div>
        </header>
        <div className="mt-6 grid grid-cols-6 items-end gap-3">
          {monthlyStats.length === 0 && (
            <p className="col-span-6 text-center text-slate-400">Добавьте расходы, чтобы увидеть динамику</p>
          )}
          {monthlyStats.map((item) => (
            <div key={item.month} className="flex flex-col items-center gap-2 text-xs text-slate-300">
              <div className="flex h-32 w-full items-end rounded-lg border border-slate-700 bg-slate-800/60">
                <span
                  className="mx-auto w-8 rounded-b-lg bg-sky"
                  style={{ height: `${item.percentage}%` }}
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-200">{formatCurrency(item.sum)}</p>
                <span className="uppercase text-[10px] text-slate-400">{monthLabel(item.month)}</span>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-700 bg-dusk/60 p-6 shadow-lg">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Категории</h3>
            <p className="text-xs text-slate-400">Топ 5 по сумме</p>
          </div>
        </header>
        <div className="mt-6 space-y-4">
          {categories.length === 0 && <p className="text-sm text-slate-400">Нет данных</p>}
          {categories.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>{item.category}</span>
                <span className="font-semibold">{formatCurrency(item.sum)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800/80">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sky via-sunset to-meadow"
                  style={{ width: `${Math.min(item.share, 100)}%` }}
                />
              </div>
              <span className="block text-right text-xs text-slate-400">{item.share}%</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function groupedTotal(map: Map<string, number>) {
  let total = 0;
  map.forEach((value) => {
    total += value;
  });
  return total;
}
