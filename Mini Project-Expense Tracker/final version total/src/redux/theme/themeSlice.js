import { createSlice } from "@reduxjs/toolkit";

// Get theme from localStorage or default to light mode
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") return true;
  if (savedTheme === "light") return false;
  // Default to light mode if no preference is saved
  return false;
};

const initialState = {
  darkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
