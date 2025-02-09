import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';
  import { lusitana } from '@/app/ui/fonts';
  import { fetchCompanies, fetchShortReportsByTargetCompany } from '@/app/lib/data';
  import {
    CompaniesTableType
  } from '@/app/lib/definitions';
  
  export default async function CardWrapper({ query }: { query: string }) {
    const companies = await fetchCompanies(query);
    const shortReportsList = await fetchShortReportsByTargetCompany(query);
    
    // Convert list to dictionary grouped by target_company
    const shortReportsDict = shortReportsList.reduce((acc, report) => {
      if (!acc[report.target_company]) {
        acc[report.target_company] = new Set();
      }
      acc[report.target_company].add(report.short_seller);
      return acc;
    }, {} as Record<string, Set<string>>);

    console.log('Companies:', companies);
    console.log('Short Reports Dictionary:', shortReportsDict);
    
    return (
        <>
            {companies.map((company: CompaniesTableType) => (
                <Card 
                    key={company.id} 
                    title={company.name} 
                    ticker={company.ticker || ''} 
                    type="collected"
                    shortSellers={Array.from(shortReportsDict[company.name] || new Set())}
                />
            ))}
        </>
    );
  }
  
export function Card({
    title,
    ticker,
    type,
    shortSellers,
  }: {
    title: string;
    ticker: string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
    shortSellers: string[];
  }) {
    return (
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <div className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center`}>
          <p className="text-2xl">{ticker}</p>
          <div className="mt-2 text-sm">
            {shortSellers.length > 0 ? (
              shortSellers.map((seller, index) => (
                <div key={index} className="text-gray-500">
                  {seller}
                </div>
              ))
            ) : (
              'No reports'
            )}
          </div>
        </div>
      </div>
    );
  }
  