import { useState, useEffect } from "react";
import { getLogs, createLog, deleteLog } from "../api/logs";
import { getTagsByPage } from "../api/tags";
import { usePage } from "../context/PageContext";
import {
  Tag,
  Calendar,
  Search,
  Trash2,
  Terminal,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Logger() {
  const { pages, selectedPageId } = usePage();
  const [logs, setLogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [newLogContent, setNewLogContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [logFetchLoading, setLogFetchLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const darkInputBase =
    "bg-gray-800/70 border border-gray-700 text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-gray-400 transition-all";

  useEffect(() => {
    if (selectedPageId) {
      fetchTags();
      fetchLogs();
    } else {
      setTags([]);
      setLogs([]);
    }
    setShowFilters(false);
    setSelectedTagId("");
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
  }, [selectedPageId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedPageId) fetchLogs();
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedPageId, selectedTagId, searchQuery, dateFrom, dateTo]);

  const fetchTags = async () => {
    if (!selectedPageId) return;
    try {
      const response = await getTagsByPage(selectedPageId);
      if (response.statusCode === 200) setTags(response.data || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const fetchLogs = async () => {
    if (!selectedPageId) return;
    setLogFetchLoading(true);
    try {
      const response = await getLogs(
        selectedPageId,
        selectedTagId || null,
        searchQuery.trim() || null,
        dateFrom || null,
        dateTo || null
      );
      if (response.statusCode === 200) {
        const data = response.data?.logs || response.data || [];
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
    } finally {
      setLogFetchLoading(false);
    }
  };

  const handleAddLog = async () => {
    const content = newLogContent.trim();
    if (!content || !selectedPageId) return;
    setLoading(true);
    try {
      const tagMatches = content.match(/@(\w+)/);
      const tagName = tagMatches ? tagMatches[1] : null;
      await createLog({ pageId: selectedPageId, content, tagName });
      setNewLogContent("");
      fetchLogs();
      fetchTags();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create log");
    } finally {
      setLoading(false);
    }
  };

  const handleLogInputKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleAddLog();
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Delete this log?")) return;
    try {
      await deleteLog(id);
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete log");
    }
  };

  const stripTags = (c) => c?.replace(/@\w+/, "").trim() || "";

  const getTagColor = (tagName) => {
    const t = tagName?.toLowerCase();
    const map = {
      todo: "bg-blue-400/20 text-blue-300",
      done: "bg-green-400/20 text-green-300",
      stuck: "bg-red-400/20 text-red-300",
      high: "bg-orange-400/20 text-orange-300",
      low: "bg-gray-400/20 text-gray-300",
      revise: "bg-yellow-400/20 text-yellow-300",
    };
    return map[t] || "bg-gray-500/20 text-gray-300";
  };

  const hasFilters = selectedTagId || searchQuery.trim() || dateFrom || dateTo;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 rounded-2xl border border-gray-700/60 shadow-[0_0_40px_rgba(0,0,0,0.25)] overflow-hidden font-inter">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-900/70 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Logger
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Reflect, track, and refine your daily progress
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-all duration-300 ${hasFilters
              ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/30"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          title="Toggle filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Command Input */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/60 flex items-start gap-3">
        <Terminal className="w-5 h-5 text-indigo-400 mt-1" />
        <textarea
          value={newLogContent}
          onChange={(e) => setNewLogContent(e.target.value)}
          onKeyDown={handleLogInputKeydown}
          placeholder={
            selectedPageId
              ? "Type your thoughts, tasks, or progress... (@todo, @done, @stuck)"
              : "Select a page to start logging"
          }
          rows="2"
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 text-sm border-none outline-none resize-none leading-relaxed tracking-wide"
          disabled={!selectedPageId || loading}
        />
        {loading ? (
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mt-1"></div>
        ) : (
          <button
            onClick={handleAddLog}
            disabled={!selectedPageId || loading || !newLogContent.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/30 disabled:opacity-50"
          >
            Log
          </button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && selectedPageId && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-700 bg-gray-800/60 backdrop-blur-md"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-100 tracking-wide">
                  Filters
                </h3>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSelectedTagId("");
                      setSearchQuery("");
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${darkInputBase} pl-10 pr-3 py-2 w-full`}
                  />
                </div>
                <select
                  value={selectedTagId}
                  onChange={(e) => setSelectedTagId(e.target.value)}
                  className={`${darkInputBase} py-2 px-3`}
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag._id} value={tag._id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className={`${darkInputBase} py-2 px-2`}
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className={`${darkInputBase} py-2 px-2`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs Section */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {!selectedPageId ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            Select or create a page to start logging.
          </p>
        ) : logFetchLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            {hasFilters
              ? "No logs found matching your filters."
              : "No logs yet. Start your reflection above!"}
          </p>
        ) : (
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-5 rounded-xl border transition-all group shadow-lg hover:shadow-indigo-500/10 ${index % 2 === 0
                    ? "bg-gradient-to-r from-gray-800/70 to-gray-750/40 border-gray-700/80"
                    : "bg-gradient-to-r from-gray-850/60 to-gray-800/50 border-gray-700/80"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      {log.tag && (
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTagColor(
                            log.tag.name
                          )} backdrop-blur-sm`}
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {log.tag.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-100 whitespace-pre-wrap break-words leading-relaxed text-sm md:text-[15px] tracking-wide">
                      {stripTags(log.content)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteLog(log._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 ml-2 text-red-500 hover:bg-red-900/40 hover:text-red-300 rounded-md transition-all"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
