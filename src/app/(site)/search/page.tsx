import type { Metadata } from 'next';
import { searchIndex } from '@/lib/data';
import { SearchView } from '@/components/search-view';
import { Crumbs } from '@/components/chrome';

// Internal search results are kept out of the index; the products themselves are indexed.
export const metadata: Metadata = { title: 'Search', robots: { index: false, follow: true }, alternates: { canonical: '/search' } };

export default function Search() {
  return (
    <>
      <Crumbs items={[{ name: 'Search', path: '/search' }]} />
      <SearchView index={searchIndex().map(({ slabs: _s, ...rest }) => rest)} />
    </>
  );
}
