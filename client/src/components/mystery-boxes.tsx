import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Sparkles, Zap } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MysteryBox {
  id: string;
  name: string;
  price: number;
  description: string;
  contents: string;
  rarity: 'uncommon' | 'rare' | 'super-rare';
  icon: React.ReactNode;
  gradient: string;
  features: string[];
}

const fallbackMysteryBoxes: MysteryBox[] = [
  {
    id: 'mystery-299',
    name: 'Starter Mystery Box',
    price: 299,
    description: 'Perfect for beginners to discover our quality',
    contents: '1 Uncommon Item',
    rarity: 'uncommon',
    icon: <Gift className="w-8 h-8" />,
    gradient: 'from-green-500 to-green-600',
    features: [
      '1 Quality 3D printed item',
      'Surprise element',
      'Great for gifting',
      'Value worth ₹350+'
    ]
  },
  {
    id: 'mystery-499',
    name: 'Explorer Mystery Box',
    price: 499,
    description: 'For those seeking better surprises',
    contents: '1 Rare Item OR 2 Uncommon Items',
    rarity: 'rare',
    icon: <Star className="w-8 h-8" />,
    gradient: 'from-blue-500 to-blue-600',
    features: [
      'Higher quality items',
      'Random rare item chance',
      'Possible double items',
      'Value worth ₹550+'
    ]
  },
  {
    id: 'mystery-599',
    name: 'Premium Mystery Box',
    price: 599,
    description: 'Ultimate surprise experience',
    contents: '1 Guaranteed Rare + Chance for Super Special',
    rarity: 'super-rare',
    icon: <Sparkles className="w-8 h-8" />,
    gradient: 'from-yellow-400 via-yellow-500 to-amber-600',
    features: [
      'Guaranteed rare item',
      'Chance for exclusive items',
      'Premium quality',
      'Value worth ₹700+'
    ]
  }
];

export default function MysteryBoxes() {
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadMysteryBoxes();
  }, []);

  const loadMysteryBoxes = async () => {
    try {
      const { data, error } = await supabase
        .from('mystery_boxes')
        .select('*')
        .eq('is_active', 1)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMysteryBoxes(data || []);
    } catch (error: any) {
      console.error('Error loading mystery boxes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (box: MysteryBox) => {
    // Create a mystery box icon SVG with appropriate colors based on box type
    const getBoxColors = (boxId: string) => {
      switch (boxId) {
        case 'mystery-299':
          return { main: '#10B981', secondary: '#059669', accent: '#047857' }; // Green
        case 'mystery-499':
          return { main: '#3B82F6', secondary: '#2563EB', accent: '#1D4ED8' }; // Blue
        case 'mystery-599':
          return { main: '#F59E0B', secondary: '#D97706', accent: '#B45309' }; // Gold
        default:
          return { main: '#8B5CF6', secondary: '#A855F7', accent: '#7C3AED' }; // Purple
      }
    };

    const colors = getBoxColors(box.id);
    const mysteryBoxIcon = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.main};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
          </linearGradient>
          <filter id="shine" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#boxGradient)" rx="15" filter="url(#shine)"/>
        <path d="M30 40h40v35a5 5 0 01-5 5H35a5 5 0 01-5-5V40z" fill="${colors.secondary}" opacity="0.9"/>
        <path d="M25 30h50v15H25z" fill="${colors.accent}" opacity="0.8"/>
        <rect x="47" y="20" width="6" height="60" fill="#FFF" opacity="0.3"/>
        <rect x="20" y="47" width="60" height="6" fill="#FFF" opacity="0.3"/>
        <circle cx="50" y="25" r="8" fill="#FFF" opacity="0.2"/>
        <text x="50" y="30" text-anchor="middle" fill="#FFF" font-size="14" font-weight="bold">?</text>
        ${box.id === 'mystery-599' ? '<circle cx="25" cy="25" r="3" fill="#FFD700" opacity="0.8"/><circle cx="75" cy="75" r="2" fill="#FFD700" opacity="0.6"/>' : ''}
      </svg>
    `)}`;

    addItem({
      productId: box.id,
      productName: box.name,
      price: box.price,
      selectedColor: 'surprise',
      imageUrl: mysteryBoxIcon
    });

    toast({
      title: "Mystery Box Added!",
      description: `${box.name} has been added to your cart`,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'uncommon': return 'bg-blue-100 text-blue-800';
      case 'rare': return 'bg-purple-100 text-purple-800';
      case 'super-rare': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'uncommon': return <Gift className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'super-rare': return <Zap className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  // Show loading or fallback to hardcoded boxes if database is empty
  const displayBoxes = loading ? [] : (mysteryBoxes.length > 0 ? mysteryBoxes : fallbackMysteryBoxes);

  if (loading) {
    return (
      <section id="mystery-boxes" className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading mystery boxes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mystery-boxes" className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Mystery Boxes
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Surprise Yourself With Amazing Value
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mb-6">
            Discover amazing 3D printed items with our mystery boxes. Each box contains carefully selected items worth more than the price!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Guaranteed Value
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4" />
              Curated Selection
            </div>
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-800 px-3 py-1 rounded-full">
              <Gift className="w-4 h-4" />
              Perfect for Gifts
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayBoxes.map((box) => (
            <Card key={box.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
              {/* Gradient Header */}
              <div className={`h-3 bg-gradient-to-r ${box.gradient}`}></div>
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${box.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 text-[#c49018]`}>
                  {box.icon}
                </div>
                
                <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-white">
                  {box.name}
                </CardTitle>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className={`${getRarityColor(box.rarity)} flex items-center gap-1`}>
                    {getRarityIcon(box.rarity)}
                    {box.rarity.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {box.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    ₹{box.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {box.contents}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">What's Inside:</h4>
                  <ul className="space-y-1">
                    {box.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  onClick={() => handleAddToCart(box)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-10 px-4 w-full undefined hover:opacity-90 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 bg-[#5035ab]"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Add Mystery Box
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How Mystery Boxes Work
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Your Box</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select the mystery box that fits your budget and excitement level
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">We Surprise You</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our team carefully selects high-quality items based on your box tier
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Enjoy Your Items</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Receive items worth more than what you paid, guaranteed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}