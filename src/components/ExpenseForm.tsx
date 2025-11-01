"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export type ExpenseDraft = {
  title: string;
  amount: number;
  category: string;
  date: string;
};

type Props = {
  onSubmit: (expense: ExpenseDraft) => void;
  categories: string[];
};

const defaultCategories = [
  "Продукты",
  "Транспорт",
  "Подписки",
  "Отдых",
  "Здоровье",
  "Дом",
];

const today = () => format(new Date(), "yyyy-MM-dd", { locale: ru });

export function ExpenseForm({ onSubmit, categories }: Props) {
  const [form, setForm] = useState<ExpenseDraft>({
    title: "",
    amount: 0,
    category: "",
    date: today(),
  });
  const [touched, setTouched] = useState(false);

  const mergedCategories = useMemo(() => {
    const set = new Set([...(categories.length ? categories : defaultCategories)]);
    if (form.category && !set.has(form.category)) {
      set.add(form.category);
    }
    return Array.from(set);
  }, [categories, form.category]);

  const isValid = form.title.trim().length > 0 && form.amount > 0 && form.category.trim().length > 0;

  const handleChange = (field: keyof ExpenseDraft) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === "amount" ? Number(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit({ ...form });
    setForm({ title: "", amount: 0, category: form.category, date: today() });
    setTouched(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dusk/60 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-5">
      <header>
        <h2 className="text-lg font-semibold">Добавить расход</h2>
        <p className="text-sm text-slate-400">Заполняйте форму каждый раз, когда тратите деньги.</p>
      </header>

      <label className="flex flex-col gap-2 text-sm">
        <span>Описание</span>
        <input
          value={form.title}
          onChange={handleChange("title")}
          onBlur={() => setTouched(true)}
          placeholder="Например, кофе с собой"
          className="w-full rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 shadow-inner focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
        />
        {touched && form.title.trim().length === 0 && (
          <span className="text-xs text-sunset">Введите описание</span>
        )}
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span>Категория</span>
          <div className="flex gap-2">
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="w-full rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 shadow-inner focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
            >
              <option value="" disabled>
                Выберите категорию
              </option>
              {mergedCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {touched && form.category.trim().length === 0 && (
            <span className="text-xs text-sunset">Выберите или добавьте категорию</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Дата</span>
          <input
            type="date"
            value={form.date}
            onChange={handleChange("date")}
            className="w-full rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 shadow-inner focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span>Сумма (₽)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.amount === 0 ? "" : form.amount}
          onChange={handleChange("amount")}
          onBlur={() => setTouched(true)}
          placeholder="0.00"
          className="w-full rounded-xl border border-slate-600 bg-dusk px-4 py-3 text-base text-slate-100 shadow-inner focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50"
        />
        {touched && form.amount <= 0 && (
          <span className="text-xs text-sunset">Введите сумму больше нуля</span>
        )}
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-sky px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-sky/80 focus:outline-none focus:ring-2 focus:ring-sky/50"
      >
        Добавить запись
      </button>
    </form>
  );
}
