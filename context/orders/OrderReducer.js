import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    QUANTITY_PRODUCTS,
    TOTAL_UPDATE
} from '../../types';
import StateManager from 'react-select';

export default ( state, action ) => {
    switch (action.type) {
        case SELECT_CLIENT:
            return {
                ...state,
                client: action.payload
            }
            break;
        case SELECT_PRODUCT:
            return {
                ...state,
                products: action.payload
            }
            break;
        case QUANTITY_PRODUCTS:
            return {
                ...state,
                products: state.products.map( product => product.id === action.payload.id ? product = action.payload : product )
            }
            break;
        case TOTAL_UPDATE: 
            return {
                ...state,
                total: state.products && state.products.length > 0 ? state.products.reduce((newTotal, product) => newTotal += product.price * (product.quantity ? product.quantity : 0), 0 ) : 0
            }
            break
        default:
            break;
    }
}