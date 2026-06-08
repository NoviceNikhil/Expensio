import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryServices from "./categoryServices";
//handling the api endpoints redux functionality where the createasync thunk middleware is made use of
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (queryString, thunkAPI) => {
    try {
      return await categoryServices.getCategories(queryString);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryData) => {
    return await categoryServices.createCategory(categoryData);
  },
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (categoryData) => {
    return await categoryServices.editCategory(categoryData);
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    return await categoryServices.removeCategory(id);
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoryItems: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.categoryItems = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        ((state.status = "failure"), (state.error = action.error.message));
      })

      //   add category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryItems.push(action.payload);
      })
      //   update category -> extra reducer
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categoryItems.findIndex(
          (catItem) => catItem.id === action.payload.id,
        );
        if (index != -1) {
          state.categoryItems[index] = action.payload;
        }
      })

      //   delete category -> extra reducer
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryItems = state.categoryItems.filter(
          (catItem) => catItem.id !== action.id,
        );
      });
  },
});

export default categorySlice.reducer;
