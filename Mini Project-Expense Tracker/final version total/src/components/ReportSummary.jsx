import { memo } from "react";

function ReportSummary({ summary }) {
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 my-0 md:my-2"
      role="group"
      aria-label="Expense summary statistics"
    >
      <div 
        className="px-3 py-3 md:py-4 rounded bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/75 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
        role="region"
        aria-labelledby="transactions-label"
      >
        <div id="transactions-label" className="text-xs text-gray-600 dark:text-slate-300 font-medium">Total Transactions</div>
        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1" aria-live="polite">
          {summary.totalTransactions}
        </div>
      </div>

      <div 
        className="px-3 py-3 md:py-4 rounded bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/75 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
        role="region"
        aria-labelledby="last-transaction-label"
      >
        <div id="last-transaction-label" className="text-xs text-gray-600 dark:text-slate-300 font-medium">Last Transaction</div>
        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1" aria-live="polite">
          {summary.lastTransactionDate}
        </div>
      </div>

      <div 
        className="px-3 py-3 md:py-4 rounded bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/75 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
        role="region"
        aria-labelledby="total-spent-label"
      >
        <div id="total-spent-label" className="text-xs text-gray-600 dark:text-slate-300 font-medium">Total Spent</div>
        <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 mt-1" aria-live="polite">
          {fmt.format(summary.totalAmount)}
        </div>
      </div>
    </div>
  );
}

export default memo(ReportSummary);
