import { Pagination as PaginationUI, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    variant?: "simple" | "full";
}

export function Pagination({ currentPage, totalPages, onPageChange, variant = "full" }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center mt-8">
            <PaginationUI>
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange(currentPage - 1)}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    )}

                    {variant === "simple" ? (
                        // Simple variant: show current page ±1
                        <>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => onPageChange(currentPage - 1)}
                                        className="cursor-pointer"
                                    >
                                        {currentPage - 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => onPageChange(currentPage)}
                                    isActive
                                    className="cursor-pointer"
                                >
                                    {currentPage}
                                </PaginationLink>
                            </PaginationItem>

                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => onPageChange(currentPage + 1)}
                                        className="cursor-pointer"
                                    >
                                        {currentPage + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                        </>
                    ) : (
                        // Full variant: show all pages with ellipsis
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                        })
                    )}

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => onPageChange(currentPage + 1)}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </PaginationUI>
        </div>
    );
}
