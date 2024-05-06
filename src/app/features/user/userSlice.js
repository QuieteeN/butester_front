import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: '',
    password: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeUsername: (state, action) => {
            state.username = action.payload;
        },
        changePassword: (state, action) => {
            state.password = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { changePassword, changeUsername } = userSlice.actions

export default userSlice.reducer