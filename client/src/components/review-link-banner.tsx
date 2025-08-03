import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ExternalLink } from 'lucide-react';

interface ReviewLinkBannerProps {
  className?: string;
}

export default function ReviewLinkBanner({ className = '' }: ReviewLinkBannerProps) {
  const reviewUrl = `${window.location.origin}/leave-review`;
  
  const copyReviewLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      // Simple success indication without toast to keep it clean
      const button = document.getElementById('copy-review-link');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-dashed border-blue-200 dark:border-blue-800 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Love our 3D prints? Share your experience!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Help others discover our quality products by leaving a review
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('/leave-review', '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Star className="w-4 h-4 mr-2" />
              Leave Review
            </Button>
            <Button
              id="copy-review-link"
              onClick={copyReviewLink}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}