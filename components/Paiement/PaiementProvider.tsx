"use client"

import { useStore } from '@/providers/datastore'
import React from 'react'
import { Failed } from '../Cart/Dialog/Failed'
import Pending from '../Cart/Dialog/Pending'
import { Success } from '../Cart/Dialog/Success'

const PaiementProvider = () => {

    const { failedPaiement, pendingPaiement, successMobileOpen, setFailedPaiement, setPendingPaiement, setSuccessMobileOpen } = useStore()
    return (
        <div>
            <Failed open={failedPaiement} setOpen={setFailedPaiement} />
            <Pending open={pendingPaiement} setOpen={setPendingPaiement} />
            <Success open={successMobileOpen} setOpen={setSuccessMobileOpen} />
        </div>
    )
}

export default PaiementProvider
