// src/store/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoginModalOpen: boolean;
}

const initialState: AuthState = {
  isLoginModalOpen: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
  },
});

export const { openLoginModal, closeLoginModal } = authSlice.actions;
export default authSlice.reducer;