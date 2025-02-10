import CardWrapper from '@/app/ui/companies/cards';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import Search from '@/app/ui/companies/search';

interface PageProps {
  searchParams?: {
    query?: string;
  };
}
// @ts-ignore 
export default function Page({ searchParams }: PageProps) {
  // @ts-ignore 
  const query = searchParams?.query || '';

  return (
    <div>
      <div className="w-full mb-4">
        <Search />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}