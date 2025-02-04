"use client";

import { useLazyQuery, useQuery } from "@apollo/client";
import queries from "@/lib/queries";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function CompanyDetails({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [getDownloadUrl] = useLazyQuery(queries.GET_SIGNED_DOWNLOAD_URL);

  const { data, loading, error } = useQuery(queries.GET_COMPANY, {
    variables: {
      getCompanyId: companyId,
    },
    skip: !companyId,
  });

  useEffect(() => {
    const fetchLogoUrl = async () => {
      if (data?.getCompany?.logoS3Key) {
        try {
          const { data: logoData } = await getDownloadUrl({
            variables: { s3Key: data.getCompany.logoS3Key },
          });
          setLogoUrl(logoData?.getSignedDownloadUrl.url);
        } catch (error) {
          console.error("Error fetching logo:", error);
        }
      }
    };

    fetchLogoUrl();
  }, [data?.getCompany?.logoS3Key, getDownloadUrl]);

  if (loading) {
    return (
      <div className="min-h-screen text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-6 w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.getCompany) {
    return (
      <div className="min-h-screen text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl">Company not found</p>
          <button onClick={() => router.push("/companies")} className="mt-4 text-blue-500 hover:text-blue-400">
            Return to Companies
          </button>
        </div>
      </div>
    );
  }

  const company = data.getCompany;
  return (
    <div className="min-h-screen text-white p-4 bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-6">
              {logoUrl && (
                <div className="relative w-24 h-24">
                  <Image src={logoUrl} alt={`${company.legalName} logo`} fill className="rounded-lg object-contain" />
                </div>
              )}
              <h1 className="text-3xl font-semibold">{company.legalName}</h1>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button onClick={() => router.push("/companies")} className="text-blue-500 hover:text-blue-400">
                ← Back to Companies
              </button>
              <button
                onClick={() => router.push(`/company?companyId=${company.id}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm w-full rounded-sm shadow-sm font-medium"
              >
                Edit Company
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-medium mb-4">Company Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Email</p>
                  <p>{company.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p>{company.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Industry</p>
                  <p>{company.industry}</p>
                </div>
                <div>
                  <p className="text-gray-400">State of Incorporation</p>
                  <p>{company.stateOfIncorporation}</p>
                </div>
                {company.website && (
                  <div>
                    <p className="text-gray-400">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4">Employees</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400">Full-Time</p>
                  <p>{company.numberOfFullTimeEmployees}</p>
                </div>
                <div>
                  <p className="text-gray-400">Part-Time</p>
                  <p>{company.numberOfPartTimeEmployees}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total</p>
                  <p>{company.totalNumberOfEmployees}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4">Contact Person</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p>{`${company.primaryContactPerson.firstName} ${company.primaryContactPerson.lastName}`}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p>{company.primaryContactPerson.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p>{company.primaryContactPerson.phone}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4">Registered Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Street</p>
                  <p>{company.registeredAddress.street}</p>
                </div>
                <div>
                  <p className="text-gray-400">City</p>
                  <p>{company.registeredAddress.city}</p>
                </div>
                <div>
                  <p className="text-gray-400">State</p>
                  <p>{company.registeredAddress.state}</p>
                </div>
                <div>
                  <p className="text-gray-400">Country</p>
                  <p>{company.registeredAddress.country}</p>
                </div>
                <div>
                  <p className="text-gray-400">Zip Code</p>
                  <p>{company.registeredAddress.zipCode}</p>
                </div>
              </div>
            </section>

            {company.mailingAddress && (
              <section>
                <h2 className="text-xl font-medium mb-4">Mailing Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Street</p>
                    <p>{company.mailingAddress.street}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">City</p>
                    <p>{company.mailingAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">State</p>
                    <p>{company.mailingAddress.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Country</p>
                    <p>{company.mailingAddress.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Zip Code</p>
                    <p>{company.mailingAddress.zipCode}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
