"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useMemo } from "react";
import { Expense } from "../types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

type Props = {
  expenses: Expense[];
};

export function StatisticsOverview({ expenses }: Props) {
  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return {
        total: 0,
        monthlyAverage: 0,
        topCategory: "—",
        lastExpense: null as { title: string; amount: number; date: string } | null,
      };
    }

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
    const lastExpense = sorted[0];

    const byMonth = new Map<string, number>();
    const byCategory = new Map<string, number>();

    for (const expense of expenses) {
      const monthKey = format(parseISO(expense.date), "yyyy-MM", { locale: ru });
      byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + expense.amount);
      byCategory.set(expense.category, (byCategory.get(expense.category) ?? 0) + expense.amount);
    }

    const monthlyAverage = [...byMonth.values()].reduce((sum, value) => sum + value, 0) / byMonth.size;
    const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0][0];

    return {
      total,
      monthlyAverage,
      topCategory,
      lastExpense: {
        title: lastExpense.title,
        amount: lastExpense.amount,
        date: lastExpense.date,
      },
    };
  }, [expenses]);

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-2xl border border-slate-700 bg-gradient-to-br from-sky/40 via-sky/10 to-transparent p-6 shadow-lg">
        <h3 className="text-xs uppercase tracking-widest text-slate-200/70">Всего расходов</h3>
        <p className="mt-2 text-2xl font-bold text-slate-50">{formatCurrency(stats.total)}</p>
      </article>

      <article className="rounded-2xl border border-slate-700 bg-gradient-to-br from-meadow/30 via-meadow/10 to-transparent p-6 shadow-lg">
        <h3 className="text-xs uppercase tracking-widest text-slate-200/70">Средний расход в месяц</h3>
        <p className="mt-2 text-2xl font-bold text-slate-50">{formatCurrency(stats.monthlyAverage || 0)}</p>
      </article>

      <article className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-100/10 via-transparent to-transparent p-6 shadow-lg">
        <h3 className="text-xs uppercase tracking-widest text-slate-200/70">Категория месяца</h3>
        <p className="mt-2 text-2xl font-bold text-slate-50">{stats.topCategory}</p>
      </article>

      <article className="rounded-2xl border border-slate-700 bg-gradient-to-br from-sunset/30 via-sunset/10 to-transparent p-6 shadow-lg">
        <h3 className="text-xs uppercase tracking-widest text-slate-200/70">Последний расход</h3>
        {stats.lastExpense ? (
          <div className="mt-2 space-y-1 text-sm text-slate-200">
            <p className="text-lg font-semibold text-slate-50">{stats.lastExpense.title}</p>
            <p>{formatCurrency(stats.lastExpense.amount)}</p>
            <span className="text-xs text-slate-400">
              {format(parseISO(stats.lastExpense.date), "d MMMM yyyy", { locale: ru })}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-slate-400">Нет данных</p>
        )}
      </article>
    </section>
  );
}
