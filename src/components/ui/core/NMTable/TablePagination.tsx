import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../../button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const TablePagination = ({totalPages}:{totalPages:number}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const router = useRouter();
    const pathName = usePathname();

    const handlePreviousPage = () => {
        if(currentPage > 1) {
            setCurrentPage(currentPage - 1);
            router.push(`${pathName}?page=${currentPage - 1}`);
        }
    }

    const handleNextPage = () => {
        if(currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            router.push(`${pathName}?page=${currentPage + 1}`);
        }
    }
  return (
    <div className="flex items-center gap-2 my-5">
      <Button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="w-8 h-8 rounded-full flex items-center justify-center"
      >
        <ArrowLeft />
      </Button>
      {
        [...Array(totalPages)].map((_,idx) => (
          <Button
            key={idx}
            onClick={() =>{ setCurrentPage(idx + 1);
                router.push(`${pathName}?page=${idx + 1}`);
            }}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            {idx + 1}
          </Button>
        ))
      }
      <Button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="w-8 h-8 rounded-full flex items-center justify-center"
      >
        <ArrowRight></ArrowRight>
      </Button>
    </div>
  );
};

export default TablePagination;
