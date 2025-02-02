"use client";

import queries from "@/lib/queries";
import { useQuery } from "@apollo/client";

export default function Home() {
  const companyId = "10";

  const { loading, error, data } = useQuery(queries.GET_COMPANY, {
    variables: { getCompanyId: companyId },
    skip: !companyId,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("data--->", data);
  return (
    <ul>
      <h1>Home</h1>
    </ul>
  );
}
