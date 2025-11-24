import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchCoinDataById } from "../api/coinGecko";
import { formatPrice } from "../utils/formatter";

export const CoinDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [coin, setCoin] = useState(null);
  const navigate = useNavigate();

  const loadCoinData = async (coinId) => {
    try {
      const data = await fetchCoinDataById(coinId);
      console.log(data);
      setCoin(data);
    } catch (error) {
      throw new Error("Failed to fetch data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoinData(id);
  }, [id]);

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Coin data is Loading...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-result">
          <h2>Error 404!</h2>
          <p>
            Coin <span>{id}</span> not found!
          </p>
          <button className="back-button" onClick={() => navigate("/")}>
            く Go Back To List
          </button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>Cryp-Mark</h1>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam,
              sed.
            </p>
          </div>
          <button className="back-button" onClick={() => navigate("/")}>
            く Go Back To List
          </button>
        </div>
      </header>
      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image.large} alt={coin.name} />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol}</p>
            </div>
          </div>
          <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
        </div>
        <div className="coin-price-section">
          <div className="current-price">
            <h2 className="price">
              {formatPrice(coin.market_data.current_price.usd)}
            </h2>
            <span className={`change ${isPositive ? "positive" : "negative"} `}>
              {isPositive ? "⬆" : "⬇"}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">
                {formatPrice(coin.market_data.high_24h.usd)}
              </span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data.low_24h.usd)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
