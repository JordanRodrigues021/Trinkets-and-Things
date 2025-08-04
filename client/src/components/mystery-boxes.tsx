import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Sparkles, Zap } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";

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

const mysteryBoxes: MysteryBox[] = [
  {
    id: 'mystery-299',
    name: 'Starter Mystery Box',
    price: 299,
    description: 'Perfect for beginners to discover our quality',
    contents: '1 Uncommon Item',
    rarity: 'uncommon',
    icon: <Gift className="w-8 h-8" />,
    gradient: 'from-blue-500 to-purple-600',
    features: [
      '1 Quality 3D printed item',
      'Surprise element',
      'Great for gifting',
      'Value worth ₹400+'
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
    gradient: 'from-purple-500 to-pink-600',
    features: [
      'Higher quality items',
      'Random rare item chance',
      'Possible double items',
      'Value worth ₹700+'
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
    gradient: 'from-yellow-500 to-red-600',
    features: [
      'Guaranteed rare item',
      'Chance for exclusive items',
      'Premium quality',
      'Value worth ₹900+'
    ]
  }
];

export default function MysteryBoxes() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const handleAddToCart = (box: MysteryBox) => {
    addItem({
      productId: box.id,
      productName: box.name,
      price: box.price,
      selectedColor: 'surprise',
      quantity: 1
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

  return (
    <section id="mystery-boxes" className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Mystery Boxes
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Surprise Yourself
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Discover amazing 3D printed items with our mystery boxes. Each box contains carefully selected items worth more than the price!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {mysteryBoxes.map((box) => (
            <Card key={box.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
              {/* Gradient Header */}
              <div className={`h-3 bg-gradient-to-r ${box.gradient}`}></div>
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${box.gradient} flex items-center justify-center text-white`}>
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
                  className={`w-full bg-gradient-to-r ${box.gradient} hover:opacity-90 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105`}
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