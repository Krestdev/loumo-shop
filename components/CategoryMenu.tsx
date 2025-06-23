import CategoryQuery from '@/queries/category'
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Loading from './setup/loading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { LucideDatabase, LucidePuzzle } from 'lucide-react';

const CategoryMenu = () => {
    const category = new CategoryQuery();
    const categoryData = useQuery({
        queryKey: ["categoryFetchAll"],
        queryFn: () => category.getAll(),
    });

    if (categoryData.isLoading) {
        return <Loading status={"loading"} />;
    }

    if (categoryData.isError) {
        return <Loading status={"failed"} />;
    }

    const pathname = usePathname();
    const path = pathname.split("/");

    function isActive(id: number): boolean {
        if (path[1] === String(id)) {
            return true;
        }
        else {
            const activeCategory = categoryData.data && categoryData.data.find(z => z.name === path[1]);
            if (!activeCategory) {
                return false;
            }
            else {
                return id === activeCategory.id;
            }
        }
    }

    return (
        <section className='max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-7 px-7 py-8'>
            {/* <div className="inline-flex gap-3"> */}
            {categoryData.isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[200px] h-[200px] rounded-none" />)}
            {categoryData.isSuccess &&
                categoryData.data.slice(0, 6).map((x, i) => {
                    return (
                        <Link className="h-fit flex flex-col gap-2" key={i} href={`/${x.id}`}>
                            {x.imgUrl ?
                                <img src={x.imgUrl} alt={x.name} className='max-w-[200px] aspect-auto rounded-[12px]' /> :
                                <div className='max-h-[150.5] h-full aspect-square rounded-[12px] flex items-center justify-center bg-gray-100 text-white'>
                                    <LucidePuzzle size={80} />
                                </div>}
                            <p className='text-[16px] text-gray-900 font-medium line-clamp-2'>{x.name}</p>
                        </Link>
                    )
                })
            }
            {/* </div> */}
        </section>
    )
}

export default CategoryMenu
