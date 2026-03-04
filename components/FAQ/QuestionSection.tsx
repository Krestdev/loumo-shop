import { Topic } from '@/types/types'
import { useTranslations } from 'next-intl'
import React from 'react'
import Section from './Section'

interface Props {
  topic: Topic[] | undefined
  isSuccess: boolean
}

const QuestionSection = ({topic, isSuccess}: Props) => {
  const t = useTranslations("FAQ")

  return (
    <div className='max-w-[1400px] w-full mx-auto flex flex-col items-center gap-10 px-7 py-8'>
      <h1>{t("title")}</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 w-full'>
        {
          isSuccess &&
          topic?.map((x,i) => (
            <div key={i} className='flex flex-col gap-4 max-w-[640px] min-w-[440px] w-full'>
              <h3>{x.name}</h3>
              <Section question={x.faqs} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default QuestionSection
