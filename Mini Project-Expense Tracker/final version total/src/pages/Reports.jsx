import { useState, lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import {
  setSearch,
  setCategory,
  setMonth,
  setYear,
  setSort,
  setAmountRange,
  fetchFilteredExpenses,
  resetFilters,
} from "../redux/Report/reportSelectors";
import ReportSummary from "../components/ReportSummary";
import { fetchExpenses } from "../redux/Expense/expenseSlice";
import { fetchCategories } from "../redux/Category/categorySlice";

//lazily loading the ReportTable component to keep initial bundle size small and improve loading performance
//suspense fallback will show while table loads
const ReportTable = lazy(() => import("../components/ReportTable"));

export default function Reports() {
  //main reports page component which handles all filtering,pagination,searching and summary display
  const dispatch = useDispatch();
  //local state for amount range inputs (min/max) which are applied only when user clicks Apply Range button
  //currentPage manages pagination state, itemsPerPage is fixed at 10 items per page for consistent UX
  const [amountRange, setLocalAmountRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get data from Redux store using useSelector hooks
  //filters contains all current filter states (search,category,month,year,sort,minAmount,maxAmount)
  //filteredExpenses is the result of applying all filters via fetchFilteredExpenses thunk (detailed explanation below)
  //summary is allTimeSummary calculated from ALL expenses (not filtered ones) showing total transactions, total amount, last transaction date
  //categories fetched from categorySlice for category dropdown
  //expensesLoading tracks when expense data is ready to trigger initial filtering
  const filters = useSelector((state) => state.report.filters);
  const filteredExpenses = useSelector(
    (state) => state.report.filteredExpenses,
  );
  const summary = useSelector((state) => state.report.allTimeSummary);
  const categories = useSelector((state) => state.categories.categoryItems);
  const expensesLoading = useSelector((state) => state.expenses.status);

  // Initial data fetch on component mount
  //fetchCategories() populates categories dropdown from Category slice
  //fetchExpenses() populates expenses list from Expense slice
  //both are async thunks which update their respective slices when fulfilled
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Trigger filtering when expenses are successfully loaded for the first time
  //fetchFilteredExpenses is the main Redux thunk (detailed below) which applies ALL filters and returns both filtered data + allTimeSummary
  //this ensures table shows data immediately after expenses load
  useEffect(() => {
    if (expensesLoading === "success") {
      dispatch(fetchFilteredExpenses());
    }
  }, [expensesLoading, dispatch]);

  // Re-trigger filtering whenever ANY filter changes
  //this useEffect watches the entire filters object and calls fetchFilteredExpenses to recompute filtered results
  //ensures table always reflects current filter state
  useEffect(() => {
    dispatch(fetchFilteredExpenses());
  }, [filters, dispatch]);

  // Reset all filters to initial state when component unmounts
  //prevents filter state from persisting between navigation (clean slate on next visit)
  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch]);

  // Pagination calculations
  //totalPages computed from filtered expenses length divided by items per page
  //paginatedExpenses slices the filtered data for current page only (performance optimization - don't render all rows)
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

  // Reset pagination to page 1 whenever filtered results change
  //prevents showing empty page or invalid page numbers after filtering reduces results
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredExpenses.length]);

  // Filter handler functions - all dispatch to reportSlice reducers which update filter state immutably
  //each handler corresponds to a specific filter type and triggers useEffect which calls fetchFilteredExpenses
  const handleSearch = (value) => {
    dispatch(setSearch(value));
  };

  const handleCategoryChange = (value) => {
    dispatch(setCategory(value));
  };

  const handleMonthChange = (value) => {
    dispatch(setMonth(value));
  };

  const handleYearChange = (value) => {
    dispatch(setYear(value));
  };

  const handleSortChange = (value) => {
    dispatch(setSort(value));
  };

  // Amount range is handled locally first, then dispatched only when Apply Range button clicked
  //this prevents filtering on every keystroke (better UX than live filtering numbers)
  const handleApplyRange = () => {
    dispatch(setAmountRange({ min: amountRange.min, max: amountRange.max }));
  };

  // Generate CSV from filtered expenses and trigger browser download
  //simple CSV format with date,title,categoryId,amount columns
  //uses Blob + URL.createObjectURL for client-side file generation (no server needed)
  const downloadReport = () => {
    const csv =
      "Date,Title,Category,Amount\n" +
      filteredExpenses
        .map((e) => `${e.date},${e.title},${e.categoryId},${e.amount}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expense-report.csv";
    a.click();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      {/* main container with max width for large screens */}
      <div className="max-w-7xl mx-auto">
        {/* header section with title, subtitle and download button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reports
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base">
              View expense reports and summaries
            </p>
          </div>
          {/* download button triggers CSV export of current filtered data */}
          <button
            className="px-4 md:px-6 py-2 md:py-3 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 whitespace-nowrap transition-colors"
            onClick={downloadReport}
            aria-label="Download expense report as CSV"
          >
            Download
          </button>
        </div>

        {/* Summary section - shows allTimeSummary from ALL expenses (not filtered) */}
        {/* ReportSummary component receives summary prop and displays total transactions, amount, last transaction date */}
        <section
          className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 p-3 md:p-4 text-gray-900 dark:text-white"
          aria-labelledby="summary-heading"
        >
          <h2
            id="summary-heading"
            className="text-base md:text-lg font-semibold mb-3"
          >
            Expense Summary
          </h2>
          <ReportSummary summary={summary} />
        </section>

        {/* Global search input - filters by expense title */}
        {/* debounced via Redux filtering logic */}
        <div className="mb-6 mt-6 md:mt-8">
          <div className="w-full sm:w-4/5 md:w-3/5 relative">
            <label htmlFor="expense-search" className="sr-only">
              Search expenses
            </label>
            <FiSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400 w-5 h-5 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="expense-search"
              type="text"
              aria-label="Search expenses"
              placeholder="Search expense..."
              value={filters.search}
              className="w-full pl-12 pr-4 py-3 md:py-4 rounded-[500px] bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition-all"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters section - comprehensive filtering controls grouped in responsive grid */}
        {/* amount range, category, month, year, sort all controlled by Redux */}
        <fieldset className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 md:p-6 mb-6 bg-white dark:bg-slate-800/30 backdrop-blur-sm">
          <legend className="text-gray-900 dark:text-white font-semibold mb-4 text-sm md:text-base">
            Filters
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Amount range inputs - local state until Apply Range clicked */}
            <div>
              <label
                htmlFor="min-amount"
                className="block text-xs md:text-sm text-gray-600 dark:text-slate-300 mb-1"
              >
                Min Amount
              </label>
              <input
                id="min-amount"
                type="number"
                placeholder="₹0"
                value={amountRange.min}
                onChange={(e) =>
                  setLocalAmountRange({ ...amountRange, min: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                aria-label="Minimum amount filter"
              />
            </div>
            <div>
              <label
                htmlFor="max-amount"
                className="block text-xs md:text-sm text-gray-600 dark:text-slate-300 mb-1"
              >
                Max Amount
              </label>
              <input
                id="max-amount"
                type="number"
                placeholder="₹999,999"
                value={amountRange.max}
                onChange={(e) =>
                  setLocalAmountRange({ ...amountRange, max: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                aria-label="Maximum amount filter"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
              {/* Apply Range button dispatches setAmountRange which triggers filtering useEffect */}
              <button
                className="w-full px-3 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 whitespace-nowrap text-sm transition-colors"
                onClick={handleApplyRange}
                aria-label="Apply amount range filter"
              >
                Apply Range
              </button>
            </div>
            {/* Category dropdown populated from categories fetched via fetchCategories() */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-xs md:text-sm text-gray-600 dark:text-slate-300 mb-1"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={filters.category}
                className="w-full px-3 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Month dropdown - filters by month number (1-12) */}
            <div>
              <label
                htmlFor="month-filter"
                className="block text-xs md:text-sm text-gray-600 dark:text-slate-300 mb-1"
              >
                Month
              </label>
              <select
                id="month-filter"
                value={filters.month}
                className="w-full px-3 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                onChange={(e) => handleMonthChange(e.target.value)}
                aria-label="Filter by month"
              >
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            {/* Year dropdown - filters by full year */}
            <div>
              <label
                htmlFor="year-filter"
                className="block text-xs md:text-sm text-gray-600 dark:text-slate-300 mb-1"
              >
                Year
              </label>
              <select
                id="year-filter"
                value={filters.year}
                className="w-full px-3 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                onChange={(e) => handleYearChange(e.target.value)}
                aria-label="Filter by year"
              >
                <option value="">All Years</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            {/* Sort dropdown - asc/desc by date */}
            <div>
              <label
                htmlFor="sort-filter"
                className="block text-xs md:text-sm text-gray-600 dark:text-slate-300 mb-1"
              >
                Sort
              </label>
              <select
                id="sort-filter"
                value={filters.sort}
                className="w-full px-3 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort expenses by"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Main table section - shows paginated filtered expenses */}
        {/* ReportTable receives only current page data for performance */}
        <section
          className="mt-6 md:mt-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700/50 overflow-x-auto md:overflow-visible"
          aria-labelledby="report-table-heading"
        >
          <h2 id="report-table-heading" className="sr-only">
            Expense Report Table
          </h2>
          <Suspense
            fallback={
              <div className="p-6 text-gray-700 dark:text-white text-center">
                Loading table...
              </div>
            }
          >
            <ReportTable expenses={paginatedExpenses} categories={categories} />
          </Suspense>
        </section>

        {/* Pagination controls - Previous/Next + page numbers (smart ellipsis for many pages) */}
        {/* shows results summary like "Showing 1 to 10 of 25 results" */}
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 dark:text-slate-300 text-sm md:text-base">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(endIndex, filteredExpenses.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredExpenses.length}</span>{" "}
            results
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            {/* Previous button - disabled on page 1 */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm md:text-base"
              aria-label="Previous page"
            >
              Previous
            </button>

            {/* Page number buttons - shows 5 pages max with smart positioning (1,2,3,4,5 or ...,3,4,5,...,last) */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 md:px-3 py-2 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button - disabled on last page */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 md:px-4 py-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm md:text-base"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
