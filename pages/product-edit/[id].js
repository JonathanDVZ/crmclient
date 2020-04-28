import React, { useState } from 'react';
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const GET_PRODUCT  = gql`
    query getProduct($id: ID!) {
        getProduct(id: $id) {
            id
            name
            existence
            price
            creationDate
        }
    }
`;

const UPDATE_PRODUCT = gql`
    mutation updateProduct($id: ID!, $input: ProductInput!) {
        updateProduct(id: $id, input: $input) {
            id
            name
            existence
            price
            creationDate
        }
    }
`

const EditProduct = ({ id }) => {

    //Routing
    const router = useRouter();

    //Message state
    const [ message, setMessage ] = useState(null);

    //Get product query
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            id
        }
    });

    //Update product mutation
    const [ updateProduct ] = useMutation(UPDATE_PRODUCT);

    //Schema validation
    const schemaValidation = Yup.object({
        name: Yup.string().required('Name field is required'),
        existence: Yup.number().typeError('Existence must be a number').required('Existence field is required'),
        price: Yup.number().typeError('Price must be a number').required('Price field is required')
    });

    if(loading) return 'Loading...';

    const { getProduct } = data;

    //Update product
    const updateInfoProduct = async values => {
        try {
            let { name, existence, price } = values; 
            existence = Number(existence);
            price = Number(price);
            
            const { data } = await updateProduct({
                variables: {
                    id,
                    input: {
                        name,
                        existence,
                        price
                    }
                }
            });         

            //Show alert
            Swal.fire(
                'Updated!',
                'Product successfully updated!',
                'success'
            );
            router.push('/products');
        } catch (error) {
            console.error(error);
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
            <h1 className="text-2xl text-gray-800 font-light">Edit Product</h1>

            { message && showMessage() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={ schemaValidation }
                        enableReinitialize
                        initialValues={ getProduct }
                        onSubmit={(values, functions) => {
                            try {
                                updateInfoProduct(values);
                            } catch (error) {
                                setMessage(error);
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
                                        placeholder="Product name"
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
                                        htmlFor="existence"
                                    >
                                        Existence
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="existence"
                                        type="number"
                                        placeholder="Prduct existence"
                                        value={props.values.existence}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                { props.touched.existence && props.errors.existence ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.existence}</p>
                                    </div>
                                ) : null }

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="price"
                                    >
                                        Price
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="price"
                                        type="number"
                                        placeholder="Product price"
                                        value={props.values.price}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>

                                { props.touched.price && props.errors.price ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.price}</p>
                                    </div>
                                ) : null }

                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer"
                                    value="Edit product"
                                />

                            </form>
                        )
                    }}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

EditProduct.getInitialProps = async ({ query }) => {
    const { id } = query;

    return { id }
}
 
export default EditProduct;