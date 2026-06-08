// import { createSelector } from "@reduxjs/toolkit";

// const selectExpenses = (state) => state.expenses.items;
// const selectCategories = (state) => state.categories.items;

// export const selectFilteredExpenses = createSelector(
//   [selectExpenses, (_, filters) => filters],
//   (expenses, filters) => {
//     let data = [...expenses];

//     // category filter
//     if (filters.category !== "all") {
//       data = data.filter(e => e.categoryId === filters.category);
//     }

//     // date filter
//     if (filters.dateType !== "all") {
//       const now = new Date();
//       data = data.filter(e => {
//         const d = new Date(e.date);
//         if (filters.dateType === "monthly")
//           return d.getMonth() === now.getMonth();
//         if (filters.dateType === "yearly")
//           return d.getFullYear() === now.getFullYear();
//         return true;
//       });
//     }

//     // search
//     if (filters.search) {
//       data = data.filter(e =>
//         e.title.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     // sort
//     data.sort((a, b) =>
//       filters.sort === "desc"
//         ? new Date(b.date) - new Date(a.date)
//         : new Date(a.date) - new Date(b.date)
//     );

//     return data;
//   }
// );

// export const selectReportSummary = createSelector(
//   [selectFilteredExpenses],
//   (expenses) => ({
//     totalTransactions: expenses.length,
//     totalAmount: expenses.reduce((s, e) => s + e.amount, 0),
//     month:
//       expenses.length > 0
//         ? new Date(expenses[0].date).toLocaleString("default", {
//             month: "long",
//             year: "numeric",
//           })
//         : "N/A",
//   })
// );

// export const selectAllTimeSummary = createSelector(
//   [selectExpenses],
//   (expenses) => {
//     const sortedExpenses = [...expenses].sort(
//       (a, b) => new Date(b.date) - new Date(a.date)
//     );
    
//     return {
//       totalTransactions: expenses.length,
//       totalAmount: expenses.reduce((s, e) => s + e.amount, 0),
//       lastTransactionDate:
//         sortedExpenses.length > 0
//           ? new Date(sortedExpenses[0].date).toLocaleDateString("default", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })
//           : "N/A",
//     };
//   }
// );

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Calculate all-time summary from all expenses
const calculateAllTimeSummary = (allExpenses) => {
  if (!allExpenses || allExpenses.length === 0) {
    return {
      totalTransactions: 0,
      totalAmount: 0,
      lastTransactionDate: "N/A",
    };
  }

  const sorted = [...allExpenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return {
    totalTransactions: allExpenses.length,
    totalAmount: allExpenses.reduce((sum, e) => sum + e.amount, 0),
    lastTransactionDate: new Date(sorted[0].date).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};

export const fetchFilteredExpenses = createAsyncThunk(
  "report/fetchFilteredExpenses",
  (_, { getState }) => {
    const state = getState();
    const expenses = state.expenses.items;
    const filters = state.report.filters;

    let filtered = [...expenses];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(e => e.categoryId === filters.category);
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(e => e.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(e => e.amount <= parseFloat(filters.maxAmount));
    }

    // Month filter
    if (filters.month) {
      filtered = filtered.filter(e => {
        const date = new Date(e.date);
        return (date.getMonth() + 1).toString() === filters.month;
      });
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(e => {
        const date = new Date(e.date);
        return date.getFullYear().toString() === filters.year;
      });
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) =>
      filters.sort === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

    // Calculate all-time summary from ALL expenses
    const allTimeSummary = calculateAllTimeSummary(expenses);

    return { filteredExpenses: filtered, allTimeSummary };
  }
);

const initialState = {
  filters: {
    search: "",
    category: "all",
    month: "",
    year: "",
    sort: "desc",
    minAmount: "",
    maxAmount: "",
  },
  filteredExpenses: [],
  allTimeSummary: {
    totalTransactions: 0,
    totalAmount: 0,
    lastTransactionDate: "N/A",
  },
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setMonth: (state, action) => {
      state.filters.month = action.payload;
    },
    setYear: (state, action) => {
      state.filters.year = action.payload;
    },
    setSort: (state, action) => {
      state.filters.sort = action.payload;
    },
    setAmountRange: (state, action) => {
      state.filters.minAmount = action.payload.min;
      state.filters.maxAmount = action.payload.max;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredExpenses = action.payload.filteredExpenses;
        state.allTimeSummary = action.payload.allTimeSummary;
      })
      .addCase(fetchFilteredExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSearch,
  setCategory,
  setMonth,
  setYear,
  setSort,
  setAmountRange,
  resetFilters,
  
} = reportSlice.actions;

export default reportSlice.reducer;
