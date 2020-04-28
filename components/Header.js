import React from 'react';
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const GET_USER = gql`
    query getUSer {
        getUser {
            id
            name
            lastname
            email
        }
    }
`;

const Header = () => {

    //Routing
    const router = useRouter();

    //Apollo query
    const { data, loading, error } = useQuery(GET_USER);

    //Avoid accessing data before getting results
    if(loading) return null;

    //When data is empty
    if(!data || !data.getUser) return router.push('/login');

    const { name, lastname } = data.getUser

    const closeSession = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }

    return ( 
        <div className="sm:flex justify-between mb-6">
            <p className="mr-2 mb-5 lg:mb-0">Hello: {name} {lastname}</p>

            <button 
                onClick={() => closeSession()}
                type="button" 
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
            >
                Sign out
            </button>
        </div>
     );
}
 
export default Header;