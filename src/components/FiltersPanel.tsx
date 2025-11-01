"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useMemo } from "react";
import { Filters, Expense } from "../types";

const monthLabel = (value: string) => {
  if (!value) return "Все месяцы";
  const date = parseISO(value + "-01");
  return format(date, "LLLL yyyy", { locale: ru });
};

type Props = {
  expenses: Expense[];
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function FiltersPanel({ expenses, filters, onChange }: Props) {
  const months = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((expense) => {
      const value = expense.date.slice(0, 7);
      set.add(value);
    });
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [expenses]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((expense) => set.add(expense.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [expenses]);

  const handleChange = <K extends keyof Filters>(key: K) => (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const raw = event.target.value;
    const value = (() => {
      if (key === "minAmount" || key === "maxAmount") {
        return raw === "" ? undefined : Number(raw);
      }
      return raw;
    })();
    onChange({ ...filters, [key]: value } as Filters);
  };

  return (
    <section className="rounded-2xl border border-slate-700 bg-dusk/60 p-5 shadow-lg">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Фильтры</h2>
          <p className="text-xs text-slate-400">Настройте видимые данные</p>
        </div>
        <button
          onClick={() => onChange({ month: "", category: "", minAmount: undefined, maxAmount: undefined })}
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-sky"
        >
          Сбросить
        </button>
      </header>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm">
          <span>Месяц</span>
          <select
            value={filters.month}
            onChange={handleChange("month")}
            className="rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
          >
            <option value="">Все месяцы</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {monthLabel(month)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Категория</span>
          <select
            value={filters.category}
            onChange={handleChange("category")}
            className="rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Минимальная сумма</span>
          <input
            type="number"
            min={0}
            step={100}
            value={filters.minAmount ?? ""}
            onChange={handleChange("minAmount")}
            placeholder="0"
            className="rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Максимальная сумма</span>
          <input
            type="number"
            min={0}
            step={100}
            value={filters.maxAmount ?? ""}
            onChange={handleChange("maxAmount")}
            placeholder="10000"
            className="rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
          />
        </label>
      </div>
    </section>
  );
}
