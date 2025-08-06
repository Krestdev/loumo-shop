"use client"

import CategoryQuery from '@/queries/category'
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Loading from './setup/loading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { useStore } from '@/providers/datastore';

const CategoriesNav = () => {

    const { address } = useStore()
    const pathname = usePathname();
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
        <div className='hidden md:flex justify-center w-full border-y border-y-input'>
            <section className="grid place-items-center overflow-x-auto scrollbar-hide">
                <div className="inline-flex gap-3">
                    {categoryData.isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-20 h-10 rounded-none" />)}
                    {categoryData.isSuccess &&
                        categoryData.data.filter(category => category.display === true && category.products?.some(product => product.variants && product.variants.length > 0 && product.variants.some((variant) =>
                            variant.stock?.some((stock) =>
                                stock.shop?.address?.zoneId === address?.zoneId
                            )))).map((x, i) => {
                                return (
                                    <Link className={cn("font-mono h-10 w-fit shrink-0 px-3 flex items-center", isActive(x.id) ? "bg-primary text-primary-foreground" : "bg-[#FAFAFA]")} key={i} href={`/categories/${x.slug}`}>
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