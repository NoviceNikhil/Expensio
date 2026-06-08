import { useEffect, useState } from "react";
import {
  // Category Icons
  ShoppingBag,
  Coffee,
  Home,
  Truck,
  Activity,
  Monitor,
  Smartphone,
  Gift,
  Zap,
  Briefcase,
  Heart,
  Music,
  Book,
  Plane,
  Dumbbell,
  Utensils,
  Wifi,
  CreditCard,
  // UI Icons
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, deleteCategory, fetchCategories, updateCategory } from "../redux/Category/categorySlice";



const ICONS = {
  ShoppingBag,
  Coffee,
  Home,
  Truck,
  Activity,
  Monitor,
  Smartphone,
  Gift,
  Zap,
  Briefcase,
  Heart,
  Music,
  Book,
  Plane,
  Dumbbell,
  Utensils,
  Wifi,
  CreditCard,
};

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-fuchsia-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
];


const Categories = () => {


  // LOCAL STATE

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const { categoryItems } = useSelector((state) => state.categories)

  // Form State for Add/Edit
  const [form, setForm] = useState({
    name: "",
    icon: "ShoppingBag",
    color: "bg-blue-500",
  });
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const [filters, setFilters] = useState({
    q: ""
  })

  const applyFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated)

    const queryParams = new URLSearchParams();
    Object.keys(updated).forEach((key) => {
      if (updated[key]) queryParams.append(key, updated[key])
    })

    dispatch(fetchCategories(queryParams.toString()))
  }

  //  Resets form and closes modal
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setError("");
    setForm({ name: "", icon: "ShoppingBag", color: "bg-blue-500" });
  };


  // Form Submission (Create or Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    const newName = form.name.trim();

    const isDuplicate = categoryItems.some(
      (cat) =>
        cat.name.toLowerCase() === newName.toLowerCase() &&
        (editing ? cat.id !== editing.id : true),
    );

    if (isDuplicate) {
      setError("This category name already exists.");
      return;
    }

    if (editing) {
      const newform = { ...form, id: editing.id }
      dispatch(updateCategory(newform))
    } else {

      dispatch(addCategory(form))
    }
    closeModal();
  }

  // HANDLER: Delete Cat egory
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id))
    }
  };

  return (
    // FULL SCREEN CONTAINER
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ---------------- HEADER SECTION ---------------- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">
              Manage and organize your transaction categories
            </p>
          </div>

          {/* Add Category Button - Triggers Modal */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 font-medium text-white"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="relative w-[300px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              applyFilters({ q: e.target.value })
            }}
            placeholder="Search categories..."
            className="w-full bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ---------------- DATA TABLE ---------------- */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-100 dark:bg-slate-950/50 text-gray-600 dark:text-slate-400 text-sm border-b border-gray-200 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-5 w-24 text-center">Icon</th>
                <th className="p-5 text-left">Category Name</th>
                {/* <th className="p-5 text-center">Transactions</th> */}
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
              {categoryItems.map((cat) => {
                // Dynamically resolve the icon component
                const Icon = ICONS[cat.icon] || ICONS.ShoppingBag;

                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition duration-150"
                  >
                    {/* Icon Column */}
                    <td className="p-5 flex justify-center">
                      <div
                        className={`w-11 h-11 ${cat.color} bg-opacity-15 flex items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/5`}
                      >
                        <Icon
                          className={`${cat.color.replace("bg-", "text-")}`}
                          size={22}
                        />
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="p-5 font-semibold text-lg text-gray-900 dark:text-slate-200">
                      {cat.name}
                    </td>

                    {/* Actions (Edit/Delete) */}
                    <td className="p-5 text-right space-x-2">
                      <button
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => {
                          setEditing(cat); // Set current category to edit
                          setForm(cat); // Pre-fill form
                          setError("");
                          setShowModal(true);
                        }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2.5 text-red-600 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State Message */}
          {categoryItems.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-slate-500">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="text-lg">No categories found matching "{search}"</p>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- MODAL (ADD / EDIT) ---------------- */}
      {showModal && (
        // Backdrop Overlay
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-gray-200 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editing ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Alert Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Input: Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Category Name
              </label>
              <input
                required
                placeholder="e.g. Groceries"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (error) setError(""); // Clear error on typing
                }}
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition text-lg text-gray-900 dark:text-white"
              />
            </div>

            {/* Input: Icon Selection Grid */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Select Icon
              </label>
              <div className="grid grid-cols-6 gap-3">
                {Object.keys(ICONS).map((icon) => {
                  const IconComponent = ICONS[icon];
                  const isSelected = form.icon === icon;
                  return (
                    <button
                      type="button"
                      key={icon}
                      onClick={() => setForm({ ...form, icon })}
                      className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-200 ${isSelected
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105 ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      title={icon}
                    >
                      <IconComponent size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input: Color Selection Grid */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Select Color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-9 h-9 rounded-full ${color} transition-all duration-200 ${form.color === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-blue-900/20 mt-4 text-white">
              {editing ? "Save Changes" : "Create Category"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
};
export default Categories;
