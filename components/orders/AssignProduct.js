import React, { useState, useEffect, useContext } from 'react';
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import OrderContext from "../../context/orders/OrderContext";

const GET_PRODUCTS = gql`
    query getProducts {
        getProducts {
            id
            name
            existence
            price
            creationDate
        }
    }
`;

const AssignProduct = () => {

    //State
    const [ products, setProducts ] = useState([])

    //Order context
    const orderContext = useContext(OrderContext);
    const { addProducts, totalUpdate } = orderContext;

    //Get Products Query
    const { data, loading, error } = useQuery(GET_PRODUCTS);

    useEffect(() => {
        addProducts(products);
        totalUpdate();
    }, [products]);

    if(loading) return null;

    const selectProduct = products => {
        setProducts(products);
    }

    const { getProducts } = data;

    return ( 
        <div>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Select the products to the order</p>

            <Select
                className="mt-3"
                options={getProducts}
                isMulti={true}
                onChange={ products => selectProduct(products) }
                getOptionValue={ product => product.id }
                getOptionLabel={ product => `${product.name} - ${product.existence} available` }
            />

        </div>
     );
}
 
export default AssignProduct;