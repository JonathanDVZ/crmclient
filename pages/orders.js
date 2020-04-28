import Head from "next/head";
import Link from 'next/link';
import { gql, useQuery } from "@apollo/client";
import Order from "../components/Order";

const GET_ORDERS = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
            order {
                id
                name
                price
                quantity
            }
            total
            status
            seller
            client {
                id
                name
                lastname
                email
                phoneNumber
            }
        }
    }
`;

const Orders = () => {

    const { data, loading, error } = useQuery(GET_ORDERS);

    if(loading) return 'Loading...';

    const { getOrdersSeller } = data;

    return ( 
        <div>
            <h1 className="text-2xl text-gray-800 font-light">From Orders</h1>

            <Link href="/new-order">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold cursor-pointer">New Order</a>
            </Link>

            { getOrdersSeller .length === 0 ? (
                <p className="mt-5 text-center text-2xl">There are no orders yet</p>
            ) : (
                getOrdersSeller.map( order => (
                    <Order
                        key={order.id}
                        order={order}
                    />
                ))
            )}
        </div>
     );
}
 
export default Orders;