import React from 'react';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';
import Router from "next/router";

const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!){
        deleteClient(id: $id)
    }
`;

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

const Client = ({ client }) => {

    const { name, lastname, company, email, id } = client;

    //Delete client mutation
    const [ deleteClient ] = useMutation(DELETE_CLIENT, {
        update(cache){
            //Get cache element that we want to update
            const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_USER });

            //Rewrite cache. The cache never must be updated
            cache.writeQuery({
                query: GET_CLIENTS_USER,
                data: {
                    getClientsSeller: getClientsSeller.filter( actualClient => actualClient.id != id )
                }
            })
        }
    });

    //Delete client
    const deleteClientConfirm = () => {
        Swal.fire({
            title: 'Do you want to delete this client?',
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
                    //Delete client
                    const { data } = await deleteClient({
                        variables: {
                            id
                        }
                    });

                    //Show alert
                    Swal.fire(
                        'Deleted!',
                        data.deleteClient,
                        'success'
                    );

                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    const editClient = () => {
        Router.push({pathname: `/client-edit/${id}`})
    }

    return (         
        <tr>
            <td className="border px-4 py-2">{name} {lastname}</td>
            <td className="border px-4 py-2">{company}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">
                <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercarse font-bold"
                    onClick={() => deleteClientConfirm()}
                >
                    Delete 
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercarse font-bold"
                    onClick={() => editClient()}
                >
                    Edit 
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h4 ml-2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
            </td>
        </tr>
     );
}
 
export default Client;