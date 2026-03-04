import React from 'react'
import { Star, StarHalf } from 'lucide-react'

interface Props {
    note: number // Note entre 0 et 5
    taille?: number // Taille optionnelle des étoiles (par défaut 16px)
    couleur?: string // Couleur optionnelle (par défaut jaune)
    afficherNote?: boolean // Afficher ou non la note numérique
}

const Stars = ({ 
    note, 
    taille = 16, 
    couleur = "#1692AD", 
}: Props) => {
    const noteClampee = Math.min(Math.max(note, 0), 5)
    const etoilesPleines = Math.floor(noteClampee)
    const hasDemiEtoile = noteClampee % 1 >= 0.5
    
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
                if (i < etoilesPleines) {
                    return <Star key={i} size={taille} fill={couleur} color={couleur} />
                } else if (i === etoilesPleines && hasDemiEtoile) {
                    return <StarHalf key={i} size={taille} fill={couleur} color={couleur} />
                } else {
                    return <Star key={i} size={taille} color={couleur} className="opacity-30" />
                }
            })}
        </div>
    )
}

export default Stars