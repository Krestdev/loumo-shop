import { LucideNotepadTextDashed } from 'lucide-react'
import React from 'react'

interface Props {
    message: string
}

const Redaction = ({ message }: Props) => {

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='flex flex-col gap-3 items-center'>
                <LucideNotepadTextDashed size={150} className='text-primary/20' />
                <p className='text-primary/20 text-[40px] font-bold'>{message}</p>
            </div>
        </div>
    )
}

export default Redaction
