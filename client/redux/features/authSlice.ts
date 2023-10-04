import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserData {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  accessToken?: string;
}

interface authData {
  authData: IUserData | null;
}

const initialState: authData = {
  authData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IUserData>) => {
      state.authData = action.payload;
    },
    logOut: () => {
      return initialState;
    },
  },
});

export const { logOut, setCredentials } = authSlice.actions;
export default authSlice.reducer;
