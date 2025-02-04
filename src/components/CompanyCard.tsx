import React from "react";
import Link from "next/link";
import { Company } from "@/types";
import { Globe, Phone } from "lucide-react";

const CompanyCard = ({ company }: { company: Company }) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-sm overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div>
              <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                {company.legalName}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{company.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full whitespace-nowrap">
            {company.industry}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">CEO</p>
            <p className="text-white font-semibold">
              {company.primaryContactPerson.firstName}
              <span className="pl-1">{company.primaryContactPerson.lastName}</span>
            </p>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Total Employees</p>
            <p className="text-white font-semibold">{company.totalNumberOfEmployees}</p>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">State</p>
            <p className="text-white font-semibold">{company.registeredAddress.state}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Country</p>
            <p className="text-white font-semibold">{company.registeredAddress.country}</p>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{company.phone}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-4 h-4" />

              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-blue-400 transition-colors"
              >
                {company.website.replace(/(^\w+:|^)\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="flex flex-wrap gap-2 mb-6">
          {company.facebookCompanyPage && (
            <a
              href={company.facebookCompanyPage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gray-800/50 hover:bg-blue-500/10 rounded-full text-xs text-gray-400 hover:text-blue-400 transition-colors"
            >
              Facebook
            </a>
          )}
          {company.linkedInCompanyPage && (
            <a
              href={company.linkedInCompanyPage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-gray-800/50 hover:bg-blue-500/10 rounded-full text-xs text-gray-400 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>

        <div className="mt-auto">
          <Link
            href={`/companies?companyId=${company.id}`}
            className="group/link flex items-center justify-between w-full px-4 py-3 bg-gray-800/50 hover:bg-blue-500/10 rounded-lg transition-all duration-300"
          >
            <span className="text-gray-300 group-hover/link:text-blue-400 text-sm font-medium">View Details</span>
            <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
