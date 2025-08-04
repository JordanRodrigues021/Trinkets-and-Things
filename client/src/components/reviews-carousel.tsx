import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Review = Database['public']['Tables']['reviews']['Row'];

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error: any) {
        if (error.code !== '42P01') {
          console.error('Error fetching reviews:', error);
        }
        // If reviews table doesn't exist, just show empty state gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-rotate reviews every 5 seconds
  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(nextReview, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-pulse">Loading reviews...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No reviews yet. Be the first to leave a review!
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((review, index) => (
          <Card 
            key={review.id} 
            className={`transition-all duration-300 hover:shadow-xl border-2 ${
              index === currentIndex % 3 ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="ring-2 ring-blue-100">
                  <AvatarImage src={review.profile_picture_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{review.customer_name}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
                "{review.review_text}"
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {reviews.length > 3 && (
        <div className="flex items-center justify-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={prevReview}
            className="hover:bg-blue-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 3)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / 3) === i ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={nextReview}
            className="hover:bg-blue-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}