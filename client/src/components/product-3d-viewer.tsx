import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2, RotateCcw, Image, Play } from 'lucide-react';

interface Product3DViewerProps {
  product: {
    id: string;
    name: string;
    images: string[];
    category: string;
    material: string;
    dimensions: string;
  };
}

export default function Product3DViewer({ product }: Product3DViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = product.images && product.images.length > 0;

  // Check if current image is a GIF
  const isCurrentImageGif = hasImages && product.images[currentImageIndex]?.toLowerCase().includes('.gif');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Product Gallery</h3>
          {hasImages && (
            <Badge variant="secondary" className="text-xs">
              <Image className="w-3 h-3 mr-1" />
              {product.images.length} {product.images.length === 1 ? 'Image' : 'Images'}
            </Badge>
          )}
          {isCurrentImageGif && (
            <Badge variant="outline" className="text-xs">
              <Play className="w-3 h-3 mr-1" />
              Animated
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          {hasImages ? (
            <>
              <div className="relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - View ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
                {isCurrentImageGif && (
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    GIF Animation
                  </div>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => {
                    const isGif = image.toLowerCase().includes('.gif');
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isGif && (
                          <div className="absolute bottom-0 right-0 bg-black/70 text-white px-1 text-xs rounded-tl">
                            GIF
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Image className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No images available</p>
                <p className="text-xs text-muted-foreground mt-1">Images and GIFs will be displayed here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product specifications */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Category</p>
          <p className="font-medium capitalize">{product.category}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Material</p>
          <p className="font-medium">{product.material}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Dimensions</p>
          <p className="font-medium">{product.dimensions}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Media Type</p>
          <p className="font-medium">
            {hasImages ? 
              (product.images.some(img => img.toLowerCase().includes('.gif')) ? 'Images & GIFs' : 'Images') 
              : 'No Media'
            }
          </p>
        </div>
      </div>
    </div>
  );
}