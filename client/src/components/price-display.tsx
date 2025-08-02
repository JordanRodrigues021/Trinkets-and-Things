interface PriceDisplayProps {
  price: string;
  salePrice?: string | null;
  className?: string;
  showCurrency?: boolean;
}

export default function PriceDisplay({ 
  price, 
  salePrice, 
  className = '', 
  showCurrency = true 
}: PriceDisplayProps) {
  const regularPrice = parseFloat(price);
  const discountPrice = salePrice ? parseFloat(salePrice) : null;
  const hasDiscount = discountPrice && discountPrice < regularPrice;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasDiscount ? (
        <>
          <span className="text-2xl font-bold text-green-600">
            {showCurrency && '₹'}{discountPrice?.toLocaleString('en-IN')}
          </span>
          <span className="text-lg text-muted-foreground line-through">
            {showCurrency && '₹'}{regularPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
            {Math.round(((regularPrice - discountPrice) / regularPrice) * 100)}% OFF
          </span>
        </>
      ) : (
        <span className="text-2xl font-bold">
          {showCurrency && '₹'}{regularPrice.toLocaleString('en-IN')}
        </span>
      )}
    </div>
  );
}