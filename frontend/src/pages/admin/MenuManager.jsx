// src/pages/admin/MenuManager.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { AdminLayout } from "./Dashboard";

export default function MenuManager() {
  const [categories, setCategories] = useState([]);
  const [items, setItems]           = useState([]);
  const [tab, setTab]               = useState("items");
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState({});
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([api.get("/menu/categories/"), api.get("/menu/items/")])
      .then(([c, i]) => { setCategories(c.data); setItems(i.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openModal = (type, data = {}) => { setModal(type); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const saveItem = async () => {
    if (form.id) {
      await api.patch(`/menu/items/${form.id}/manage/`, form);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...form } : i));
    } else {
      const res = await api.post("/menu/items/create/", form);
      setItems(prev => [res.data, ...prev]);
    }
    closeModal();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/menu/items/${id}/manage/`);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const f = key => ({ value: form[key] || "", onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none", boxSizing:"border-box" };

  return (
    <AdminLayout title="Menu Manager">
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:8 }}>
          {["items","categories"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"7px 18px", borderRadius:8, border:"1px solid #2a2a2a", background: tab===t ? "#c9a84c" : "transparent", color: tab===t ? "#0d0d0d" : "#a09880", fontSize:12, cursor:"pointer", fontWeight: tab===t ? 700 : 400, textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>
        <button onClick={() => openModal("item")} style={{ background:"#c9a84c", color:"#0d0d0d", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Add Item</button>
      </div>

      {loading ? <div style={{ color:"#555", textAlign:"center", padding:"3rem" }}>Loading...</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
          {(tab === "items" ? items : categories).map(item => (
            <div key={item.id} style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:12, padding:"1rem" }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width:"100%", height:120, objectFit:"cover", borderRadius:8, marginBottom:10 }} />}
              <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{item.name}</div>
              {item.price && <div style={{ fontSize:13, color:"#c9a84c", marginBottom:6 }}>Ksh {Number(item.price).toLocaleString()}</div>}
              {item.description && <div style={{ fontSize:12, color:"#706856", marginBottom:10, lineHeight:1.5 }}>{item.description}</div>}
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => openModal("item", item)} style={{ flex:1, padding:"6px", borderRadius:6, border:"1px solid #2a2a2a", background:"transparent", color:"#a09880", fontSize:12, cursor:"pointer" }}>Edit</button>
                <button onClick={() => deleteItem(item.id)} style={{ flex:1, padding:"6px", borderRadius:6, border:"1px solid #7f1d1d", background:"transparent", color:"#f87171", fontSize:12, cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100 }} onClick={closeModal}>
          <div style={{ background:"#141414", border:"1px solid #2a2a2a", borderRadius:"16px 16px 0 0", padding:"1.5rem", width:"100%", maxWidth:500, maxHeight:"85vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:16, marginBottom:16 }}>{form.id ? "Edit Item" : "Add Menu Item"}</h2>
            {[
              { label:"Name", key:"name" },
              { label:"Description", key:"description", textarea:true },
              { label:"Price (Ksh)", key:"price", type:"number" },
              { label:"Image URL", key:"image" },
            ].map(({ label, key, type, textarea }) => (
              <div key={key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>{label}</label>
                {textarea
                  ? <textarea {...f(key)} rows={3} style={{ ...inputStyle, resize:"vertical" }} />
                  : <input type={type||"text"} {...f(key)} style={inputStyle} />
                }
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>Category</label>
              <select {...f("category")} style={inputStyle}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={closeModal} style={{ flex:1, background:"transparent", border:"1px solid #2a2a2a", borderRadius:8, color:"#a09880", padding:"10px", cursor:"pointer", fontSize:13 }}>Cancel</button>
              <button onClick={saveItem} style={{ flex:1, background:"#c9a84c", border:"none", borderRadius:8, color:"#0d0d0d", padding:"10px", cursor:"pointer", fontSize:13, fontWeight:700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
