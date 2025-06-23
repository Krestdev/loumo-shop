import { useTranslations } from "next-intl"

export function useStep() {
  const t = useTranslations('HomePage.Step')
  return [
    {
        step: t("step"),
        title: t("title1"),
        descrip: t("descrip1"),
        image: "/Images/step/step1.png"
    },
    {
        step: t("step"),
        title: t("title2"),
        descrip: t("descrip2"),
        image: "/Images/step/step2.png"
    },
    {
        step: t("step"),
        title: t("title3"),
        descrip: t("descrip3"),
        image: "/Images/step/step3.png"
    },
  ]
}