import { Button } from '@/components/ui/button'
import {  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import React from 'react'

interface Props {
    totalItems: number,
    itemsPerPage: number,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }: Props) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    return (
        <div className="flex items-center justify-start mt-4 gap-4">

            {/* Contrôles de navigation */}
            <div className="flex items-center gap-2">
                <Button variant={"outline"}
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="text-[#71717A] h-9 w-9 disabled:opacity-30"
                >
                    <ChevronsLeft size={16} />
                </Button>
                <Button variant={"outline"}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-[#71717A] h-9 w-9 disabled:opacity-30"
                >
                    <ChevronLeft size={16} />
                </Button>
                <p>{currentPage}</p>
                <Button variant={"outline"}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-[#71717A] h-9 w-9 disabled:opacity-30"
                >
                    <ChevronRight size={16} />
                </Button>
                <Button variant={"outline"}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="text-[#71717A] h-9 w-9 disabled:opacity-30"
                >
                    <ChevronsRight size={16} />
                </Button>
            </div>
        </div>
    )
}

export default Pagination