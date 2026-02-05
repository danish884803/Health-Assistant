'use client';

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ProfilePage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  async function loadProfile() {
    try {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Profile fetch failed");
        return;
      }

      const data = await res.json();
      setForm(data.user);
    } catch (err) {
      console.error("Profile load error:", err);
    }
  }

  loadProfile();
}, []);


  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setSaving(false);
    alert("Profile updated successfully");
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl border p-8 space-y-6">

          <h1 className="text-2xl font-extrabold">Profile Settings</h1>

          {/* BASIC */}
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={updateField} />
          <Input label="Phone" name="phone" value={form.phone || ""} onChange={updateField} />
          <Input label="Date of Birth" type="date" name="dob" value={form.dob?.slice(0,10) || ""} onChange={updateField} />

          {/* MEDICAL */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Blood Group" name="bloodGroup" value={form.bloodGroup || ""} onChange={updateField} />
            <Input label="Height (cm)" name="heightCm" value={form.heightCm || ""} onChange={updateField} />
            <Input label="Weight (kg)" name="weightKg" value={form.weightKg || ""} onChange={updateField} />
          </div>

          <Textarea label="Allergies" name="allergies" value={form.allergies || ""} onChange={updateField} />
          <Textarea label="Chronic Conditions" name="chronicConditions" value={form.chronicConditions || ""} onChange={updateField} />

          {/* EMERGENCY */}
          <h3 className="font-bold pt-4">Emergency Contact</h3>
          <Input label="Contact Name" name="emergencyContactName" value={form.emergencyContactName || ""} onChange={updateField} />
          <Input label="Contact Phone" name="emergencyContactPhone" value={form.emergencyContactPhone || ""} onChange={updateField} />

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        {...props}
        className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}
