import Image from 'next/image';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchShortReportsFilter } from '@/app/lib/data';

export default async function InvoicesTable({
  query, 
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const shortReports = await fetchShortReportsFilter(query, currentPage);
  console.log(shortReports)
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {shortReports?.map((shortReport) => (
              <div
                key={shortReport.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{shortReport.report_title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{shortReport.target_company}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {shortReport.short_seller}
                    </p>
                    <p>{formatDateToLocal(shortReport.publication_date.toString())}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Target Company
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Short Seller
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Publication Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {shortReports?.map((report) => (
                <tr
                  key={report.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{report.report_title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {report.target_company}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {report.short_seller}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(report.publication_date.toString())}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
