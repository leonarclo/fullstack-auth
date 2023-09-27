import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserData {
  name: string;
  email: string;
  image?: string;
  token: string;
  role?: string;
  account_access_token?: string;
  account_expires_at?: Date;
}

interface IAuth {
  userData: IUserData;
}

const initialState: IAuth = {
  userData: {
    name: "",
    email: "",
    image: "",
    token: "",
    role: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IUserData>) => {
      state.userData = action.payload;
    },
    logOut: () => initialState,
  },
});

export const { logOut, setCredentials } = authSlice.actions;
export default authSlice.reducer;
