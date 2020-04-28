import React, { useContext, useState }  from 'react';
import AssignClient from "../components/orders/AssignClient";
import AssignProduct from "../components/orders/AssignProduct";
import OrderSummary from "../components/orders/OrderSummary";
import Total from "../components/orders/Total";
import { gql, useMutation } from '@apollo/client';
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

//Order context
import OrderContext from '../context/orders/OrderContext'

const NEW_ORDER = gql`
    mutation newOrder($input: OrderInput) {
        newOrder(input: $input){
            id
        }
    }
`;

const GET_ORDERS = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
        }
    }
`;

const NewOrder = () => {

    //Routing
    const router = useRouter();

    //State
    const [ message, setMessage ] = useState(null)

    //Use context and get functions and values
    const orderContext = useContext(OrderContext);
    const { client, products, total } = orderContext;
    const { id } = client;

    //New order mutation
    const [ newOrder ] = useMutation(NEW_ORDER, {
        update(cache, { data: { newOrder } }){
            //Get cache element that we want to update
            const { getOrdersSeller } = cache.readQuery({ query: GET_ORDERS });

            //Rewrite cache. The cache never must be updated
            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersSeller: [...getOrdersSeller, newOrder]
                }
            })
        }
    });

    const orderValidate = () => {
        return (products === null || products.length === 0 || !products.every( product => product.quantity > 0 ) || client === null || client.length === 0 ? " opacity-50 cursor-not-allowed " : '');
    }

    const createNewOrder = async () => {
        try {
            //Delete unwanted product information
            const order = products.map(({ creationDate, existence, __typename, ...product }) => product );

            const { data } = await newOrder({
                variables: {
                    input: {
                        client: id,
                        order
                    }
                }
            });
            
            //Redirect
            router.push('/orders');

            //Show alert
            Swal.fire(
                'Order added!',
                'The order was added successfully',
                'success'
            );

            
        } catch (error) {
            setMessage(error.message.replace('GraphQL error: ','').replace('Error: ',''));
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    }

    const showMessage = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    }

    return ( 
        <div>
            <h1 className="text-2xl text-gray-800 font-light">New Order</h1>
            
            { message && showMessage() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AssignClient/>
                    <AssignProduct/>
                    <OrderSummary/>
                    <Total/>
                    <button 
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${ orderValidate() }`}
                        onClick={() => createNewOrder()}
                    >Register ordern</button>
                </div>
            </div>
        </div>
    );
}
 
export default NewOrder;