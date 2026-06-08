import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../redux/Expense/expenseSlice";
import { FiSearch, FiFilter } from "react-icons/fi";
import { BiSort } from "react-icons/bi";

const ExpenseFilters = ({
  categories,
  onOpenModal,
  currentPage,
  itemsPerPage,
}) => {
  const dispatch = useDispatch();
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const { items } = useSelector((state) => state.expenses);

  // Local state for filters because they don't need to be global
  const [filters, setFilters] = useState({
    q: "", // Search
    categoryId: "",
    _sort: "",
    _order: "",
    amount_gte: "",
    amount_lte: "",
    _page: "",
    _limit: "",
  });

  // Helper to apply filters
  const applyFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Convert object to query string: "q=food&categoryId=1&_sort=amount"
    const queryParams = new URLSearchParams();
    Object.keys(updated).forEach((key) => {
      if (updated[key]) queryParams.append(key, updated[key]);
    });

    dispatch(fetchExpenses(queryParams.toString()));
  };

  useEffect(() => {
    applyFilters({ _page: currentPage, _limit: itemsPerPage });
  }, [currentPage, itemsPerPage]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const totalExpenses = useMemo(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  return (
    <>
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-200 dark:border-slate-700/50 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search expenses..."
              onChange={(e) => applyFilters({ q: e.target.value })}
              className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400 w-5 h-5" />
            <select
              onChange={(e) =>
                applyFilters({
                  categoryId: e.target.value === "all" ? "" : e.target.value,
                })
              }
              className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <BiSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400 w-5 h-5" />
            <select
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-");
                applyFilters({ _sort: sort, _order: order });
              }}
              className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="">Sort By</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="amount-asc">Amount (Low-High)</option>
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={onOpenModal}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 text-white font-medium transition-colors shadow-sm"
          >
            + Add Expense
          </button>
        </div>
        {/* Amount Range Filter */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Min Amount"
            // value={amountRange.min}
            onChange={(e) =>
              setAmountRange({ ...amountRange, min: e.target.value })
            }
            className="bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Amount"
            // value={amountRange.max}
            onChange={(e) =>
              setAmountRange({ ...amountRange, max: e.target.value })
            }
            className="bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() =>
              applyFilters({
                amount_gte: amountRange.min,
                amount_lte: amountRange.max,
              })
            }
            className="bg-gray-900 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg px-4 py-3 text-white transition-colors font-medium"
          >
            Apply Range
          </button>
        </div> */}
      </div>
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-lg mb-1">Expenses Per Page</p>
            <p className="text-3xl font-bold text-white">
              {formatAmount(totalExpenses)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm mb-1"> Items Per Page</p>
            <p className="text-3xl font-bold text-white">{items.length}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseFilters;
