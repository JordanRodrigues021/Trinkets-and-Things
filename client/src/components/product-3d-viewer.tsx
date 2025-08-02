import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ModelViewer from './model-viewer';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut, Eye, Image } from 'lucide-react';

interface Product3DViewerProps {
  product: {
    id: string;
    name: string;
    images: string[];
    modelUrl?: string;
    category: string;
    material: string;
    dimensions: string;
  };
}

export default function Product3DViewer({ product }: Product3DViewerProps) {
  const [activeTab, setActiveTab] = useState<'3d' | 'images'>('3d');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasModel = product.modelUrl && product.modelUrl.trim() !== '';
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Product Preview</h3>
          {hasModel && (
            <Badge variant="secondary" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              3D Interactive
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
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as '3d' | 'images')}>
            <div className="p-4 pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="3d" className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  3D Model
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Photos ({hasImages ? product.images.length : 0})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="3d" className="mt-0 p-4">
              <ModelViewer 
                modelUrl={hasModel ? product.modelUrl : undefined}
                fallbackImage={hasImages ? product.images[0] : undefined}
                className="w-full h-96 rounded-lg"
              />
              
              {!hasModel && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-muted-foreground/10 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      3D Model Coming Soon
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We're working on adding interactive 3D models for all products
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="images" className="mt-0 p-4 space-y-4">
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
                  </div>
                  
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No images available</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
          <p className="text-muted-foreground">View Type</p>
          <p className="font-medium">{hasModel ? '3D Interactive' : 'Photo Gallery'}</p>
        </div>
      </div>
    </div>
  );
}