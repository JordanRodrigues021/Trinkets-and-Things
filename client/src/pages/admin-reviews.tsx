import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { ArrowLeft, Star, Check, X, Eye, Copy, Link2 } from 'lucide-react';
import type { Database } from '@/types/database';

type Review = Database['public']['Tables']['reviews']['Row'];

export default function AdminReviews() {
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      setLocation('/admin');
      return;
    }
  }, [setLocation]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      if (error.code === '42P01') {
        toast({
          title: "Database setup required",
          description: "Review tables need to be created. Go to Database Setup.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error loading reviews",
          description: error.message || "Failed to fetch reviews from database",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: isApproved ? "Review approved" : "Review rejected",
        description: isApproved 
          ? "Review is now visible to customers"
          : "Review has been hidden from customers",
      });

      loadReviews();
    } catch (error: any) {
      toast({
        title: "Error updating review",
        description: error.message || "Failed to update review status",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review deleted",
        description: "Review has been permanently removed",
      });

      loadReviews();
    } catch (error: any) {
      toast({
        title: "Error deleting review",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.is_approved;
    if (filter === 'approved') return review.is_approved;
    return true;
  });

  const reviewUrl = `https://trinketsandthings.co.in/leave-review`;
  
  const copyReviewLink = async (customParams?: string) => {
    const url = customParams ? `${reviewUrl}?${customParams}` : reviewUrl;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Review link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const StarDisplay = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation('/admin/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Review Link Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Review Link Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Basic Review Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={reviewUrl} readOnly className="text-xs" />
                    <Button size="sm" onClick={() => copyReviewLink()}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Custom Link Parameters</Label>
                  <div className="space-y-2 mt-1">
                    <Input
                      placeholder="name=John Doe"
                      id="custom-params-input"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const input = document.getElementById('custom-params-input') as HTMLInputElement;
                        const params = input?.value || '';
                        copyReviewLink(params);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Custom Link
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Available parameters:</p>
                  <ul className="space-y-1">
                    <li>• name=Customer Name</li>
                    <li>• email=customer@email.com</li>
                    <li>• product=Product Name</li>
                  </ul>
                  <p className="mt-2">
                    Example: name=John&email=john@email.com&product=Phone Case
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Review Management */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Review Management</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                      >
                        All ({reviews.length})
                      </Button>
                      <Button
                        size="sm"
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilter('pending')}
                      >
                        Pending ({reviews.filter(r => !r.is_approved).length})
                      </Button>
                      <Button
                        size="sm"
                        variant={filter === 'approved' ? 'default' : 'outline'}
                        onClick={() => setFilter('approved')}
                      >
                        Approved ({reviews.filter(r => r.is_approved).length})
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {filter === 'all' ? 'No reviews yet' : `No ${filter} reviews`}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReviews.map((review) => (
                        <Card key={review.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.customer_name}</span>
                                <StarDisplay rating={review.rating} />
                                <Badge variant={review.is_approved ? 'secondary' : 'outline'}>
                                  {review.is_approved ? 'Approved' : 'Pending'}
                                </Badge>
                              </div>
                              {review.customer_email && (
                                <p className="text-sm text-muted-foreground">{review.customer_email}</p>
                              )}
                              {(review as any).product_purchased && (
                                <p className="text-sm text-muted-foreground">
                                  Product: {(review as any).product_purchased}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {!review.is_approved && (
                                <Button
                                  size="sm"
                                  onClick={() => updateReviewStatus(review.id, true)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              {review.is_approved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateReviewStatus(review.id, false)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteReview(review.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm mb-2">{review.review_text}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}