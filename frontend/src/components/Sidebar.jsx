import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import { Plus, X, ChevronRight, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { pages, selectedPageId, selectPage, createPage, loading } = usePage();
  const [open, setOpen] = useState(true);
  const [showNewPage, setShowNewPage] = useState(false);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const newPage = await createPage(title);
      if (newPage) {
        setTitle("");
        setShowNewPage(false);
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create page");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className={`h-full ${open ? "w-64" : "w-16"} transition-all duration-300 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/60 backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-2xl flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-900/70 backdrop-blur-sm">
        <button
          onClick={() => setOpen(!open)}
          className="text-sm font-medium text-gray-300 hover:text-indigo-400 flex items-center gap-1 transition-all"
          title={open ? "Collapse" : "Expand"}
        >
          {open ? (
            <>
              <Book className="w-4 h-4 text-indigo-400" />
              Pages
            </>
          ) : (
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {open && (
          <button
            onClick={() => setShowNewPage(true)}
            className="p-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm transition-all"
            title="Create Page"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {loading ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            Loading pages...
          </div>
        ) : pages.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No pages yet. Create one!
          </div>
        ) : (
          <ul className="space-y-1">
            {pages.map((p) => (
              <motion.li
                key={p._id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <button
                  onClick={() => selectPage(p._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${selectedPageId === p._id
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 shadow-inner shadow-indigo-500/10 font-medium"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                >
                  {open ? (
                    <span className="truncate">{p.title}</span>
                  ) : (
                    <span className="text-center w-full">
                      {p.title.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer / Collapsed bar glow */}
      <div className="h-2 bg-gradient-to-r from-indigo-500/20 to-purple-600/20" />

      {/* New Page Modal */}
      <AnimatePresence>
        {showNewPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 text-gray-100 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-700/70 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Create New Page
                </h3>
                <button
                  onClick={() => setShowNewPage(false)}
                  className="text-gray-400 hover:text-gray-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title..."
                className="w-full px-3 py-2 text-sm rounded-lg bg-gray-800/80 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewPage(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!title.trim() || creating}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
