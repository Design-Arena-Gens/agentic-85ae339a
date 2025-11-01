"use client";

import { useEffect, useMemo, useState } from "react";
import { Expense, Filters } from "../types";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseTable } from "../components/ExpenseTable";
import { StatisticsOverview } from "../components/StatisticsOverview";
import { FiltersPanel } from "../components/FiltersPanel";
import { TrendsPanel } from "../components/TrendsPanel";
import { ExpenseDraft } from "../components/ExpenseForm";

const STORAGE_KEY = "personal-expenses";

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const starterExpenses: Expense[] = [
  {
    id: "seed-1",
    title: "Продукты в супермаркете",
    category: "Продукты",
    amount: 3200,
    date: new Date().toISOString().slice(0, 10),
  },
  {
    id: "seed-2",
    title: "Абонемент в спортзал",
    category: "Здоровье",
    amount: 2490,
    date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().slice(0, 10),
  },
  {
    id: "seed-3",
    title: "Поездка на такси",
    category: "Транспорт",
    amount: 780,
    date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().slice(0, 10),
  },
];

const defaultFilters: Filters = { month: "", category: "" };

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Expense[] = JSON.parse(stored);
        setExpenses(parsed);
        return;
      } catch (error) {
        console.warn("Ошибка чтения расходов", error);
      }
    }
    setExpenses(starterExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const categories = useMemo(() => {
    const unique = new Set(expenses.map((expense) => expense.category));
    return Array.from(unique);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (filters.month && !expense.date.startsWith(filters.month)) return false;
      if (filters.category && expense.category !== filters.category) return false;
      if (filters.minAmount && expense.amount < Number(filters.minAmount)) return false;
      if (filters.maxAmount && expense.amount > Number(filters.maxAmount)) return false;
      return true;
    });
  }, [expenses, filters]);

  const handleAddExpense = (expense: ExpenseDraft) => {
    setExpenses((prev) => [
      {
        id: generateId(),
        ...expense,
      },
      ...prev,
    ]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredForStats = filters.month || filters.category || filters.minAmount || filters.maxAmount ? filteredExpenses : expenses;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-slate-700 bg-gradient-to-br from-dusk/80 via-slate-900/40 to-transparent p-10 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <span className="rounded-full border border-slate-700/80 px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
            Финансовый контроль
          </span>
          <h1 className="text-4xl font-bold text-slate-50 sm:text-5xl">Личный дашборд расходов</h1>
          <p className="text-base text-slate-300">
            Фиксируйте траты, анализируйте тренды и управляйте бюджетом через современный интерфейс, работающий прямо в браузере.
          </p>
        </div>
      </header>

      <StatisticsOverview expenses={filteredForStats} />

      <FiltersPanel expenses={expenses} filters={filters} onChange={setFilters} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ExpenseForm onSubmit={handleAddExpense} categories={categories} />
        <TrendsPanel expenses={filteredForStats} />
      </section>

      <ExpenseTable expenses={filteredExpenses} onDelete={handleDeleteExpense} />
    </main>
  );
}
