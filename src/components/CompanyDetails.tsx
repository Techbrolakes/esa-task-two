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
    variables: { getCompanyId: companyId },
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
      <div className="min-h-screen text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 animate-pulse">
            <div className="h-8 bg-gray-700 rounded-lg mb-6 w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded-lg w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.getCompany) {
    return (
      <div className="min-h-screen text-white p-6 bg-gradient-to-br from-black via-[#060C21] to-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-300">Company not found</p>
          <button onClick={() => router.push("/companies")} className="mt-4 text-blue-400 hover:text-blue-300 transition-colors">
            Return to Companies
          </button>
        </div>
      </div>
    );
  }

  const company = data.getCompany;

  return (
    <div className="text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-xl border border-gray-800/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-900/50 p-8 border-b border-gray-800/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {logoUrl && (
                  <div className="relative w-20 h-20 md:w-24 md:h-24">
                    <Image
                      src={logoUrl}
                      alt={`${company.legalName} logo`}
                      fill
                      className="rounded-xl object-contain bg-white/5 p-2"
                    />
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {company.legalName}
                </h1>
              </div>

              <div className="flex flex-row md:flex-col items-center gap-4">
                <button
                  onClick={() => router.push("/companies")}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  ← Back
                </button>
                <button
                  onClick={() => router.push(`/company?companyId=${company.id}`)}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  Edit Company
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Company Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-gray-800">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Email" value={company.email} />
                <InfoItem label="Phone" value={company.phone} />
                <InfoItem label="Industry" value={company.industry} />
                <InfoItem label="State of Incorporation" value={company.stateOfIncorporation} />
                {company.website && (
                  <div className="col-span-full">
                    <InfoItem
                      label="Website"
                      value={
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {company.website}
                        </a>
                      }
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Employees Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-gray-800">Employees</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
                  <p className="text-gray-400 text-sm mb-1">Full-Time</p>
                  <p className="text-2xl font-semibold">{company.numberOfFullTimeEmployees}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
                  <p className="text-gray-400 text-sm mb-1">Part-Time</p>
                  <p className="text-2xl font-semibold">{company.numberOfPartTimeEmployees}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800/50">
                  <p className="text-gray-400 text-sm mb-1">Total</p>
                  <p className="text-2xl font-semibold">{company.totalNumberOfEmployees}</p>
                </div>
              </div>
            </section>

            {/* Contact Person */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-gray-800">Contact Person</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Name"
                  value={`${company.primaryContactPerson.firstName} ${company.primaryContactPerson.lastName}`}
                />
                <InfoItem label="Email" value={company.primaryContactPerson.email} />
                <InfoItem label="Phone" value={company.primaryContactPerson.phone} />
              </div>
            </section>

            {/* Registered Address */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-gray-800">Registered Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Street" value={company.registeredAddress.street} />
                <InfoItem label="City" value={company.registeredAddress.city} />
                <InfoItem label="State" value={company.registeredAddress.state} />
                <InfoItem label="Country" value={company.registeredAddress.country} />
                <InfoItem label="Zip Code" value={company.registeredAddress.zipCode} />
              </div>
            </section>

            {/* Mailing Address */}
            {company.mailingAddress && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-gray-800">Mailing Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Street" value={company.mailingAddress.street} />
                  <InfoItem label="City" value={company.mailingAddress.city} />
                  <InfoItem label="State" value={company.mailingAddress.state} />
                  <InfoItem label="Country" value={company.mailingAddress.country} />
                  <InfoItem label="Zip Code" value={company.mailingAddress.zipCode} />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="space-y-1">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white/90">{value}</p>
  </div>
);
