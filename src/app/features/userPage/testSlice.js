import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: 1,
    url: '',
};

export const testSlice = createSlice({
    name: 'testSlice',
    initialState,
    reducers: {
        changeTestId: (state, action) => {
            state.id = action.payload;
        },
        changeUrl: (state, action) => {
            state.url = action.payload;
        }
    }
})

export const { changeTestId, changeUrl } = testSlice.actions;

export default testSlice.reducer;