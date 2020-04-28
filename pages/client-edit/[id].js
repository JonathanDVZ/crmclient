import React, { useState } from 'react';
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const GET_CLIENT = gql`
    query getClient($id: ID!) {
        getClient(id: $id) {
            name
            lastname
            email
            company
            phoneNumber
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation updateClient($id: ID!, $input: ClientInput!) {
        updateClient(id: $id, input: $input) {
            id
            name
            lastname
            company
            email
            phoneNumber
        }
    }
`

const EditClient = ({id}) => {

    //Routing
    const router = useRouter();

    //Message state
    const [ message, setMessage ] = useState(null);

    //Get client query
    const { data, loading, error } = useQuery(GET_CLIENT, {
        variables: {
            id
        }
    });

    //Update client mutation
    const [ updateClient ] = useMutation(UPDATE_CLIENT);

    //Schema validation
    const schemaValidation = Yup.object({
        name: Yup.string().required('Name field is required'),
        lastname: Yup.string().required('Lastname field is required'),
        company: Yup.string().required('Company field is required'),
        email: Yup.string().email('Email is not valid').required('Email field is required')
    });

    if(loading) return 'Loading...';

    const { getClient } = data;

    //Update client
    const updateInfoClient = async values => {
        try {
            const { name, lastname, company, email, phoneNumber } = values;

            const { data } = await updateClient({
                variables: {
                    id,
                    input: {
                        name,
                        lastname,
                        company,
                        email,
                        phoneNumber
                    }
                }
            });            

            //Show alert
            Swal.fire(
                'Updated!',
                'Client successfully updated!',
                'success'
            );

            router.push('/');
        } catch (error) {
            setMessage(error.message.replace('GraphQL error: ',''));
            setTimeout(() => {
                setMessage(null);
            }, 3000);  
        }
    }

    const showMessage = () => {
        return (
            <div className="bg-white py-w px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    }

    return ( 
        <div>
            <h1 className="text-2xl text-gray-800 font-light">Edit Client</h1>

            { message && showMessage() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidation }
                        enableReinitialize
                        initialValues={ getClient }
                        onSubmit={(values, functions) => {
                            try {
                                updateInfoClient(values);
                            } catch (error) {
                                setMessage(error.message.replace('GraphQL error: ',''));
                                setTimeout(() => {
                                    setMessage(null);
                                }, 3000);                                
                            }
                        }}
                    >
                    {props => {

                        return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-6 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="name"
                                    >
                                        Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        type="text"
                                        placeholder="User name"
                                        value={props.values.name}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                { props.touched.name && props.errors.name ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.name}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="lastname"
                                    >
                                        Lastname
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lastname"
                                        type="text"
                                        placeholder="User lastname"
                                        value={props.values.lastname}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                { props.touched.lastname && props.errors.lastname ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.lastname}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="company"
                                    >
                                        Company
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="company"
                                        type="text"
                                        placeholder="User company"
                                        value={props.values.company}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                { props.touched.company && props.errors.company ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.company}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="email"
                                        placeholder="User email"
                                        value={props.values.email}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                { props.touched.email && props.errors.email ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.email}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="phone number"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="User phone number"
                                        value={props.values.phoneNumber}
                                        onChange={props.handleChange}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer"
                                    value="Edit client"
                                />

                            </form>
                        )
                    }}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

EditClient.getInitialProps = async ({ query }) => {
    const { id } = query;

    return { id }
}
 
export default EditClient;