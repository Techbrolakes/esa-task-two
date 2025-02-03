"use client";

import { getUser } from "@/utils/storage";
import Link from "next/link";
import React from "react";

export default function CompanyPage() {
  const { data } = getUser();

  return (
    <div className="min-h-screen text-lg text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
      <h1>Hi {data?.fullname}</h1>

      <Link href="/company" className="bg-blue-600 p-3 inline-block">
        Create Company
      </Link>

      <p>All companies page</p>
    </div>
  );
}
