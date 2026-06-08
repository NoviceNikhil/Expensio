import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchExpenses, removeExpense } from "../expensesSlice";
import ExpenseFilters from "../components/ExpenseFilters";
import ExpenseModal from "../components/ExpenseModal";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { fetchExpenses, deleteExpense } from "../redux/Expense/expenseSlice";
import { createReducer } from "@reduxjs/toolkit";

const Expenses = () => {
  const dispatch = useDispatch();

  // Redux State
  const {
    items: expenses,
    status,
    error,
    totalCounts,
  } = useSelector((state) => state.expenses);
  // Assuming you have a categories slice, otherwise fetch them here or pass mock
  // For now, I will assume basic categories are loaded or passed from parent
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPage = totalCounts / itemsPerPage;

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses(`_page=${currentPage}&_limit=${itemsPerPage}`));
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    // Fetch categories here if not in Redux yet
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  // Helper for formatting
  const formatAmount = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);

  const getCatName = (id) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage and track your expenses
          </p>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <ExpenseFilters
          categories={categories}
          onOpenModal={() => setIsModalOpen(true)}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        {/* LIST/TABLE SECTION */}
        <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 overflow-hidden min-h-[400px]">
          {/* 1. THE LOADING OVERLAY */}
          {status === "loading" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300">
              <div className="flex flex-col items-center">
                {/* Simple CSS Spinner */}
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600 dark:text-blue-400 mt-3 font-medium animate-pulse">
                  Fetching Data...
                </span>
              </div>
            </div>
          )}

          {/* 2. CONTENT WITH CONDITIONAL OPACITY */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              status === "loading"
                ? "opacity-30 scale-[0.99] blur-[1px]"
                : "opacity-100 scale-100 blur-0"
            }`}
          >
            {/* Mobile cards */}
            <div className="md:hidden">
              {expenses.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-slate-700/50">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {expense.title}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                              {getCatName(expense.categoryId)}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-slate-400">
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 rounded-md border border-gray-200 dark:border-slate-700 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label="Edit expense"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => dispatch(deleteExpense(expense.id))}
                            className="p-2 rounded-md border border-gray-200 dark:border-slate-700 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Delete expense"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-slate-400">Amount</div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatAmount(expense.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                status !== "loading" && (
                  <div className="px-6 py-10 text-center text-gray-500 dark:text-slate-500">
                    No expenses found matching your filters.
                  </div>
                )
              )}
            </div>

            {/* Desktop/tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-gray-100 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                  {expenses.length > 0
                    ? expenses.map((expense) => (
                        <tr
                          key={expense.id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                            {expense.title}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                              {getCatName(expense.categoryId)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-green-600 dark:text-green-400 font-semibold">
                            {formatAmount(expense.amount)}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                              aria-label="Edit expense"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => dispatch(deleteExpense(expense.id))}
                              className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                              aria-label="Delete expense"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    : status !== "loading" && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-10 text-center text-gray-500 dark:text-slate-500"
                          >
                            No expenses found matching your filters.
                          </td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}

        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-200 dark:border-slate-700/50">
          <div className="text-sm text-gray-600 dark:text-slate-400">
            Showing page{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              {currentPage}
            </span>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage == totalPage || expenses.length < itemsPerPage
              }
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ExpenseModal
          onClose={handleCloseModal}
          expenseToEdit={editingExpense}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Expenses;
