// src/pages/superadmin/SystemSettings.jsx
import { useState } from "react";
import { SuperLayout } from "./Dashboard";

export default function SystemSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    restaurant_name: "DineOps Restaurant",
    address:         "123 Kimathi Street, Nairobi",
    phone:           "+254 700 000 000",
    email:           "info@dineops.co.ke",
    vat_rate:        "16",
    currency:        "KES",
    open_time:       "11:00",
    close_time:      "22:00",
    reservation_lead_time: "2",
    max_guests_per_table:  "10",
  });

  const f = key => ({
    value: settings[key],
    onChange: e => setSettings(p => ({ ...p, [key]: e.target.value }))
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #2a2a2a", background:"#0f0f0f", color:"#f5f0e8", fontSize:13, outline:"none", boxSizing:"border-box" };

  const Section = ({ title, children }) => (
    <div style={{ background:"#141414", border:"1px solid #1f1f1f", borderRadius:14, padding:"1.5rem", marginBottom:16 }}>
      <h2 style={{ fontSize:15, marginBottom:16, color:"#c9a84c" }}>{title}</h2>
      {children}
    </div>
  );

  const Field = ({ label, name, type="text" }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, color:"#a8a8a8", display:"block", marginBottom:4 }}>{label}</label>
      <input type={type} {...f(name)} style={inputStyle} />
    </div>
  );

  return (
    <SuperLayout title="System Settings">
      {saved && (
        <div style={{ background:"#0f2d1a", color:"#86efac", borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:13 }}>
          ✓ Settings saved successfully!
        </div>
      )}
      <form onSubmit={handleSave}>
        <Section title="Restaurant Info">
          <Field label="Restaurant Name"  name="restaurant_name" />
          <Field label="Address"          name="address" />
          <Field label="Phone"            name="phone" />
          <Field label="Email"            name="email" type="email" />
        </Section>

        <Section title="Business Hours">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Field label="Opening Time" name="open_time"  type="time" />
            <Field label="Closing Time" name="close_time" type="time" />
          </div>
        </Section>

        <Section title="Reservations">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Field label="Lead Time (hours)" name="reservation_lead_time" type="number" />
            <Field label="Max Guests/Table"  name="max_guests_per_table"  type="number" />
          </div>
        </Section>

        <Section title="Finance">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Field label="VAT Rate (%)" name="vat_rate"  type="number" />
            <Field label="Currency"     name="currency" />
          </div>
        </Section>

        <button type="submit" style={{
          width:"100%", background:"#c9a84c", color:"#0d0d0d",
          border:"none", borderRadius:10, padding:"13px",
          fontSize:14, fontWeight:700, cursor:"pointer"
        }}>Save Settings</button>
      </form>
    </SuperLayout>
  );
}
