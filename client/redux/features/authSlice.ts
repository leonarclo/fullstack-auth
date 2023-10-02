import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface IUserData {
//   name: string;
//   email: string;
//   image?: string;
//   role: string;
//   accessToken: string;
// }

interface IAuth {
  user: string | null;
  accessToken: string | null;
}
interface authData {
  authData: IAuth | null;
}

const initialState: authData = {
  authData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IAuth>) => {
      state.authData = action.payload;
    },
    logOut: () => {
      return initialState;
    },
  },
});

export const { logOut, setCredentials } = authSlice.actions;
export default authSlice.reducer;
