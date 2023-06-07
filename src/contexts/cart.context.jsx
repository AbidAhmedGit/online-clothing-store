import { createContext, useReducer, useState } from "react";
import { createAction } from "../utils/reducer/reducer.util";
export const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.id === productToAdd.id
    );

    if (existingCartItem) {
      return cartItems.map((cartItem) =>
        cartItem.id === productToAdd.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    }

    return [...cartItems, { ...productToAdd, quantity: 1 }];
  };

const removeCartItem = (cartItems, cartItemToRemove) => {
    // find cart item to remove
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
    );

    // if the quantity is equal to 1 then remove the item from the cart
    // if the cartIem.id does not equal cartitem to remove keep the value
    if (existingCartItem.quantity === 1) {
        return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
    }

    // return back cart items with matching cart item with reduced quantity
    return cartItems.map((cartItem) =>
        cartItem.id === cartItemToRemove.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
};

const clearCartItem = (cartItems, cartItemToClear) => {
    return cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id);
};



const CART_ACTION_TYPES = {
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
}

const INITIAL_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
};

function cartReducer(state, action){
    const {type, payload} = action;

    // const payload = {
    //     cartItems,
    //     cartCount,
    //     cartTotal
    // };
    switch(type){
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload
            }
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload,
            }
        default:
            throw new Error (`cannot handle ${type} in cart.context.js in src>contexts`)
    }
}

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0,
});

export const CartProvider = ({ children }) => {
    const [
        {
            isCartOpen,
            cartItems,
            cartCount,
            cartTotal,
        },
        dispatch
    ] = useReducer(cartReducer, INITIAL_STATE);

    const updateCartItemsReducer = (newCartItems) => {
        const newCartCount = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity,
            0
          );
        const newCartTotal = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity * cartItem.price,
            0
          );
        // *new cart total 
        //*new cart item and 
        //*new cart count
        dispatch(
            createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
                cartItems: newCartItems,
                cartCount: newCartCount,
                cartTotal: newCartTotal,
            })
        )

    }

    const addItemToCart = (productToAdd) => {
        const newCartItems = (addCartItem(cartItems, productToAdd));
        updateCartItemsReducer(newCartItems)
    }

    const removeItemToCart = (cartItemToRemove) => {
        const newCartItems = (removeCartItem(cartItems, cartItemToRemove));
        updateCartItemsReducer(newCartItems)
    }

    const clearItemFromCart = (cartItemToClear) => {
        const newCartItems = (clearCartItem(cartItems, cartItemToClear));
        updateCartItemsReducer(newCartItems)
    }

    const setIsCartOpen = (bool) => {
        dispatch(
            createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool)
            )
    }
    const value = {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        addItemToCart,
        cartCount,
        removeItemToCart,
        clearItemFromCart,
        cartTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}