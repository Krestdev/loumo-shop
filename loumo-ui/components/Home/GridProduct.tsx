import { Product } from '@/types/types'
import React from 'react'
import ProductComp from '../ui/product'
import { Skeleton } from '../ui/skeleton'

interface Props {
    title: string;
    products: (Product | undefined)[] | Product[] | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    className?: string;
    price?: number;
}

const GridProduct = ({
    title,
    products,
    isLoading,
    isSuccess,
    className = "px-7 py-12 gap-7",
    price
}: Props) => {

    // 🔍 On filtre les produits qui ont au moins un variant  selon le prix et le status
    const filteredProducts = products?.filter(
        (product) => product?.variants && product.variants.length > 0
    ) ?? [];


    return (
        <div className={`max-w-[1400px] w-full flex flex-col ${className}`}>
            <h1 className='category-title'>{title}</h1>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:h-[410px] overflow-hidden'>
                {isLoading && Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-[252px] h-[450px] rounded-none" />
                ))}
                {
                    isSuccess &&
                        filteredProducts && filteredProducts.length > 0 ?
                        filteredProducts.map((product, i) => (
                            <ProductComp product={product} key={i} />
                        )) :
                        <p>{"Aucun produit trouvé"}</p>
                }
            </div>
        </div>
    );
};

export default GridProduct;
