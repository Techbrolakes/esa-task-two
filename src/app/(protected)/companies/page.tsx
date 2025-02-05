"use client";

import CompanyCard from "@/components/reuseables/CompanyCard";
import CompanyDetails from "@/components/reuseables/CompanyDetails";
import UserGreeting from "@/components/reuseables/UserGreeting";
import { Company } from "@/types";
import { getItem } from "@/utils/storage";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CompaniesPage() {
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
    <div className="min-h-screen text-white">
      <UserGreeting />

      {companies.length === 0 ? (
        <p className="text-gray-400">No companies created yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
