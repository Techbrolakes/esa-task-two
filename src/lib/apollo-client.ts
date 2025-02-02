import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://be2-fe-task-us-east-1-staging.dcsdevelopment.me/graphql", // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
