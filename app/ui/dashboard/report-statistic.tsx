import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { shortReportStatistics } from '@/app/lib/definitions';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/
import { fetchShortReportsStatistic } from '@/app/lib/data';
export default async function ReportStatistics() { // Make component async, remove the props
  const reportStatistics = await fetchShortReportsStatistic(); // Fetch data inside the component
  const chartHeight = 350;
  console.log(reportStatistics)
  const { yAxisLabels, topLabel } = generateYAxis(reportStatistics);
 
  if (!reportStatistics || reportStatistics.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }
  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Short Report Statistics
      </h2>
      {/* NOTE: Uncomment this code in Chapter 7 */}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {reportStatistics.map((year) => (
            <div key={year.year} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * year.number}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {year.year}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 10 years</h3>
        </div>
      </div>
    </div>
  );
}
