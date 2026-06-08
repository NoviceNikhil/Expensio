import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart,Bar,PieChart,Pie,LineChart,Line,Cell,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,} from "recharts";
import { fetchExpenses } from "../redux/Expense/expenseSlice";
import { FiTrendingUp, FiDollarSign, FiBarChart2, FiPieChart } from "react-icons/fi";

// Color palette for consistent design
const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#06b6d4",
  "#14b8a6",
];

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const Analytics = () => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [categories, setCategories] = useState([]);

  // Fetch expenses on mount
  useEffect(() => {
    dispatch(fetchExpenses());
    // Fetch categories
    fetch("http://localhost:5000/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });
  }, [dispatch]);

  const { items: expenses, status, error } = useSelector((state) => state.expenses);

  const years = useMemo(() => {
    const yearSet = new Set();
    (expenses || []).forEach((expense) => {
      const date = new Date(expense.date);
      if (!Number.isNaN(date.getTime())) {
        yearSet.add(String(date.getFullYear()));
      }
    });
    return Array.from(yearSet).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return (expenses || []).filter((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return false;
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, "0");

      if (selectedYear !== "all" && year !== selectedYear) return false;
      if (selectedMonth !== "all" && month !== selectedMonth) return false;
      return true;
    });
  }, [expenses, selectedYear, selectedMonth]);

  const { metrics, categoryDetails, monthlyExpenses, dailyExpenses } = useMemo(() => {
    const items = filteredExpenses || [];

    const total = items.reduce((sum, e) => sum + e.amount, 0);
    const count = items.length;
    const average = count > 0 ? total / count : 0;

    const categoryMap = {};
    items.forEach((expense) => {
      const key = String(expense.categoryId);
      if (!categoryMap[key]) {
        categoryMap[key] = { total: 0, count: 0 };
      }
      categoryMap[key].total += expense.amount;
      categoryMap[key].count += 1;
    });

    const categoryDetailsData = Object.entries(categoryMap)
      .map(([id, data]) => ({
        categoryId: id,
        name: id,
        total: parseFloat(data.total.toFixed(2)),
        count: data.count,
        average: parseFloat((data.total / data.count).toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total);

    const monthlyMap = {};
    items.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + expense.amount;
    });
    const monthlyExpensesData = Object.entries(monthlyMap)
      .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const dailyMap = {};
    items.forEach((expense) => {
      const date = new Date(expense.date).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + expense.amount;
    });
    const dailyExpensesData = Object.entries(dailyMap)
      .map(([date, total]) => ({ date, total: parseFloat(total.toFixed(2)) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      metrics: {
        total: parseFloat(total.toFixed(2)),
        count,
        average: parseFloat(average.toFixed(2)),
        categoriesCount: Object.keys(categoryMap).length,
      },
      categoryDetails: categoryDetailsData,
      monthlyExpenses: monthlyExpensesData,
      dailyExpenses: dailyExpensesData,
    };
  }, [filteredExpenses]);

  // Memoized computed data to avoid recalculations
  const chartData = useMemo(() => {
    // Create a map of categories by ID (string-normalized)
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[String(cat.id)] = cat.name;
    });

    return {
      categoryChart: (categoryDetails || []).map((cat) => {
        const categoryId = String(cat.categoryId);
        return {
          name: categoryMap[categoryId] || `Category ${categoryId}`,
          total: cat.total,
          count: cat.count,
          average: cat.average,
          categoryId,
        };
      }),
      monthlyTrend: monthlyExpenses || [],
      dailyTrend: dailyExpenses || [],
    };
  }, [categoryDetails, monthlyExpenses, dailyExpenses, categories]);

  // Throttle scroll events

  console.log("Category Chart Data:", chartData.categoryChart);

  const [isScrolled, setIsScrolled] = useState(false);
  const handleScroll = useCallback(() => {
    setIsScrolled(true);
    setTimeout(() => setIsScrolled(false), 200);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataKey = payload[0]?.dataKey;
      const value = payload[0]?.value;
      const isCount = dataKey === "count";
      return (
        <div className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-md border border-gray-200 dark:border-slate-700/50 rounded-lg p-3 text-gray-900 dark:text-white shadow-lg">
          <p className="font-medium">{payload[0].payload.name || payload[0].payload.month || payload[0].payload.date}</p>
          <p className="text-blue-600 dark:text-blue-400">
            {isCount ? value : formatCurrency(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Track your spending patterns and financial insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Months</option>
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Expenses */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-1">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics?.total || 0)}
                </p>
              </div>
              <FiDollarSign className="w-10 h-10 text-blue-400 opacity-20" />
            </div>
          </div>

          {/* Average Expense */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-1">
                  Average Expense
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics?.average || 0)}
                </p>
              </div>
              <FiTrendingUp className="w-10 h-10 text-green-400 opacity-20" />
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-1">
                  Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics?.count || 0}
                </p>
              </div>
              <FiBarChart2 className="w-10 h-10 text-purple-400 opacity-20" />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-1">
                  Categories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics?.categoriesCount || 0}
                </p>
              </div>
              <FiPieChart className="w-10 h-10 text-orange-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend Chart */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Trend</h2>
            {chartData.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-600 dark:text-slate-400">
                No data available
              </div>
            )}
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Category Distribution</h2>
            {chartData.categoryChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.categoryChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) =>
                      ` (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {chartData.categoryChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-600 dark:text-slate-400">
                No data available
              </div>
            )}
          </div>
        </div>


        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Category Spending Breakdown
          </h2>

          {chartData.categoryChart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Spent */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Total Spent</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData.categoryChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                      minTickGap={0}
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(148, 163, 184, 0.01)" }}
                    />
                    <Bar
                      dataKey="total"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      name="Total Spent"
                      activeBar={{ fill: "#3b82f6" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Transactions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Transactions</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData.categoryChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                      minTickGap={0}
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(148, 163, 184, 0.01)" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                      name="Transactions"
                      activeBar={{ fill: "#8b5cf6" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-600 dark:text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Daily Trend Chart */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Spending Pattern</h2>
          {chartData.dailyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#94a3b8" />

                {/* ✅ FIXED TOOLTIP */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(148, 163, 184, 0)" }} // prevents white hover background
                />

                <Legend />

                {/* ✅ FIXED BAR HOVER COLOR */}
                <Bar
                  dataKey="total"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Daily Total"
                  activeBar={{ fill: "#10b981" }} // prevents white/light hover
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-600 dark:text-slate-400">
              No data available
            </div>
          )}
        </div>


        {/*  */}
      </div>
    </div>
  );
};

export default Analytics;
