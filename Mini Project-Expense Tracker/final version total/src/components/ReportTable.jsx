import { memo } from "react";

function ReportTable({ expenses, categories }) {
  if (!expenses.length)
    return (
      <div 
        className="p-6 md:p-8 text-center text-gray-600 dark:text-slate-300 text-sm md:text-base"
        role="status"
        aria-live="polite"
      >
        No results found
      </div>
    );

  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div className="w-full overflow-x-auto">
      <table 
        className="w-full"
        role="table"
        aria-label="Expense Report Table"
        aria-describedby="table-description"
      >
        <thead className="bg-gray-100 dark:bg-slate-700/50 sticky top-0">
          <tr>
            <th 
              className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider"
              scope="col"
            >
              Date
            </th>
            <th 
              className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider"
              scope="col"
            >
              Title
            </th>
            <th 
              className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell"
              scope="col"
            >
              Category
            </th>
            <th 
              className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider"
              scope="col"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
          {expenses.map((e, index) => (
            <tr 
              key={e.id} 
              className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors focus-within:bg-gray-100 dark:focus-within:bg-slate-700/50"
              role="row"
              aria-rowindex={index + 2}
            >
              <td 
                className="px-4 md:px-6 py-3 md:py-4 text-gray-700 dark:text-slate-300 text-sm md:text-base"
                role="cell"
              >
                {new Date(e.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </td>
              <td 
                className="px-4 md:px-6 py-3 md:py-4 text-gray-900 dark:text-white font-medium text-sm md:text-base"
                role="cell"
              >
                {e.title}
              </td>
              <td 
                className="px-4 md:px-6 py-3 md:py-4 hidden sm:table-cell"
                role="cell"
              >
                <span 
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 whitespace-nowrap"
                  aria-label={`Category: ${categories.find(c => c.id === e.categoryId)?.name}`}
                >
                  {categories.find(c => c.id === e.categoryId)?.name}
                </span>
              </td>
              <td 
                className="px-4 md:px-6 py-3 md:py-4 text-right text-green-600 dark:text-green-400 font-semibold text-sm md:text-base"
                role="cell"
              >
                {fmt.format(e.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="table-description" className="sr-only">
        This table shows expense transactions with date, title, category, and amount. 
        On mobile devices, the category column is hidden to optimize space.
      </div>
    </div>
  );
}

export default memo(ReportTable);
