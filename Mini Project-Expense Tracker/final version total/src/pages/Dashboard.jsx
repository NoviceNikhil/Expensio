import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../redux/Expense/expenseSlice";
import { fetchCategories } from "../redux/Category/categorySlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Destructure expenses and categories from Redux store
  const { items: expenses = [], status } = useSelector((state) => state.expenses);
  const { categoryItems = [] } = useSelector((state) => state.categories);

  // Fetch data on mount (empty query = fetch all expenses)
  useEffect(() => {
    dispatch(fetchExpenses(""));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Indian Rupee currency formatter (memoized for performance)
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }),
    [],
  );

  // Current date and totals calculations (memoized to avoid recalculation)
  const now = useMemo(() => new Date(), []);
  const totals = useMemo(() => {
    const safeAmount = (v) => (typeof v === "number" ? v : Number.parseFloat(v) || 0);
    
    // Total across all expenses
    const total = expenses.reduce((sum, e) => sum + safeAmount(e.amount), 0);

    // This month total (filters by current year/month)
    const thisMonthTotal = expenses.reduce((sum, e) => {
      const d = new Date(e.date);
      if (Number.isNaN(d.getTime())) return sum;
      if (d.getFullYear() !== now.getFullYear()) return sum;
      if (d.getMonth() !== now.getMonth()) return sum;
      return sum + safeAmount(e.amount);
    }, 0);

    return {
      total,
      thisMonthTotal,
      categoriesCount: categoryItems.length,
    };
  }, [expenses, categoryItems.length, now]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      
      {/* 3-column responsive stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Total Expenses</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {status === "loading" ? "Loading..." : fmt.format(totals.total)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">This Month</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {status === "loading" ? "Loading..." : fmt.format(totals.thisMonthTotal)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Categories</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totals.categoriesCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
