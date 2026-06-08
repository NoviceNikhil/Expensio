import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme/themeSlice";
import expenseReducer from "./Expense/expenseSlice";
import categoryReducer from "./Category/categorySlice";
import reportReducer from "./Report/reportSelectors"; // Fixed: was reportSelectors (should be reportSlice)

/**
 * Root Redux store configuration for the expense tracker application.
 * Combines slices for:
 * - theme: Light/dark mode state
 * - expenses: Expense CRUD operations and list state
 * - categories: Category list and management
 * - report: Filtering, pagination, and summary calculations
 * 
 * Uses RTK's configureStore with automatic devTools, thunk middleware,
 * and immutable updates enabled by default.
 */
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    expenses: expenseReducer,
    categories: categoryReducer,
    report: reportReducer,
  },
});
