import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chat: false,
    answer: true,
    passingTests: false,
};

export const leftMenuSlice = createSlice({
    name: 'leftMenu',
    initialState,
    reducers: {
        changeLeftMenu: (state, action) => {
            const propertyName = action.payload;
            for (let key in state) {
                if (key === propertyName) {
                    state[key] = true;
                } else {
                    state[key] = false;
                }
            }
        }
    }
})

export const { changeLeftMenu } = leftMenuSlice.actions;

export default leftMenuSlice.reducer;