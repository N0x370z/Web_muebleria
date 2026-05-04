import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  className?: string
}

export const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 16,
  className = "" 
}: StarRatingProps) => {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < rating 
              ? "fill-dorado-suave text-dorado-suave" 
              : "fill-gris-piedra/20 text-gris-piedra/20"
          }`}
        />
      ))}
    </div>
  )
}
