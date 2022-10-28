import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from '../store/ui-slice';

const cartSlice =  createSlice({
    name:'cart',
    initialState:{
        itemsList:[],
        totalQuantity:0,
        showCart:false
    },
    reducers:{
      getUpdatedData(state,action){
        state.totalQuantity = action.payload.totalPrice;
        state.itemsList = action.payload.itemsList;
        
      },
        addToCart(state , action){
            const {id , price , name} = action.payload;

            // to check is item already exists in cart list
            const existingItem = state.itemsList.find((item) => item.id === id);
            if(existingItem){
                existingItem.quantity++,
                existingItem.totalPrice+= price
            }else{
              state.itemsList.push({
                id,
                price,
                quantity :1,
                price,
                name,
                totalPrice:price
              })
              state.totalQuantity++
            }
        },
        removeFromCart(state , action){
            const id = action.payload;
            const existingItem = state.itemsList.find(item =>item.id === id);
            if(existingItem.quantity === 1){
                state.itemsList= state.itemsList.filter(item => item.id !== id);
                   state.totalQuantity--;
            }else{
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }

        },
        setShowCart(state){
            state.showCart =  !state.showCart
        }
    }
})

export const sendCartData = (cart) => {
    return async (dispatch) =>{
        dispatch(uiActions.showNotification({
            open:true,
            message:"Sending Request !!",
            type:'warning'
          }))

          const sendRequest = async () => {
    
            const res =  await fetch('https://redux-http-3a6ba-default-rtdb.firebaseio.com/cartItems.json' , {
              method:'PUT',
              body: JSON.stringify(cart)
            });
      
            const data = await res.json();
            dispatch(uiActions.showNotification({
              open:true,
              message:"Send Request To Database Successfully !!",
              type:'success'
            }))
          } 

        try {
            await sendRequest()
        } catch (error) {
            dispatch(uiActions.showNotification({
                open:true,
                message:"Send Request Failed !!",
                type:'error'
              }))
        }  
    }
}

export const fetchCartData = () =>{
  return async (dispatch) => {
    const fetchHandler = async() =>{
      const res  = await fetch("https://redux-http-3a6ba-default-rtdb.firebaseio.com/cartItems.json");
      const data = await res.json();
      return data;
    }

    try {
      const cartData = fetchHandler();
      cartActions.getUpdatedData(cartData);
    } catch (error) {
      dispatch(uiActions.showNotification({
        open:true,
        message:"Send Request Failed !!",
        type:'error'
      }))
    }
  }
}

export const cartActions = cartSlice.actions;

export default cartSlice;