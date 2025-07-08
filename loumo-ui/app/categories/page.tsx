import CategoriesGrid from '@/components/Categories/CategoriesGrid'
import RequireAuth from '@/components/RequireAuth'
import React from 'react'

const page = () => {
    return (
        <RequireAuth>
            <div className='flex w-full justify-center'>
                <CategoriesGrid />
            </div>
        </RequireAuth>
    )
}

export default page
