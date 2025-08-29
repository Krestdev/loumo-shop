import { LucideWrench } from 'lucide-react'
import React from 'react'
import LocaleSwitcher from './localSwitcher'

interface Props {
    message: string,
    className?: string
    show?: boolean
}

const Redaction = ({ message, show = true, className = 'text-primary text-[40px] font-bold text-center' }: Props) => {

    return (
        <div className='w-full h-screen flex flex-col items-center pt-10'>
            {show && <span className="hidden md:flex">
                <LocaleSwitcher />
            </span>}
            <div className='flex flex-col gap-5 items-center justify-center  h-full'>
                <div className='flex flex-col gap-3 items-center'>
                    <LucideWrench size={150} className={className} />
                    <p className={className}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Redaction
