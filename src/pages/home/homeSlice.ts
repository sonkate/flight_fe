import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import voucherApi from "api/voucherApi";
import { IVoucher } from "pages/interface";

const initialState: { voucherList: IVoucher[] } = {
  voucherList: [],
};

export const getAllVouchers = createAsyncThunk(
  "home/getAllVouchers",
  async () => {
    const res = await voucherApi.getAllVouchers();
    return res;
  }
);

const home = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builders) => {
    builders.addCase(
      getAllVouchers.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.voucherList = action.payload;
      }
    );
  },
});

const { reducer } = home;
export default reducer;
