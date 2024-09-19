import { ProductInterface } from '@/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartState {
    cartItems: ProductInterface[];
}

const initialState: CartState = {
    cartItems: typeof window !== "undefined" ? JSON.parse(localStorage.getItem('cartItems') || '[]') : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        AddProductToCart: (state, action: PayloadAction<ProductInterface>) => {
            const existingProduct = state.cartItems.find(item => item._id === action.payload._id);
            if (!existingProduct) {
                state.cartItems.push(action.payload);
            }else {
                // If product exists, increase the quantity (optional logic)
                existingProduct.quantity += 1;
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        RemoveProductFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        EditProductInCart: (state, action: PayloadAction<ProductInterface>) => {
            state.cartItems = state.cartItems.map(item =>
                item._id === action.payload._id ? action.payload : item
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        ClearCart: (state) => {
            state.cartItems =[];
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }, 
    },
});

export const { AddProductToCart, RemoveProductFromCart, EditProductInCart , ClearCart} = cartSlice.actions;
export default cartSlice.reducer;
