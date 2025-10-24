import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface JobsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function JobsPagination({ currentPage, totalPages, onPageChange }: JobsPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center mt-8">
            <Pagination>
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange(currentPage - 1)}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current page
                        const shouldShow =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1;

                        if (!shouldShow) {
                            // Show ellipsis for gaps
                            if (page === 2 && currentPage > 4) {
                                return (
                                    <PaginationItem key={`ellipsis-${page}`}>
                                        <span className="px-3 py-2">...</span>
                                    </PaginationItem>
                                );
                            }
                            if (page === totalPages - 1 && currentPage < totalPages - 3) {
                                return (
                                    <PaginationItem key={`ellipsis-${page}`}>
                                        <span className="px-3 py-2">...</span>
                                    </PaginationItem>
                                );
                            }
                            return null;
                        }

                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => onPageChange(page)}
                                    isActive={page === currentPage}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => onPageChange(currentPage + 1)}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
