import { LucideWrench } from 'lucide-react'
import React from 'react'
import LocaleSwitcher from './localSwitcher'

interface Props {
    message: string,
    className?: string
    show?: boolean
    icon?: React.ReactNode
}

const Redaction = ({ message ,show = true, className = 'text-primary text-[22px] font-bold text-center', icon=<LucideWrench size={50} className={className} /> }: Props) => {

    return (
        <div className='w-full h-screen flex flex-col items-center pt-10'>
            {show && <span className="hidden md:flex">
                <LocaleSwitcher />
            </span>}
            <div className='flex flex-col gap-5 items-center justify-center  h-full'>
                <div className='flex flex-col gap-3 items-center'>
                    {/* < size={80} className={className} /> */}
                    {icon}
                    <p className={className}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Redaction
