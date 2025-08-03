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
    <div className="w-full max-w-md mx-auto relative">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar>
              <AvatarImage src={currentReview.profile_picture_url || undefined} />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{currentReview.customer_name}</h4>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < currentReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground italic">
            "{currentReview.review_text}"
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">
              {new Date(currentReview.created_at).toLocaleDateString()}
            </span>
            
            {reviews.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevReview}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {reviews.length}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextReview}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}