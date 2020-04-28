import React, { useContext } from 'react';
import OrderContext from "../../context/orders/OrderContext";
import ProductSummary from './ProductSummary';

const OrderSummary = () => {

    //Order context
    const orderContext = useContext(OrderContext);
    const { products } = orderContext;

    return ( 
        <div>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Adjust the products quantities</p>
            { products && products.length > 0 ? (
                <>
                    { products.map(product => (
                        <ProductSummary
                            key={product.id}
                            product={product}
                        />
                    ))}
                </>
            ) : (
                <p className="mt-5 text-sm">There are no products yet.</p>
            )}
        </div>
    );
}
 
export default OrderSummary;