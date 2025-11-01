"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useMemo, useState } from "react";
import { Expense } from "../types";
import { clsx } from "clsx";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

const ITEMS_PER_PAGE = 6;

export function ExpenseTable({ expenses, onDelete }: Props) {
  const [page, setPage] = useState(0);

  const { paginated, pages } = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
    const from = page * ITEMS_PER_PAGE;
    return {
      paginated: sorted.slice(from, from + ITEMS_PER_PAGE),
      pages: Math.ceil(sorted.length / ITEMS_PER_PAGE),
    };
  }, [expenses, page]);

  const handleDelete = (id: string) => () => onDelete(id);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-dusk/60 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
        <h2 className="text-lg font-semibold">История расходов</h2>
        <span className="text-xs uppercase tracking-widest text-slate-500">
          Всего: {expenses.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700 text-sm">
          <thead className="bg-dusk">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3">Дата</th>
              <th className="px-6 py-3">Описание</th>
              <th className="px-6 py-3">Категория</th>
              <th className="px-6 py-3 text-right">Сумма</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/80 bg-dusk/40">
            {paginated.map((expense) => (
              <tr key={expense.id} className="transition hover:bg-slate-800/40">
                <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                  {format(parseISO(expense.date), "d MMMM yyyy", { locale: ru })}
                </td>
                <td className="px-6 py-4 text-slate-50">{expense.title}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-slate-700/60 px-3 py-1 text-xs text-slate-200">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-100">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={handleDelete(expense.id)}
                    className="text-xs font-semibold uppercase tracking-wide text-sunset hover:text-sunset/80"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                  Здесь появятся ваши расходы
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-700 bg-dusk/80 px-6 py-3 text-xs text-slate-400">
          <span>
            Страница {page + 1} из {pages}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: pages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={clsx(
                  "h-8 w-8 rounded-lg border border-transparent text-sm transition",
                  index === page
                    ? "bg-sky/20 text-sky border-sky/40"
                    : "bg-transparent text-slate-400 hover:bg-slate-700/60"
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
