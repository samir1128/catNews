import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./spinner";
import propTypes from "prop-types";

const News = ({
  country = "us",
  pageSize = 5,
  category = "general",
  setProgress,
  apiKey
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  function capitalize(s) {
    return String(s[0]).toUpperCase() + String(s).slice(1);
  }

  const updateNews = async () => {
    setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(Array.isArray(parsedData.articles) ? parsedData.articles : []);
    setTotalResults(parsedData.totalResults || 0);
    setLoading(false);
    setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalize(category)} - CatNews`;
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${pageSize}`;
      setPage(page + 1);
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(
        Array.isArray(parsedData.articles)
          ? articles.concat(parsedData.articles)
          : articles
      );
      setTotalResults(parsedData.totalResults || totalResults);
    } catch (error) {
      console.error("Error fetching more news:", error);
    }
  };

  return (
    <>
      <h1 className="text-center px-3" style={{ marginTop: "10vh" }}>
        CatNews -{" "}
        {category !== "general"
          ? `Top ${capitalize(category)} Headlines`
          : "Top Headlines"}
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles ? articles.length : 0}
        next={fetchMoreData}
        hasMore={articles && articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles &&
              articles.map((e) => (
                <div key={e.url} className="col-md-3">
                  <NewsItem
                    source={e.source.name}
                    author={e.author}
                    date={e.publishedAt}
                    imageUrl={e.urlToImage}
                    title={e.title ? e.title.slice(0, 50) : "No Title"}
                    description={
                      e.description ? e.description.slice(0, 20) : "No Description"
                    }
                    newsUrl={e.url}
                  />
                </div>
              ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.propTypes = {
  country: propTypes.string,
  pageSize: propTypes.number,
  category: propTypes.string,
  setProgress: propTypes.func.isRequired,
  apiKey: propTypes.string.isRequired,
};

export default News;
