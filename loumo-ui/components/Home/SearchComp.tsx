'use client'

import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import ProductQuery from '@/queries/product';
import { Product } from '@/types/types';
import { useTranslations } from 'next-intl';

function SearchComp() {

    const router = useRouter();
    const searchParams = useSearchParams();

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);
    const t = useTranslations("Header");

    const handleClick = (e: Event) => {
        if (!formRef.current?.contains(e.target as Node)) {
            setOpen(false);
        }
    }

    const product = new ProductQuery();
    const productData = useQuery({
        queryKey: ["productFetchAll"],
        queryFn: () => product.getAll(),
    });


    const Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setOpen(false);
        setSearch('')
        router.push('/plats?' + createQueryString('nom', encodeURIComponent(search)))
    };

    useEffect(() => {
        if (productData.isSuccess) {
            setProducts(productData.data)
        }
    }, [productData.isSuccess, productData.data]);

    useEffect(() => {
        if (search.length > 0 && productData.isSuccess) {
            setOpen(true);
            setProducts(productData.data.filter((product) => product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())))
        } else {
            setOpen(false);
        }
    }, [search, productData.isSuccess, productData.data])
    useEffect(() => {
        // Add event listener for clicks outside the list
        document.addEventListener('mousedown', handleClick);
        // Remove event listener on cleanup
        return () => document.removeEventListener('mousedown', handleClick);
    }, [formRef])

    return (
        <form className='relative hidden lg:block' onSubmit={Submit} ref={formRef}>
            <Input type='search'
                placeholder={t("search")}
                className="w-[300px] flex-shrink-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
            {
                open &&
                <div className='absolute bottom-0 translate-y-[100%]  bg-white z-20 w-full max-h-72 overflow-y-auto'>
                    <div className="flex flex-col gap-0 divide-y" onClick={() => { setOpen(false); setSearch("") }}>
                        {
                            products.length > 0 ?
                                products.map((product, index) =>
                                    <Link key={index} href={`/catalog/${product.name}`}
                                        className='px-5 h-9 flex items-center hover:bg-slate-100'>
                                        {product.name.toLocaleLowerCase()}
                                    </Link>
                                ) :
                                <span className='w-full italic text-slate-700 py-2 px-4 bg-white'>{t("NoResult")}</span>
                        }
                    </div>
                </div>
            }
        </form>
    )
}

export default SearchComp