import React, { useState, useEffect } from 'react';
import { gql, useMutation } from "@apollo/client";
import Swal from 'sweetalert2';

const UPDATE_ORDER = gql`
    mutation updateOrder($id: ID!, $input: OrderInput){
        updateOrder(id: $id, input: $input){
            status
        }
    }
`;

const DELETE_ORDER = gql`
    mutation deleteOrder($id: ID!){
        deleteOrder(id: $id)
    }
`;

const GET_ORDERS = gql`
    query getOrdersSeller {
        getOrdersSeller {
            id
        }
    }
`;

const Order = ({ order }) => {

    const { id, total, client, client: { name, lastname, email, phoneNumber }, status } = order;

    //Update Order mutation
    const [ updateOrder ] = useMutation(UPDATE_ORDER);
    const [ deleteOrder ] = useMutation(DELETE_ORDER, {
        update(cache){
            //Get cache element that we want to update
            const { getOrdersSeller } = cache.readQuery({ query: GET_ORDERS });

            //Rewrite cache. The cache never must be updated
            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersSeller: getOrdersSeller.filter( actualOrder => actualOrder.id != id )
                }
            })
        }
    });

    const [ statusOrder, setStatusOrder ] = useState(status);
    const [ statusClass, setStatusClass ] = useState(status);

    useEffect(() => {
        schangeStatusClass();
    }, [statusOrder])

    //Change order color by status
    const schangeStatusClass = () => {
        if(statusOrder === "PENDING"){
            setStatusClass('border-yellow-500');
        }
        else if(statusOrder === "COMPLETED"){
            setStatusClass('border-green-500');
        }
        else{
            setStatusClass('border-red-800');
        }
    }

    const changeStatus = async newStatus => {
        try {
            
            const { data } = await updateOrder({
                variables: {
                    id,
                    input: {
                        client: client.id,
                        status: newStatus
                    }
                }
            })

            setStatusOrder(data.updateOrder.status)
        } catch (error) {
            console.error(error);
        }
    }

    const confirmDeleteOrder = () => {
        Swal.fire({
            title: 'Do you want to delete this Order?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel it!'
        }).then(async (result) => {
            if (result.value) {
                try {
                    //Delete order
                    const { data } = await deleteOrder({
                        variables: {
                            id
                        }
                    });

                    //Show alert
                    Swal.fire(
                        'Deleted!',
                        data.deleteOrder,
                        'success'
                    );

                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    return ( 
        <div className={`${statusClass} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">Client: {name} {lastname}</p>

                {email && (
                    <p className="flex items-center my-2">
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h4 mr-2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        {email}
                    </p>
                )}
                {phoneNumber && (
                    <p className="flex items-center my-2">
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h4 mr-2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {phoneNumber}
                    </p>
                )}

                <h2 className="text-gray-800 font-bold mt-10">Order Status</h2>

                <select 
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
                    value={statusOrder}
                    onChange={ e => changeStatus(e.target.value)}
                >
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Order Summary</h2>
                {order.order.map( article => (
                    <div key={article.id} className="mt-4">
                        <p className="text-sm text-gray-600">Pruduct: {article.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {article.quantity}</p>
                    </div>
                ))}
                <p className="text-gray-800 mt-3 font-bold">Total: <span className="font-light"> $ {total}</span></p>

                <button
                    type="button"
                    className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold"
                    onClick={() => confirmDeleteOrder()}
                >
                    Delete order    
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
     );
}
 
export default Order;