import { useState, useEffect } from "react";
import {
  getRoadmapByPage,
  toggleTodo,
  addTodo,
  updateRoadmap,
  deleteTodo,
} from "../api/roadmap";
import { usePage } from "../context/PageContext";
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Trash2,
  X,
  Edit2,
  ListTodo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Roadmap() {
  const { selectedPageId } = usePage();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingSubheading, setEditingSubheading] = useState(null);
  const [newSubheadingTitle, setNewSubheadingTitle] = useState("");
  const [addingSubheading, setAddingSubheading] = useState(false);
  const [addingTodoToIndex, setAddingTodoToIndex] = useState(null);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [todoLoading, setTodoLoading] = useState(false);

  const darkInputClass =
    "flex-1 px-3 py-2 bg-gray-800/70 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-gray-500 transition-all text-sm";

  useEffect(() => {
    if (selectedPageId) fetchRoadmap();
    else setRoadmap(null);
  }, [selectedPageId]);

  const fetchRoadmap = async () => {
    if (!selectedPageId) return;
    setLoading(true);
    try {
      const response = await getRoadmapByPage(selectedPageId);
      if (response.statusCode === 200) setRoadmap(response.data);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubheading = async () => {
    if (!newSubheadingTitle.trim() || !roadmap) return;
    setTodoLoading(true);
    try {
      const existingSubheadings = (roadmap.subheadings || []).map((sub) => ({
        title: sub.title,
        todos: (sub.todos || []).map((todo) => todo._id || todo),
      }));

      const updatedSubheadings = [
        ...existingSubheadings,
        { title: newSubheadingTitle, todos: [] },
      ];

      const response = await updateRoadmap(roadmap._id, {
        subheadings: updatedSubheadings,
      });

      if (response.statusCode === 200) {
        setRoadmap(response.data);
        setNewSubheadingTitle("");
        setAddingSubheading(false);
      }
    } catch (error) {
      console.error("Error adding subheading:", error);
      alert(error.response?.data?.message || "Failed to add subheading");
    } finally {
      setTodoLoading(false);
    }
  };

  const handleEditSubheading = async (index, newTitle) => {
    if (!newTitle.trim() || !roadmap) return;
    if (roadmap.subheadings[index].title === newTitle) {
      setEditingSubheading(null);
      return;
    }
    setTodoLoading(true);
    try {
      const updatedSubheadings = (roadmap.subheadings || []).map((sub, i) => ({
        title: i === index ? newTitle : sub.title,
        todos: (sub.todos || []).map((todo) => todo._id || todo),
      }));

      const response = await updateRoadmap(roadmap._id, {
        subheadings: updatedSubheadings,
      });

      if (response.statusCode === 200) {
        setRoadmap(response.data);
        setEditingSubheading(null);
      }
    } catch (error) {
      console.error("Error editing subheading:", error);
      alert(error.response?.data?.message || "Failed to update subheading");
    } finally {
      setTodoLoading(false);
    }
  };

  const handleDeleteSubheading = async (index) => {
    if (!roadmap || !confirm("Delete this subheading and all its todos?")) return;
    setTodoLoading(true);
    try {
      const updatedSubheadings = roadmap.subheadings
        .filter((_, i) => i !== index)
        .map((sub) => ({
          title: sub.title,
          todos: (sub.todos || []).map((todo) => todo._id || todo),
        }));

      const response = await updateRoadmap(roadmap._id, {
        subheadings: updatedSubheadings,
      });

      if (response.statusCode === 200) setRoadmap(response.data);
    } catch (error) {
      console.error("Error deleting subheading:", error);
      alert(error.response?.data?.message || "Failed to delete subheading");
    } finally {
      setTodoLoading(false);
    }
  };

  const handleAddTodo = async (subheadingIndex) => {
    if (!newTodoContent.trim() || !roadmap) return;
    setTodoLoading(true);
    try {
      const response = await addTodo(roadmap._id, subheadingIndex, {
        content: newTodoContent,
      });
      if (response.statusCode === 201) {
        await fetchRoadmap();
        setNewTodoContent("");
        setAddingTodoToIndex(null);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert(error.response?.data?.message || "Failed to add todo");
    } finally {
      setTodoLoading(false);
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const response = await toggleTodo(todoId);
      if (response.statusCode === 200) await fetchRoadmap();
    } catch (error) {
      console.error("Error toggling todo:", error);
      alert(error.response?.data?.message || "Failed to toggle todo");
    }
  };

  const handleDeleteTodo = async (subheadingIndex, todoId) => {
    if (!roadmap || !confirm("Delete this todo?")) return;
    setTodoLoading(true);
    try {
      const response = await deleteTodo(roadmap._id, subheadingIndex, todoId);
      if (response.statusCode === 200) await fetchRoadmap();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert(error.response?.data?.message || "Failed to delete todo");
    } finally {
      setTodoLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!roadmap?.subheadings) return 0;
    let total = 0,
      done = 0;
    roadmap.subheadings.forEach((s) =>
      s.todos?.forEach((t) => {
        total++;
        if (t.isCompleted) done++;
      })
    );
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="h-full flex flex-col bg-  gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 border border-gray-700 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.35)] overflow-hidden font-inter">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/70 backdrop-blur-md flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2 tracking-tight text-white">
            <ListTodo className="w-6 h-6 text-indigo-400" />
            Roadmap
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-0.5">
            Weekly goals & tracked progress
          </p>
        </div>
        {roadmap && (
          <div className="flex flex-col w-36">
            <div className="text-xs text-gray-400 mb-1 flex justify-between font-semibold">
              <span>Progress</span>
              <span className="text-indigo-300">{calculateProgress()}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700/60 rounded-full overflow-hidden">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-400 to-green-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {!selectedPageId ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            Select a page to view roadmap.
          </p>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !roadmap ||
          (roadmap.subheadings && roadmap.subheadings.length === 0) ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400 mb-1 text-base font-medium">
              No roadmap content yet
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Start by adding your first subheading.
            </p>
            {!addingSubheading ? (
              <button
                onClick={() => setAddingSubheading(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-md shadow-indigo-500/30 transition-all text-sm inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add First Subheading
              </button>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubheadingTitle}
                    onChange={(e) => setNewSubheadingTitle(e.target.value)}
                    placeholder="e.g., Week 1 - Fundamentals"
                    className={darkInputClass}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubheading();
                      if (e.key === "Escape") {
                        setAddingSubheading(false);
                        setNewSubheadingTitle("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleAddSubheading}
                    disabled={todoLoading}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubheading(false);
                      setNewSubheadingTitle("");
                    }}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {roadmap.subheadings.map((subheading, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`p-5 rounded-2xl border transition-all shadow-lg backdrop-blur-sm ${index % 2 === 0
                      ? "bg-gradient-to-br from-gray-800/70 to-gray-700/50 border-gray-700 hover:border-indigo-500/50"
                      : "bg-gradient-to-br from-gray-850/70 to-gray-800/60 border-gray-700 hover:border-indigo-400/50"
                    }`}
                >
                  {/* Subheading Header */}
                  <div className="flex items-center justify-between mb-3">
                    {editingSubheading === index ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={subheading.title}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleEditSubheading(index, e.target.value);
                            if (e.key === "Escape") setEditingSubheading(null);
                          }}
                          onBlur={(e) =>
                            handleEditSubheading(index, e.target.value)
                          }
                          className={darkInputClass}
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingSubheading(null)}
                          className="p-1 text-gray-400 hover:text-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg text-indigo-300 tracking-wide flex-1 truncate">
                          {subheading.title || `Week ${index + 1}`}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setEditingSubheading(index)}
                            className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                            title="Edit subheading"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubheading(index)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete subheading"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Todos */}
                  {subheading.todos && subheading.todos.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {subheading.todos.map((todo) => (
                        <motion.div
                          key={todo._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all group ${todo.isCompleted
                              ? "bg-green-900/20 border-green-600/50"
                              : "bg-gray-800/60 border-gray-700 hover:border-indigo-400/40"
                            }`}
                        >
                          <button
                            onClick={() => handleToggleTodo(todo._id)}
                            className="flex-shrink-0"
                          >
                            {todo.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-500 hover:text-indigo-400" />
                            )}
                          </button>
                          <span
                            className={`flex-1 text-sm ${todo.isCompleted
                                ? "line-through text-gray-500 italic"
                                : "text-gray-100"
                              }`}
                          >
                            {todo.content}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteTodo(index, todo._id)
                            }
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all"
                            title="Delete todo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3 italic">
                      No todos yet
                    </p>
                  )}

                  {/* Add Todo */}
                  {addingTodoToIndex === index ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTodoContent}
                        onChange={(e) => setNewTodoContent(e.target.value)}
                        placeholder="Add a new todo..."
                        className={darkInputClass}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTodo(index);
                          if (e.key === "Escape") {
                            setAddingTodoToIndex(null);
                            setNewTodoContent("");
                          }
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddTodo(index)}
                        disabled={todoLoading}
                        className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingTodoToIndex(null);
                          setNewTodoContent("");
                        }}
                        className="px-3 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTodoToIndex(index)}
                      className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-all font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add Todo
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Subheading */}
            {!addingSubheading && (
              <button
                onClick={() => setAddingSubheading(true)}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-400 transition-all font-medium"
              >
                <Plus className="w-5 h-5" /> Add Subheading
              </button>
            )}

            {addingSubheading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 shadow-inner"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubheadingTitle}
                    onChange={(e) => setNewSubheadingTitle(e.target.value)}
                    placeholder="e.g., Week 3 - Dynamic Programming"
                    className={darkInputClass}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubheading();
                      if (e.key === "Escape") {
                        setAddingSubheading(false);
                        setNewSubheadingTitle("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleAddSubheading}
                    disabled={todoLoading}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm font-semibold disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubheading(false);
                      setNewSubheadingTitle("");
                    }}
                    className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

