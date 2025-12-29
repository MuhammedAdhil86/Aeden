"use client";
import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { createClient } from "@/service/sales";

export default function CreateClientModal({
  existingClient = null,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    client_name: "",
    email: "",
    point_of_contact: "",
    contact_number: "",
    billing_address: "",
    delivery_address: "",
    location_latitude: "",
    location_longitude: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingClient) {
      setForm({
        client_name:
          existingClient.customer || existingClient.client_name || "",
        email: existingClient.email || "",
        point_of_contact: existingClient.point_of_contact || "",
        contact_number: existingClient.contact_number || "",
        billing_address: existingClient.billing_address || "",
        delivery_address: existingClient.delivery_address || "",
        location_latitude: existingClient.location_latitude || "",
        location_longitude: existingClient.location_longitude || "",
      });
    }
  }, [existingClient]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    const payload = {
      client_name: form.client_name,
      email: form.email,
      poc_name: form.point_of_contact,
      poc_number: form.contact_number,
      address: form.billing_address,
      delivery_address: form.delivery_address,
      location: {
        latitude: form.location_latitude,
        longitude: form.location_longitude,
      },
    };

    const res = await createClient(payload);

    toast.success("Client created successfully");

    if (onSubmit) onSubmit();   // notify parent
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Failed to save client");
  } finally {
    setSubmitting(false);
  }
};


  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[85vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Create Client
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-150px)] bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 font-sans font-semibold mb-1 block ml-3">
                Client Name
              </label>
              <input
                name="client_name"
                value={form.client_name}
                onChange={handleChange}
                placeholder="Enter Client business Name"
                className="w-full h-[46px] rounded-lg px-3 text-sm text-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-700 font-sm font-semibold mb-1 block font-sans ml-3">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full h-[46px] rounded-lg px-3 text-sm text-gray-400"
              />
            </div>

            {/* Point of Contact */}
            <div>
              <label className="text-sm text-gray-700 font-sm font-semibold mb-1 block font-sans ml-3">
                Point of contact name
              </label>
              <input
                name="point_of_contact"
                value={form.point_of_contact}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full h-[46px] rounded-lg px-3 text-sm"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-sm text-gray-700 font-sm font-sans mb-1 block font-semibold ml-3">
                Point of contact number
              </label>
              <input
                name="contact_number"
                type="tel"
                value={form.contact_number}
                onChange={handleChange}
                placeholder="Enter Mobile number"
                className="w-full h-[46px] rounded-lg px-3 text-sm"
              />
            </div>

            {/* Location Latitude */}
            <div>
              <label className="text-sm text-gray-700 font-sm font-semibold mb-1 block font-sans ml-3">
                Location Latitude
              </label>
              <input
                name="location_latitude"
                value={form.location_latitude}
                onChange={handleChange}
                placeholder="Enter Latitude"
                className="w-full h-[46px] rounded-lg px-3 text-sm"
              />
            </div>

            {/* Location Longitude */}
            <div>
              <label className="text-sm text-gray-700 font-sm font-sans font-semibold mb-1 block ml-3">
                Location Longitude
              </label>
              <input
                name="location_longitude"
                value={form.location_longitude}
                onChange={handleChange}
                placeholder="Enter Longitude"
                className="w-full h-[46px] rounded-lg px-3 text-sm"
              />
            </div>

            <div className="mt-4 ">
              <label className="text-sm text-gray-700 font-sm font-semibold mb-1 block font-sans ml-3">
                Billing Address
              </label>
              <textarea
                name="billing_address"
                value={form.billing_address}
                onChange={handleChange}
                placeholder="Billing address"
                rows={2}
                className="w-full h-[46px] rounded-lg px-3 text-sm  py-[10px]"
              />
            </div>

            {/* Delivery Address */}
            <div className="mt-4">
              <label className="text-sm text-gray-700 font-sm mb-1 block font-semibold font-sans ml-3">
                Delivery address
              </label>
              <textarea
                name="delivery_address"
                value={form.delivery_address}
                onChange={handleChange}
                placeholder="Delivery Address"
                rows={2}
                className="w-full h-[46px] rounded-lg px-3 text-sm  py-[10px]"
              />
            </div>
          </div>

          {/* Billing Address */}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t bg-white flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Calendar className="w-3 h-3 " />
            <span className="text-sm">Created on: {currentDate}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 text-sm"
            >
              {submitting ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
