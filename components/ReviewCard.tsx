import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`text-xl transition-all duration-200 ${
        i < review.rating 
          ? 'text-yellow-400 drop-shadow-sm' 
          : 'text-gray-200'
      }`}
    >
      ★
    </span>
  ));

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-xl p-5 hover:border-primary-200 hover:shadow-soft transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{review.author}</h4>
            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('ru-RU', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">{stars}</div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}

