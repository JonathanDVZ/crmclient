import React, { useEffect } from 'react';
import {
    BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { gql, useQuery } from '@apollo/client';

const GET_BEST_SELLERS = gql`
    query bestSellers {
        bestSellers {
            total
            seller {
                name
                lastname
                email
            }
        }
    }
`;

const BestSellers = () => {

    //Query
    const { data, loading, error, startPolling, stopPolling } = useQuery(GET_BEST_SELLERS);

    useEffect(() => {
        startPolling(1000);

        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if(loading) return 'Loading...';

    const { bestSellers } = data;

    const sellersGraphic = [];

    bestSellers.map((seller, index) => {
        sellersGraphic[index] = {
            ...seller.seller[0],
            total: seller.total
        }
    });

    return ( 
        <div>
            <h1 className="text-2xl text-gray-800 font-light">Best Sellers</h1>

            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={sellersGraphic}
                    margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182CE" />
                </BarChart>
            </ResponsiveContainer>
        </div>
     );
}
 
export default BestSellers;