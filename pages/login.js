import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const AUTHENICATE_USER = gql`
    mutation authenticateUser($input: AuthenticateInput){
        authenticateUser(input: $input){
            token
        }
    }
`;

const Login = () => {

    //Routing
    const router = useRouter();

    //Message state
    const [ message, setMessage ] = useState(null);

    //Authentication user mutation
    const [ authenticateUser ] = useMutation(AUTHENICATE_USER);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email is not valid').required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async values => {
            try {
                const { email, password } = values;

                const { data } = await authenticateUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })
                
                setMessage('Authenticating...');

                //Save token in localstorage
                setTimeout(() => {
                    const { token } = data.authenticateUser;
                    localStorage.setItem('token',token);
                }, 1000);

                //Redirect to clients
                setTimeout(() => {
                    setMessage(null);
                    router.push('/');
                }, 2000);
                
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

            { message && showMessage() }

            <h1 className="text-center text-2xl text-white font-light">Login</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
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
                            value="Login"
                        />

                    </form>
                </div>
            </div>         
        </div>
     );
}
 
export default Login;