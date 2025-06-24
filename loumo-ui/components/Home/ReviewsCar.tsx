"use client"

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useReviews } from "@/data/data"
import Stars from "../ui/stars"

export function ReviewsCar() {
    const [emblaRef, setEmblaRef] = React.useState<any>(null)
    const reviews = useReviews();

    React.useEffect(() => {
        if (!emblaRef) return

        const interval = setInterval(() => {
            if (emblaRef.canScrollNext()) {
                emblaRef.scrollNext()
            } else {
                emblaRef.scrollTo(0)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [emblaRef])

    return (
        <div className="max-w-[1400px] w-full md:px-7 overflow-hidden">
            {/* Version Carousel pour mobile (en dessous de md) */}
            <div className="lg:hidden">
                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                        startIndex: 0,
                        inViewThreshold: 0.5,
                    }}
                    setApi={setEmblaRef}
                    className="w-full relative"
                >
                    <CarouselContent className="flex">
                        {reviews.map((review, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-[70%] sm:basis-[50%] md:basis-[40%] lg:basis-[25%] flex-shrink-0"
                            >
                                <div className='w-full h-full flex flex-col gap-4 px-6 py-5 border border-input bg-[#FFFEF8] rounded-[12px]'>
                                    <Stars note={review.note} taille={20} />
                                    <div className='flex flex-col gap-1'>
                                        <p className='font-semibold text-[24px] text-gray-900'>{review.title}</p>
                                        <p className='text-gray-700 text-[16px] font-normal'>{review.message}</p>
                                    </div>
                                    <p className='text-sm font-medium text-gray-700'>{review.author}</p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Version Grid pour desktop (à partir de md) */}
            <div className="hidden lg:grid md:grid-cols-3 gap-10">
                {reviews.map((review, index) => (
                    <div 
                        key={index}
                        className='w-full h-full flex flex-col gap-4 px-6 py-5 border border-input bg-[#FFFEF8] rounded-[12px]'
                    >
                        <Stars note={review.note} taille={20} />
                        <div className='flex flex-col gap-1'>
                            <p className='font-semibold text-[24px] text-gray-900'>{review.title}</p>
                            <p className='text-gray-700 text-[16px] font-normal'>{review.message}</p>
                        </div>
                        <p className='text-sm font-medium text-gray-700'>{review.author}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}