import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { addExpense, editExpense } from "../expensesSlice";
import { FiX } from "react-icons/fi";
import { updateExpense, addExpense } from "../redux/Expense/expenseSlice";

const ExpenseModal = ({ onClose, expenseToEdit, categories }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        ...expenseToEdit,
        date: new Date(expenseToEdit.date).toISOString().split("T")[0],
      });
    }
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(), // Ensure ISO format
    };

    if (expenseToEdit) {
      dispatch(updateExpense({ ...payload, id: expenseToEdit.id }));
    } else {
      dispatch(addExpense(payload));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {expenseToEdit ? "Edit Expense" : "Add New Expense"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Amount"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          />
          <select
            required
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
          >
            {expenseToEdit ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
