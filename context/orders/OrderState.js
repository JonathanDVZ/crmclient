import React, { useReducer } from 'react';
import OrderContext from './OrderContext';
import OrderReducer from './OrderReducer';

import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    QUANTITY_PRODUCTS,
    TOTAL_UPDATE
} from '../../types';

const OrderState = ({ children }) => {

    //Order state
    const initialState = {
        client: {},
        products: [],
        total: 0
    };

    const [ state, dispatch ] = useReducer(OrderReducer, initialState);

    //Modify the client
    const addClient = client => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client
        })
    }

    //Modify the products
    const addProducts = productsSelected => {

        let newState;

        if(productsSelected && state.products && state.products.length > 0){
            //Take a copy of the second array to assign the first one
            newState = productsSelected.map(product => {
                const newObject = state.products.find( stateProduct => stateProduct.id === product.id );
                return {...product, ...newObject}
            });
        }
        else{
            newState = productsSelected;
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newState
        })
    }

    //Modify products quantity
    const productsQuantity = product => {
        dispatch({
            type: QUANTITY_PRODUCTS,
            payload: product
        });
    }

    //Update total
    const totalUpdate = () => {
        dispatch({
            type: TOTAL_UPDATE
        })
    }


    return (
        <OrderContext.Provider
            value={{
                client: state.client,
                products: state.products,
                total: state.total,
                addClient,
                addProducts,
                productsQuantity,
                totalUpdate
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

export default OrderState;