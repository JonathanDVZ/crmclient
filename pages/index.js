import Head from 'next/head'
import { gql, useQuery } from '@apollo/client';
import { useRouter } from "next/router";
import Link from 'next/link';
import Client from '../components/Client';

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

export default function Home() {

  //Routing
  const router = useRouter();

  //Apollo query
  const { data, loading, error } = useQuery(GET_CLIENTS_USER);

  if(loading) return 'Loading...';

  //When data is empty
  if(!data || !data.getClientsSeller) return router.push('/login');
  
  return (
    <div>
      <h1 className="text-2xl text-gray-800 font-light">Clients</h1>
      <Link href="/new-client">
        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold cursor-pointer w-full lg:w-auto text-center">New client</a>
      </Link>

      <div className="overflow-x-scroll">
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Name</th>
              <th className="w-1/5 py-2">Company</th>
              <th className="w-1/5 py-2">email</th>
              <th className="w-1/5 py-2">Delete</th>
              <th className="w-1/5 py-2">Edit</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getClientsSeller.map(client => (
              <Client key={client.id} client={client}/>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}
