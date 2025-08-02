import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Instagram, ExternalLink } from 'lucide-react';

export default function InstagramSection() {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
      <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Follow Us on Instagram</h3>
        <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
          See our latest 3D printed creations, behind-the-scenes content, and customer showcases on Instagram!
        </p>
        
        <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto">
          <a 
            href="https://www.instagram.com/trinketsandthings.co.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            @trinketsandthings.co.in
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}