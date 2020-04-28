import React, { useState, useEffect, useContext } from 'react';
import Select from "react-select";
import { gql, useQuery } from '@apollo/client';
import OrderContext from "../../context/orders/OrderContext";

const GET_CLIENTS_USER = gql`
  query getClientsSeller {
    getClientsSeller {
      id,
      name,
      lastname,
      company,
      email,
    }
  }
`;

const AssignClient = () => {

    //State
    const [ client, setClient ] = useState([])

    //Order context
    const orderContext = useContext(OrderContext);
    const { addClient } = orderContext;

    //Get clients
    const { data, loading, error } = useQuery(GET_CLIENTS_USER);

    useEffect(() => {
        addClient(client)
    }, [client]);

    if(loading) return null;

    const selectClient = client => {
      setClient(client);
    }

    const { getClientsSeller } = data;

    return (
        <div>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Assign a client to the order</p>

            <Select
                className="mt-3"
                options={getClientsSeller}
                onChange={ client => selectClient(client) }
                getOptionValue={ client => client.id }
                getOptionLabel={ client => client.name }
            />

        </div>
    );
}
 
export default AssignClient;