import Link from "next/link";

interface PageProps {
  type: string;
  pages: number[];
  currentPage?: number;
}

const Pagination = ({ type, pages, currentPage = 1 }: PageProps) => {
  const totalPages = pages.length;
  const pageLimit = 5;

  let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  if (endPage - startPage + 1 < pageLimit) {
    startPage = Math.max(endPage - pageLimit + 1, 1);
  }

  const paginationRange: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    paginationRange.push(i);
  }
  return (
    <div className="ml-20 mb-10">
      {pages.map((page) => (
        <Link href={`/${type}/${page}`} key={page}
            className={`px-4 py-2 border mx-2`}>
            {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;