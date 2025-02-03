"use client";

import { getUser } from "@/utils/storage";
import Link from "next/link";
import React from "react";

export default function CompanyPage() {
  const { data } = getUser();

  return (
    <div className="min-h-screen text-white bg-black p-3 space-y-4">
      <h1>Hi {data?.username}</h1>

      <Link href="/company" className="bg-blue-600 p-3 inline-block">
        Create Company
      </Link>
      <p>All companies page</p>
    </div>
  );
}
