import { useEffect, useEffectEvent, useState } from "react";
import CryptoCard from "../components/CryptoCard";
import { fetchCryptos } from "../api/coinGecko";

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");

  const fetchCryptoList = async () => {
    try {
      const data = await fetchCryptos();
      setCryptoList(data);
    } catch (error) {
      console.error("Error fetching crypto: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCryptos = useEffectEvent(fetchCryptoList);
  useEffect(() => {
    let ignore = false;

    if (!ignore) getCryptos();

    return () => {
      ignore = true;
    };
  }, []);

  const filterAndSort = () => {
    const lowerQuery = searchQuery.toLowerCase();
    let filtered = cryptoList.filter((crypto) => {
      return (
        crypto.name.toLowerCase().includes(lowerQuery) ||
        crypto.symbol.toLowerCase().includes(lowerQuery)
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    setFilteredList(filtered);
  };

  const filterAndSortEv = useEffectEvent(filterAndSort);

  useEffect(() => {
    filterAndSortEv();
  }, [sortBy, cryptoList, searchQuery]);

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
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search Cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>
      <div className="controls">
        <div className="filter-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">{"Price (Low to High)"}</option>
            <option value="price_desc">{"Price (High to Low)"}</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={`${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={`${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>
      <div className="home-content">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Data is loading...</p>
          </div>
        ) : (
          <div className="crypto-list">
            <div className={`crypto-container ${viewMode}`}>
              {filteredList.length > 0 ? (
                filteredList.map((crypto) => {
                  return <CryptoCard key={crypto.id} crypto={crypto} />;
                })
              ) : (
                <p className="">No data is available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
