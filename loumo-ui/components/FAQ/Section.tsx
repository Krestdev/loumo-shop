import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Faq } from '@/types/types'

interface Props {
  question: Faq[],

}

const Section = ({ question }: Props) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-2"
    >
      {question &&
        question.map((x, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{x.question}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p className='text-black'>{x.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))
      }
    </Accordion>
  )
}

export default Section
