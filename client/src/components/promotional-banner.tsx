import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Banner = Database['public']['Tables']['banners']['Row'];

export default function PromotionalBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveBanner();
  }, []);

  const fetchActiveBanner = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', 1)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .lte('start_date', now)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching banner:', error);
        return;
      }

      setBanner(data);
    } catch (error) {
      console.error('Error fetching banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (banner?.button_link) {
      if (banner.button_link.startsWith('#')) {
        // Internal anchor link
        const element = document.querySelector(banner.button_link);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else if (banner.button_link.startsWith('/')) {
        // Internal route
        window.location.href = banner.button_link;
      } else {
        // External link
        window.open(banner.button_link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (loading || !banner || !isVisible) {
    return null;
  }

  return (
    <div 
      className="relative w-full py-3 px-4 text-center"
      style={{
        backgroundColor: banner.background_color,
        color: banner.text_color,
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg">{banner.title}</h3>
            <p className="text-sm opacity-90">{banner.description}</p>
          </div>
          
          {banner.button_text && (
            <Button
              onClick={handleButtonClick}
              variant="secondary"
              size="sm"
              className="whitespace-nowrap"
              style={{
                backgroundColor: banner.text_color,
                color: banner.background_color,
              }}
            >
              {banner.button_text}
            </Button>
          )}
        </div>

        <Button
          onClick={handleClose}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-1 h-6 w-6 hover:bg-black/10"
          style={{ color: banner.text_color }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}