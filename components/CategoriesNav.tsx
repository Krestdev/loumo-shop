"use client"

import CategoryQuery from '@/queries/category'
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Loading from './setup/loading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

const CategoriesNav = () => {
    
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

    function isActive(id:number):boolean{
        if(path[1]===String(id)){
            return true;
        }
        else {
            const activeCategory = categoryData.data && categoryData.data.find(z=>z.name === path[1]);
            if(!activeCategory){
                return false;
            } 
            else {
                return id === activeCategory.id;
            }
        }
    }

    return (
        <div className='w-full border-y border-y-input flex justify-center'>
            <section className="grid place-items-center overflow-x-auto scrollbar-hide">
                <div className="inline-flex gap-3">
                    {categoryData.isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-20 h-10 rounded-none" />)}
                    {categoryData.isSuccess &&
                        categoryData.data.map((x, i) => {
                            return (
                                <Link className={cn("font-mono h-10 w-fit shrink-0 px-3 flex items-center", isActive(x.id) ? "bg-primary text-primary-foreground" : "bg-[#FAFAFA]")} key={i} href={`/${x.id}`}>
                                    <span className="font-medium text-[14px] uppercase">{x.name}</span>
                                </Link>
                            )
                        })
                    }
                </div>
            </section>
        </div>
    )
}

export default CategoriesNav
