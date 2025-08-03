import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 5,
    review_text: '',
    product_purchased: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

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

      toast({
        title: "Thank you for your review!",
        description: "Your review has been submitted and is pending approval.",
      });

      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        rating: 5,
        review_text: '',
        product_purchased: ''
      });
      
      onClose();
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
              className={`w-6 h-6 ${
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        
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

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Your review will be reviewed by our team before being published.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}