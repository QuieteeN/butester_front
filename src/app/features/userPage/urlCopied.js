import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    copied: false,
    opened: false,
};

export const urlCopiedSlice = createSlice({
    name: 'urlCopiedSlice',
    initialState,
    reducers: {
        changeCopied: (state, action) => {
            state.copied = action.payload
        },
        changeOpened: (state, action) => {
            state.opened = action.payload
        }
    }
})

export const { changeCopied, changeOpened } = urlCopiedSlice.actions;

export default urlCopiedSlice.reducer;