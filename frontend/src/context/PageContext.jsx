import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPages, createPage as apiCreatePage } from "../api/pages";

const PageContext = createContext(null);

export const usePage = () => {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePage must be used within a PageProvider");
  return ctx;
};

export function PageProvider({ children }) {
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load pages and selected page on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await getPages();
        if (res.statusCode === 200) {
          const list = res.data || [];
          setPages(list);

          const stored = localStorage.getItem("selectedPageId");
          const hasStored = stored && list.some(p => p._id === stored);

          if (hasStored) {
            setSelectedPageId(stored);
          } else if (list.length > 0) {
            setSelectedPageId(list[0]._id);
            localStorage.setItem("selectedPageId", list[0]._id);
          } else {
            setSelectedPageId(null);
            localStorage.removeItem("selectedPageId");
          }
        }
      } catch (e) {
        console.error("Failed to load pages:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshPages = async () => {
    try {
      const res = await getPages();
      if (res.statusCode === 200) {
        const list = res.data || [];
        setPages(list);
        if (list.length === 0) {
          setSelectedPageId(null);
          localStorage.removeItem("selectedPageId");
        } else if (!list.some(p => p._id === selectedPageId)) {
          setSelectedPageId(list[0]._id);
          localStorage.setItem("selectedPageId", list[0]._id);
        }
      }
    } catch (e) {
      console.error("Failed to refresh pages:", e);
    }
  };

  const selectPage = (pageId) => {
    setSelectedPageId(pageId);
    if (pageId) localStorage.setItem("selectedPageId", pageId);
    else localStorage.removeItem("selectedPageId");
  };

  const createPage = async (title) => {
    const trimmed = (title || "").trim();
    if (!trimmed) return null;
    const res = await apiCreatePage({ title: trimmed });
    if (res.statusCode === 201) {
      const newPage = res.data;
      setPages(prev => [newPage, ...prev]);
      selectPage(newPage._id);
      return newPage;
    }
    return null;
  };

  const value = useMemo(() => ({
    pages,
    selectedPageId,
    loading,
    refreshPages,
    selectPage,
    createPage,
  }), [pages, selectedPageId, loading]);

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

