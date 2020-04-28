import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from "@apollo/client";

const NEW_ACCOUNT = gql`
    mutation newUser($input: UserInput){
        newUser(input: $input){
            id,
            name,
            lastname,
            email
        }
    }
`;

const Signup = () => {

    //Message state
    const [ message, setMessage ] = useState(null)

    //New user mutation from GraphQL
    const [ newUser ] = useMutation(NEW_ACCOUNT);

    //Routing
    const router = useRouter();

    //Form validation
    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name field is required'),
            lastname: Yup.string().required('Lastname field is required'),
            email: Yup.string().email('Email is not valid').required('Email field is required'),
            password: Yup.string().required('Password field is required').min(6, 'The password must be at least 6 characters')
        }),
        onSubmit: async values => {            
            try {
                const { name, lastname, email, password } = values;

                const { data } = await newUser({
                    variables: {
                        input: {
                            name,
                            lastname,
                            email,
                            password
                        }
                    }
                });

                //User created
                setMessage(`User created successfully: ${data.newUser.name}`);

                setTimeout(() => {
                    setMessage(null);

                    //User redirect
                    router.push('/login');
                }, 3000);

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
            {message && showMessage() }

            <h1 className="text-center text-2xl text-white font-light">Signup</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form 
                        className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="User password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.password && formik.errors.password ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.password}</p>
                            </div>
                        ) : null }

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                            value="Signup"
                        />

                    </form>
                </div>
            </div>           
        </div>
     );
}
 
export default Signup;