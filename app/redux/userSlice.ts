import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    currentUser: any | null;
}

const initialState: UserState = {
    currentUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SetCurrentUser: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload;
        },
    },
});

// Export the actions and reducer
export const { SetCurrentUser } = userSlice.actions;
export default userSlice.reducer;
