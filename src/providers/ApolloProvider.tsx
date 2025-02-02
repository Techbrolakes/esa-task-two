"use client";

import client from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import React, { PropsWithChildren } from "react";

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}> {children}</ApolloProvider>;
};

export default ApolloClientProvider;
