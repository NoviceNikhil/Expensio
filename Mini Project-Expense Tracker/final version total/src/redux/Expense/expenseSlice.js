import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import expenseServices from "./expenseSerives";

// fetching expense items

const BASE_URL = "http://localhost:5000/expenses/";

export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async (queryString = "", thunkAPI) => {
    try {
      return await expenseServices.getExpenses(queryString);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addExpense = createAsyncThunk(
  "expense/addExpense",
  async (data) => {
    return await expenseServices.createExpense(data);
  },
);

export const updateExpense = createAsyncThunk(
  "expense/updateExpenses",
  async (data) => {
    return await expenseServices.editExpense(data);
  },
);

export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (id) => {
    return await expenseServices.removeExpense(id);
  },
);

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
    totalCounts: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload.data;
        state.totalCounts = action.payload.totalCount;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failure";
        state.error = action.error.message;
      })

      //   add expense builder properties
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      //   Edit specific expense item
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index != -1) {
          state.items[index] = action.payload;
        }
      })

      //   delete specific expense item
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;