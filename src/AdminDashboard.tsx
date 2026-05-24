import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, LogOut, ChevronDown, ChevronUp, Search, Sparkles, X, Loader2 } from "lucide-react";
import { MenuCategory, MenuItem, menuData as localMenuData } from "./data";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [menu, setMenu] = useState<MenuCategory[]>(localMenuData);
  const [saving, setSaving] = useState(false);

  // For UI expansion state
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const [imageModal, setImageModal] = useState<{isOpen: boolean, catId: string, itemId?: string, query: string, images: string[], loading: boolean}>({
    isOpen: false, catId: '', query: '', images: [], loading: false
  });

  const openImageModal = (catId: string, itemId: string | undefined, defaultQuery: string = '') => {
    setImageModal({ isOpen: true, catId, itemId, query: defaultQuery, images: [], loading: false });
  };

  const closeImageModal = () => setImageModal(prev => ({ ...prev, isOpen: false }));

  const handleImageSearch = async () => {
    if (!imageModal.query) return;
    setImageModal(prev => ({ ...prev, loading: true, images: [] }));
    try {
      const res = await fetch(`/api/search-images?q=${encodeURIComponent(imageModal.query)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setImageModal(prev => ({ ...prev, loading: false, images: data.images || [] }));
    } catch (err) {
      setImageModal(prev => ({ ...prev, loading: false }));
      alert("Error searching images");
    }
  };

  const selectImage = (url: string) => {
    if (imageModal.itemId) {
      updateItem(imageModal.catId, imageModal.itemId, { image: url });
    } else {
      updateCategory(imageModal.catId, { image: url });
    }
    closeImageModal();
  };

  useEffect(() => {
    fetch(`/api/menu?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => setMenu(data))
      .catch(e => {
        console.error("Local fallback for menu");
        const localMenu = localStorage.getItem("menuData");
        if (localMenu) {
          setMenu(JSON.parse(localMenu));
        } else {
          // Import local data if localStorage is empty
          import('./data').then(mod => setMenu(mod.menuData)).catch(err => console.error(err));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(menu)
      });
      
      localStorage.setItem("menuData", JSON.stringify(menu));
      alert("تم الحفظ بنجاح! تم حفظ البيانات للتصدير أيضاً.");
    } catch (e) {
      // Fallback to local storage
      localStorage.setItem("menuData", JSON.stringify(menu));
      alert("تم الحفظ في المتصفح فقط (بدون خادم).");
    }
    setSaving(false);
  };

  const addCategory = () => {
    const newCat: MenuCategory = {
      id: "cat-" + Date.now(),
      title: "صنف جديد",
      image: "",
      items: []
    };
    setMenu([...menu, newCat]);
    setExpandedCats({ ...expandedCats, [newCat.id]: true });
  };

  const deleteCategory = (catId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    setMenu(menu.filter(c => c.id !== catId));
  };

  const updateCategory = (catId: string, updates: Partial<MenuCategory>) => {
    setMenu(menu.map(c => c.id === catId ? { ...c, ...updates } : c));
  };

  const addItemToCategory = (catId: string) => {
    const newItem: MenuItem = {
      id: "item-" + Date.now(),
      name: "عنصر جديد",
      price: 0,
      description: "",
      image: ""
    };
    setMenu(menu.map(c => {
      if (c.id === catId) {
        return { ...c, items: [...c.items, newItem] };
      }
      return c;
    }));
  };

  const deleteItem = (catId: string, itemId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setMenu(menu.map(c => {
      if (c.id === catId) {
        return { ...c, items: c.items.filter(i => i.id !== itemId) };
      }
      return c;
    }));
  };

  const updateItem = (catId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenu(menu.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
        };
      }
      return c;
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        onUrl(data.url);
      } else {
        alert("Upload error");
      }
    } catch (err) {
      // Note: we can't really fallback local file upload easily on static sites
      // We could use base64 readers but it takes up lot of space in localStorage.
      alert("Upload feature might not work on static sites without a backend.");
    }
  };

  const toggleCat = (id: string) => {
    setExpandedCats({ ...expandedCats, [id]: !expandedCats[id] });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("adminToken", data.token);
      } else {
        alert("Invalid credentials");
      }
    } catch (e) {
      alert("Error logging in");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] text-[#5E2D14] font-['Cairo'] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-right border border-[#EFE6DD]">
          <h2 className="text-2xl font-bold mb-6 text-center">دخول الإدارة</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-2 text-sm">اسم المستخدم</label>
              <input
                type="text"
                autoComplete="off"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#5E2D14] text-white py-3 rounded-lg font-bold hover:bg-[#8B4B27] transition-colors"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#5E2D14] font-['Cairo'] pb-24 text-right" dir="rtl">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-[#EFE6DD] px-4 py-4 flex justify-between items-center top-bar">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold"
        >
          <LogOut size={18} />
          خروج
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">لوحة التحكم السريعة</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#AA8B2C] transition-colors"
        >
          <Save size={18} />
          {saving ? "حفظ..." : "حفظ التعديلات"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 mt-6">
        <div className="mb-6 flex justify-end">
          <button
            onClick={addCategory}
            className="flex items-center gap-2 bg-[#5E2D14] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#8B4B27]"
          >
            <Plus size={18} />
            إضافة صنف جديد (رئيسي)
          </button>
        </div>

        <div className="space-y-6">
          {menu.map((cat, catIdx) => (
            <div key={cat.id} className="bg-white border border-[#EFE6DD] shadow-md rounded-2xl overflow-hidden p-1">
              <div
                className="bg-[#faf3e3] p-4 flex flex-col sm:flex-row justify-between items-center sm:items-start cursor-pointer rounded-xl gap-4"
                onClick={(e) => {
                  // Prevent toggle if clicking on inputs or buttons
                  if ((e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "BUTTON" && !(e.target as HTMLElement).closest("button")) {
                    toggleCat(cat.id);
                  }
                }}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative border">
                  {cat.image ? (
                    <img src={cat.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => updateCategory(cat.id, { title: e.target.value })}
                    placeholder="اسم الصنف (مثال: جيلاتو)"
                    className="text-xl font-bold p-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold w-16">صورة الغلاف:</span>
                    <input
                      type="text"
                      value={cat.image}
                      onChange={(e) => updateCategory(cat.id, { image: e.target.value })}
                      placeholder="رابط الصورة (URL)"
                      className="p-2 border rounded-lg flex-1 text-left"
                      dir="ltr"
                    />
                    <label className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors" title="رفع صورة">
                      <ImageIcon size={20} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => updateCategory(cat.id, { image: url }))}
                      />
                    </label>
                    <button onClick={() => openImageModal(cat.id, undefined, cat.title + ' dessert food ice cream')} className="bg-blue-50 text-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" title="بحث عن صورة">
                      <Search size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 font-bold whitespace-nowrap">
                    ({cat.items.length} منتجات)
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100"
                    title="حذف الصنف برمته"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="text-gray-500 p-2" onClick={() => toggleCat(cat.id)}>
                    {expandedCats[cat.id] ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
              </div>

              {expandedCats[cat.id] && (
                <div className="p-4 bg-white/50 border-t border-[#EFE6DD]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.items.map((item, itemIdx) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white relative group">
                        <button
                          onClick={() => deleteItem(cat.id, item.id)}
                          className="absolute top-2 left-2 text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="حذف المنتج"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative border group-hover:border-[#D4AF37]/50">
                            <img 
                              src={item.image || `https://picsum.photos/seed/${item.id}/300/300`} 
                              className="w-full h-full object-cover" 
                            />
                            {/* Upload overlay */}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                              <span className="text-white text-xs font-bold px-2 py-1 text-center">تغيير الصورة</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => updateItem(cat.id, item.id, { image: url }))}
                              />
                            </label>
                          </div>

                          <div className="flex-1 flex flex-col gap-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(cat.id, item.id, { name: e.target.value })}
                              placeholder="اسم المنتج (مثال: موهيتو)"
                              className="font-bold p-1.5 border-b focus:border-[#D4AF37] outline-none text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={item.price || ""}
                                onChange={(e) => updateItem(cat.id, item.id, { price: Number(e.target.value) })}
                                placeholder="السعر"
                                className="font-bold text-[#D4AF37] p-1.5 w-20 border rounded text-sm text-center outline-none"
                              />
                              <span className="text-sm font-bold text-gray-400 -mr-1">₪</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                           <textarea
                              value={item.description || ""}
                              onChange={(e) => updateItem(cat.id, item.id, { description: e.target.value })}
                              placeholder="وصف المنتج..."
                              className="w-full border rounded-lg p-2 text-sm text-gray-600 outline-none h-16 resize-none focus:ring-1 focus:ring-[#D4AF37]"
                           />
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2">
                           <input
                             type="text"
                             value={item.image || ""}
                             onChange={(e) => updateItem(cat.id, item.id, { image: e.target.value })}
                             placeholder="رابط الصورة الخارجي (اختياري)"
                             className="text-xs text-left p-1 border rounded w-full"
                             dir="ltr"
                           />
                           <button onClick={(e) => { e.stopPropagation(); openImageModal(cat.id, item.id, item.name + ' dessert ice cream'); }} className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 shrink-0" title="بحث">
                             <Search size={16} />
                           </button>
                           <label className="flex items-center gap-1 cursor-pointer mr-2 shrink-0">
                             <input 
                               type="checkbox" 
                               checked={item.isPopular || false} 
                               onChange={(e) => updateItem(cat.id, item.id, { isPopular: e.target.checked })}
                               className="accent-[#D4AF37]"
                             />
                             <span className="text-xs font-bold text-orange-500 whitespace-nowrap">مميز</span>
                           </label>
                        </div>

                      </div>
                    ))}
                    
                    {/* Add Item Button */}
                    <button
                      onClick={() => addItemToCategory(cat.id)}
                      className="border-2 border-dashed border-[#D4AF37]/40 rounded-xl p-4 flex flex-col items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-colors min-h-[160px]"
                    >
                      <Plus size={32} className="mb-2" />
                      <span className="font-bold">إضافة منتج جديد</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {imageModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#5E2D14]">
                <Search className="text-gray-500" />
                البحث عن صورة عبر الإنترنت
              </h2>
              <button onClick={closeImageModal} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full border">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageModal.query}
                  onChange={e => setImageModal(prev => ({...prev, query: e.target.value}))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                       handleImageSearch();
                    }
                  }}
                  className="flex-1 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="جرب البحث بالانجليزية لصور أفضل (مثال: crepe, ice cream)"
                  dir="ltr"
                />
                <button
                  onClick={handleImageSearch}
                  disabled={imageModal.loading || !imageModal.query}
                  className="bg-[#D4AF37] text-white px-6 rounded-lg font-bold hover:bg-[#AA8B2C] disabled:opacity-50 transition-colors min-w-[100px] flex items-center justify-center"
                >
                  {imageModal.loading ? <Loader2 className="animate-spin" /> : 'بحث'}
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 bg-gray-50 max-h-[50vh]">
               {imageModal.loading ? (
                 <div className="flex flex-col items-center justify-center h-48 gap-4 text-gray-500">
                   <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
                   <p>جاري البحث...</p>
                 </div>
               ) : imageModal.images.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {imageModal.images.map((url, i) => (
                     <button
                       key={i}
                       onClick={() => selectImage(url)}
                       className="group relative rounded-xl overflow-hidden aspect-square border-2 border-transparent hover:border-[#D4AF37] hover:shadow-lg transition-all"
                     >
                       <img src={url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-white font-bold bg-[#D4AF37] px-3 py-1 rounded-full text-sm">اختيار</span>
                       </div>
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="text-center text-gray-400 py-12 flex flex-col items-center gap-3">
                   <Search size={48} className="opacity-20" />
                   <p>اكتب كلمة البحث واضغط على الزر لرؤية النتائج هنا</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
