import { PDFViewer } from '@react-pdf/renderer'
import React from 'react'
import { OrderInvoice } from '../OrderInvoice'
import { Order, Product, ProductVariant } from '@/types/types'

interface Props {
    order?: Order
    products?: Product[]
    getVariants: ProductVariant[]
    translations: {
        title: string;
        order: string;
        of: string;
        client: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        zone: string;
        product: string;
        quantity: string;
        unitPrice: string;
        total: string;
        unknownP: string;
        subtotal: string;
        deliveryFee: string;
    }
}

const Pdfview = ({order, getVariants, translations, products}: Props) => {
    
  return (
    <>
              {/* PDF Viewer */}
        <div className="flex-1 border rounded-md overflow-hidden">
          <PDFViewer width="100%" height="100%">
            <OrderInvoice
              order={order}
              variants={getVariants ?? []}
              zones={Array.isArray(order?.address?.zone) ? order.address.zone : []} 
              translations={translations}
              products={products}
            />
          </PDFViewer>
        </div>
    </>
  )
}

export default Pdfview
