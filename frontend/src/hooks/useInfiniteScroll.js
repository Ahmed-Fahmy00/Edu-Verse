import { useState, useEffect, useCallback, useRef } from "react";

export function useInfiniteScroll({ fetchData, initialPage = 1, threshold = 200,}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchData(page);

      if (result.data && result.data.length > 0) {
        setData((prev) => [...prev, ...result.data]);
        setPage((prev) => prev + 1);

        if (result.pagination) { setHasMore(result.pagination.page < result.pagination.pages);
        } else { setHasMore(result.data.length > 0); }
      } else { setHasMore(false);}
    } catch (err) {
      setError(err.message || "Failed to load data");
      console.error("Infinite scroll error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchData, page, loading, hasMore]);

  const reset = useCallback(() => { setData([]); setPage(initialPage); setHasMore(true); setError(null); }, [initialPage]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting && hasMore)  loadMore();},
        { rootMargin: `${threshold}px`, }
      );
      if (node) { observerRef.current.observe(node); }
    },
    [loading, hasMore, loadMore, threshold]
  );

  useEffect(() => { if (data.length === 0 && !loading)  loadMore();}, []);

  return {data, loading, hasMore, error, loadMore, reset, lastElementRef, };
}

export function useScrollPagination({ onLoadMore, threshold = 200, enabled = true,}) {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < threshold) {
        setIsLoading(true);
        onLoadMore().finally(() => setIsLoading(false));
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", throttledScroll, { passive: true });
    return () => container.removeEventListener("scroll", throttledScroll);
  }, [onLoadMore, threshold, enabled, isLoading]);

  return { containerRef, isLoading };
}
