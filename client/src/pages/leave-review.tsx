import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';

export default function LeaveReviewPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 5,
    review_text: '',
    product_purchased: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Get URL parameters for pre-filling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const product = urlParams.get('product');

    if (name || email || product) {
      setFormData(prev => ({
        ...prev,
        customer_name: name || prev.customer_name,
        customer_email: email || prev.customer_email,
        product_purchased: product || prev.product_purchased
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.review_text) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and review",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          customer_name: formData.customer_name,
          customer_email: formData.customer_email || null,
          rating: formData.rating,
          review_text: formData.review_text,
          product_purchased: formData.product_purchased || null,
          is_approved: false, // Reviews need admin approval
        }]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Thank you for your review!",
        description: "Your review has been submitted and is pending approval.",
      });

    } catch (error: any) {
      console.error('Review submission error:', error);
      
      if (error.code === '42P01') {
        toast({
          title: "Review system not available",
          description: "The review system is being set up. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission failed",
          description: error.message || "Failed to submit review. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>

            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="text-muted-foreground mb-6">
                  Your review has been submitted successfully. We appreciate your feedback and will review it before publishing.
                </p>
                <div className="space-y-2">
                  <Button onClick={() => setLocation('/')} className="w-full">
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        customer_name: '',
                        customer_email: '',
                        rating: 5,
                        review_text: '',
                        product_purchased: ''
                      });
                    }}
                    className="w-full"
                  >
                    Leave Another Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
              <p className="text-muted-foreground">
                We'd love to hear about your experience with our 3D printed products!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customer_name">Your Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="customer_email">Email (Optional)</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll only use this to follow up if needed
                  </p>
                </div>

                <div>
                  <Label htmlFor="product_purchased">Product Purchased (Optional)</Label>
                  <Input
                    id="product_purchased"
                    value={formData.product_purchased}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_purchased: e.target.value }))}
                    placeholder="Which product did you buy?"
                  />
                </div>

                <div>
                  <Label>Rating *</Label>
                  <div className="mt-2">
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.rating === 5 && "Excellent!"}
                      {formData.rating === 4 && "Very Good"}
                      {formData.rating === 3 && "Good"}
                      {formData.rating === 2 && "Fair"}
                      {formData.rating === 1 && "Poor"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review_text">Your Review *</Label>
                  <Textarea
                    id="review_text"
                    value={formData.review_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                    placeholder="Tell us about your experience with our 3D printed products..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your review will be reviewed by our team before being published.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}