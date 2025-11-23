export const formatPrice = (price) => {
  if (isNaN(price)) return '0';

  if (price < 0.01) return price.toFixed(8)

  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
};

export const formatMarketCap = (marketCap) => {
  if (isNaN(marketCap)) return '0';

  if (marketCap > 1e12) return `${(marketCap / 1e12).toFixed(2)}T`
  else if (marketCap > 1e9) return `${(marketCap / 1e9).toFixed(2)}B`
  else if (marketCap > 1e6) return `${(marketCap / 1e6).toFixed(2)}M`
  else return marketCap.toLocaleString();
};