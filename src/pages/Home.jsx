import { useEffect, useEffectEvent, useState } from "react";
import CryptoCard from "../components/CryptoCard";
import { fetchCryptos } from "../api/coinGecko";
import { Link } from "react-router";

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCryptoList = async () => {
    try {
      const data = await fetchCryptos();
      console.log(data);
      setCryptoList(data);
    } catch (error) {
      throw new Error("Failed to fetch data: ", error);
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

  const filtered = cryptoList.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          <Link to={"/"}>Cryp-Mark</Link>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="search for coin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="controls">
        <div className="filter-group"></div>
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
              {filtered.length > 0 ? (
                filtered.map((crypto) => {
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
