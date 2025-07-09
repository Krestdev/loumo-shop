import { LucideNotepadTextDashed } from 'lucide-react'
import React from 'react'

interface Props {
    message: string,
    className?: string
}

const Redaction = ({ message, className='text-primary/20 text-[40px] font-bold text-center' }: Props) => {

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='flex flex-col gap-3 items-center'>
                <LucideNotepadTextDashed size={150} className={className} />
                <p className={className}>{message}</p>
            </div>
        </div>
    )
}

export default Redaction
