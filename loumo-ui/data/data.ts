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

// Données temporaires pour reviews
export function useReviews() {
  return [
    {
      id: 1,
      note: 4,
      title: "Très satisfait",
      message: "Produit de bonne qualité, correspond parfaitement à la description. Livraison rapide !",
      author: "Jean D.",
      date: "2023-10-15",
      verified: true
    },
    {
      id: 2,
      note: 5,
      title: "Excellent produit",
      message: "Je l'utilise depuis 2 semaines et il dépasse toutes mes attentes. Je recommande !",
      author: "Marie L.",
      date: "2023-11-02",
      verified: true
    },
    {
      id: 3,
      note: 3,
      title: "Correct mais peut mieux faire",
      message: "Fonctionne bien mais la batterie ne tient pas aussi longtemps qu'annoncé.",
      author: "Thomas P.",
      date: "2023-09-28",
      verified: false
    },
    {
      id: 4,
      note: 2,
      title: "Déçu par la qualité",
      message: "Cassé après une semaine d'utilisation. Le service client a bien réagi cependant.",
      author: "Sophie M.",
      date: "2023-11-12",
      verified: true
    },
    {
      id: 5,
      note: 5,
      title: "Parfait !",
      message: "Exactement ce dont j'avais besoin. Très simple à utiliser et livraison ultra rapide.",
      author: "Alexandre T.",
      date: "2023-11-05",
      verified: true
    },
    {
      id: 6,
      note: 4,
      title: "Très bon rapport qualité-prix",
      message: "Pour le prix, c'est une très bonne affaire. Petit bémol sur les finitions.",
      author: "Élodie R.",
      date: "2023-10-22",
      verified: true
    }
  ]
}