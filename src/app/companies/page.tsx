"use client";

import CompanyDetails from "@/components/CompanyDetails";
import { Company } from "@/types";
import { getItem, removeItem } from "@/utils/storage";
import { getUser } from "@/utils/storage";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CompaniesPage() {
  const { data } = getUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const result = getItem<Company[]>("companies");
        if (result.data) {
          const sortedCompanies = result.data.slice().reverse();
          setCompanies(sortedCompanies);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!companyId) {
      fetchCompanies();
    }
  }, [companyId]);

  if (companyId) {
    return <CompanyDetails companyId={companyId} />;
  }

  const handleLogout = () => {
    removeItem("user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 animate-pulse">
                <div className="h-7 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Hi {data?.fullname}</h1>
          <div className="flex gap-4">
            <Link href="/company" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Create Company
            </Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>

        {companies.length === 0 ? (
          <p className="text-gray-400">No companies created yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold mb-2">{company.legalName}</h2>
                <p className="text-gray-400 text-sm mb-1">{company.email}</p>
                <p className="text-gray-400 text-sm">Industry: {company.industry}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-400 text-sm">Employees: {company.totalNumberOfEmployees}</p>
                  <p className="text-gray-400 text-sm">State: {company.stateOfIncorporation}</p>
                </div>
                <Link
                  href={`/companies?companyId=${company.id}`}
                  className="text-blue-500 hover:text-blue-400 text-sm mt-4 inline-block"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
