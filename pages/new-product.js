import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { gql, useMutation } from '@apollo/client';
import { useRouter } from "next/router";

const NEW_PRODUCT = gql`
    mutation newProduct($input: ProductInput!){
        newProduct(input: $input){
            id
            name
            existence
            price
            creationDate
        }
    }
`;

const GET_PRODUCTS = gql`
    query getProducts {
        getProducts {
            id
            name
            existence
            price
            creationDate
        }
    }
`;

const NewProduct = () => {

    //Routing
    const router = useRouter();

    //Message state
    const [ message, setMessage ] = useState(null);

    //New product mutation
    const [ newProduct ] = useMutation(NEW_PRODUCT, {
        update(cache, { data: { newProduct } }){
            //Get cache element that we want to update
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

            //Rewrite cache. The cache never must be updated
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, newProduct]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            existence: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name field is required'),
            existence: Yup.number().typeError('Existence must be a number').required('Existence field is required'),
            price: Yup.number().typeError('Price must be a number').required('Price field is required')
        }),
        onSubmit: async values => {
            try {
                const { name, existence, price } = values;
                
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            existence,
                            price
                        }
                    }
                });

                router.push('/products');
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
            <h1 className="text-2xl text-gray-800 font-light">New Product</h1>

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
                                placeholder="Product name"
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
                                htmlFor="existence"
                            >
                                Existence
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="existence"
                                type="number"
                                placeholder="Product existence"
                                value={formik.values.existence}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.existence && formik.errors.existence ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.existence}</p>
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
                                placeholder="Product Price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.price && formik.errors.price ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 tex-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.price}</p>
                            </div>
                        ) : null }

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer"
                            value="Add Product"
                        />

                    </form>
                </div>
            </div>
        </div>
    );
}
 
export default NewProduct;