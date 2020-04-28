import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { gql, useMutation } from '@apollo/client';
import { useRouter } from "next/router";

const NEW_CLIENT = gql`
    mutation newClient($input: ClientInput){
        newClient(input: $input){
            id,
            name,
            lastname,
            email,
            phoneNumber
        }
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

const NewClient = () => {

    //Routing
    const router = useRouter();

    //Message state
    const [ message, setMessage ] = useState(null);

    //New client mutation
    const [ newClient ] = useMutation(NEW_CLIENT, {
        update(cache, { data: { newClient } }){
            //Get cache element that we want to update
            const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_USER });

            //Rewrite cache. The cache never must be updated
            cache.writeQuery({
                query: GET_CLIENTS_USER,
                data: {
                    getClientsSeller: [...getClientsSeller, newClient]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            company: '',
            email: '',
            phoneNumber: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name field is required'),
            lastname: Yup.string().required('Lastname field is required'),
            company: Yup.string().required('Company field is required'),
            email: Yup.string().email('Email is not valid').required('Email field is required')
        }),
        onSubmit: async values => {
            try {
                const { name, lastname, company, email, phoneNumber } = values;
                
                const { data } = await newClient({
                    variables: {
                        input: {
                            name,
                            lastname,
                            company,
                            email,
                            phoneNumber
                        }
                    }
                });

                router.push('/');
            } catch (error) {
                setMessage(error.message.replace('GraphQL error: ',''));
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            }
        }
    });

    const showMessage = () => {
        return (
            <div className="bg-white py-w px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    }

    return ( 
        <div>
            <h1 className="text-2xl text-gray-800 font-light">New Client</h1>

            { message && showMessage() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
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
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.name && formik.errors.name ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.name}</p>
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
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.lastname && formik.errors.lastname ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.lastname}</p>
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
                                value={formik.values.company}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.company && formik.errors.company ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.company}</p>
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
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.email}</p>
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
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer"
                            value="Register client"
                        />

                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default NewClient;