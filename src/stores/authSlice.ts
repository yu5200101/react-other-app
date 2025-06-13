// src/store/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';
interface AuthState {
  isLoginModalOpen: boolean;
}

const initialState: AuthState = {
  isLoginModalOpen: false,
};

const authSlice: Slice<AuthState> = createSlice({
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