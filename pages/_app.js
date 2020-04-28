import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import Layout from "../components/Layout";
import OrderState from '../context/orders/OrderState'

const MyApp = ({ Component, pageProps }) => {

    return (
        <ApolloProvider client={client}>
            <OrderState>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </OrderState>
        </ApolloProvider>
    )
}

export default MyApp;