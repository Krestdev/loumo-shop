"use client";

import { useStore } from '@/providers/datastore';
import React from 'react'
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { LucideShoppingCart } from 'lucide-react';
import { motion } from "framer-motion";

const Cartt = () => {

    const { currentOrderItems } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const cartItemCount = currentOrderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

    return (
        cartItemCount > 0 && pathname !== "/cart" &&
        <motion.div
            className='max-w-[1400px] w-fit bottom-5 right-[-20] md:right-0 fixed flex z-10'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
            >
                <Button
                    onClick={() => router.push("/cart")}
                    className='w-fit px-0 pl-0 pr-7 gap-0 h-9 bg-orange-400 hover:bg-orange-400'
                >
                    <div className='relative text-white text-[18px] py-6 px-6 bg-orange-400 rounded-full'>
                        <LucideShoppingCart size={20} />
                        <p className='absolute top-3 right-4 text-[16px] z-10 text-white'>
                            {cartItemCount}
                        </p>
                    </div>
                    <p className='text-white text-[16px] font-bold'>
                        {`Voir mon panier`}
                    </p>
                </Button>
            </motion.div>
        </motion.div>
    )
}

export default Cartt;
