import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import Product from '../components/Product';
import Link from 'next/link';

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

const Products = () => {

    //Get products
    const { data, loading, error } = useQuery(GET_PRODUCTS);

    if(loading) return 'Loading...';

    return ( 
        <div>
            <h2 className="text-2xl text-gray-800 font-light">Products</h2>
            <Link href="/new-product">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold cursor-pointer">New Product</a>
            </Link>

            <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/5 py-2">Name</th>
                        <th className="w-1/5 py-2">Existence</th>
                        <th className="w-1/5 py-2">Price</th>
                        <th className="w-1/5 py-2">Delete</th>
                        <th className="w-1/5 py-2">Edit</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.getProducts.map(product => (
                        <Product key={product.id} product={product}/>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
     );
}
 
export default Products;