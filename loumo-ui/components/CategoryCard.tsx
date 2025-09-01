
import React from 'react'
import Link from 'next/link'
import { LucidePuzzle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Category } from '@/types/types'

const CategoryCard = ({ category }: { category: Category }) => {
    const env = process.env.NEXT_PUBLIC_API_BASE_URL

    return (
        <Link href={`/categories/${category.slug}`}>
            <motion.div
                className="flex flex-col gap-2 max-w-[200px] w-full h-full"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
            >
                {category.imgUrl ? (
                    <motion.img
                        // src={category.slug}
                        src={
                            category.imgUrl.includes("http")
                                ? category.imgUrl
                                : `${env?.replace(/\/$/, "")}/${category.imgUrl.replace(/^\//, "")}`
                        }
                        alt={category.name}
                        className='max-w-[200px] w-full aspect-[4/3] object-cover rounded-[12px]'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />

                ) : (
                    <motion.div
                        className='w-full h-[150px] aspect-auto rounded-[12px] flex items-center justify-center bg-gray-100 text-white'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <LucidePuzzle size={80} />
                    </motion.div>
                )}
                <motion.p
                    className='text-[16px] text-gray-900 font-medium line-clamp-2'
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {category.name}
                </motion.p>
            </motion.div>
        </Link>
    )
}

export default CategoryCard