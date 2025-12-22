import { createSlice } from "@reduxjs/toolkit";

const popUpSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addNewAdminPopup: false,
    readBookPopup: false,
    recordBookPopup: false,
    returnBookPopup: false,
    addBookPopup: false,

    /* ✅ NEW: DELETE BOOK POPUP */
    deleteBookPopup: false,

    /* ✅ SIDEBAR STATE */
    sidebarOpen: false,
  },

  reducers: {
    toggleSettingPopup: (state) => {
      state.settingPopup = !state.settingPopup;
    },

    toggleAddNewAdminPopup: (state) => {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },

    toggleReadBookPopup: (state) => {
      state.readBookPopup = !state.readBookPopup;
    },

    toggleRecordBookPopup: (state) => {
      state.recordBookPopup = !state.recordBookPopup;
    },

    toggleReturnBookPopup: (state) => {
      state.returnBookPopup = !state.returnBookPopup;
    },

    toggleAddBookPopup: (state) => {
      state.addBookPopup = !state.addBookPopup;
    },

    /* ✅ NEW: DELETE BOOK TOGGLE */
    toggleDeleteBookPopup: (state) => {
      state.deleteBookPopup = !state.deleteBookPopup;
    },

    /* ✅ SIDEBAR TOGGLE */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    closeAllPopups: (state) => {
      state.settingPopup = false;
      state.addNewAdminPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.addBookPopup = false;

      /* ✅ CLOSE DELETE BOOK POPUP */
      state.deleteBookPopup = false;

      state.sidebarOpen = false;
    },
  },
});

export const {
  toggleSettingPopup,
  toggleAddNewAdminPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddBookPopup,

  /* ✅ NEW EXPORT */
  toggleDeleteBookPopup,

  toggleSidebar,
  closeAllPopups,
} = popUpSlice.actions;

export default popUpSlice.reducer;
