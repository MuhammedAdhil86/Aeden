"use client";
import React, { useState } from "react";
import { addOrder } from "@/service/sales";
import { toast } from "react-toastify";

export default function AddOrderModal({ open, onClose, onSuccess }) {
  if (!open) return null;

  const [form, setForm] = useState({
    staff_id: "",
    mode_of_delivery: "",
    remarks: "",
    items: [
      {
        product_id: "",
        product: "",
        category_id: "",
        category: "",
        qty: "",
        price: "",
        unit: "",
        total: "",
      },
    ],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto-calculate total if qty and price are present
    if (field === "qty" || field === "price") {
      const qty =
        parseFloat(field === "qty" ? value : updatedItems[index].qty) || 0;
      const price =
        parseFloat(field === "price" ? value : updatedItems[index].price) || 0;
      updatedItems[index].total = (qty * price).toFixed(2);
    }

    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product_id: "",
          product: "",
          category_id: "",
          category: "",
          qty: "",
          price: "",
          unit: "",
          total: "",
        },
      ],
    });
  };

  const removeItem = (index) => {
    if (form.items.length > 1) {
      const updatedItems = form.items.filter((_, i) => i !== index);
      setForm({ ...form, items: updatedItems });
    }
  };

  const calculateTotalAmount = () => {
    return form.items
      .reduce((sum, item) => {
        return sum + (parseFloat(item.total) || 0);
      }, 0)
      .toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      const total_amount = calculateTotalAmount();

      const validItems = form.items.filter(
        (item) => item.product_id && item.qty && item.price
      );

      if (validItems.length === 0) {
        toast.error("Please add at least one valid item");
        return;
      }

      const payload = {
        staff_id: form.staff_id,
        mode_of_delivery: form.mode_of_delivery,
        remarks: form.remarks,
        total_amount: parseFloat(total_amount),
        allocated_id: form.staff_id, // ✅ FIX ADDED HERE
        items: validItems.map((item) => ({
          product_id: String(item.product_id),
          product: item.product,
          category_id: item.category_id,
          category: item.category,
          qty: parseFloat(item.qty),
          price: parseFloat(item.price),
          unit: item.unit,
          total: parseFloat(item.total),
        })),
      };

      console.log("Submitting payload:", payload);

      const response = await addOrder(payload);

      toast.success("Order Added Successfully!");
      onSuccess();
      onClose();

      // Reset form
      setForm({
        staff_id: "",
        mode_of_delivery: "",
        remarks: "",
        items: [
          {
            product_id: "",
            product: "",
            category_id: "",
            category: "",
            qty: "",
            price: "",
            unit: "",
            total: "",
          },
        ],
      });
    } catch (error) {
      console.error("Error adding order:", error);
      console.error("Error response:", error.response?.data);

      // Display more specific error message
      if (error.response?.data) {
        toast.error(`Failed to add order: ${error.response.data}`);
      } else {
        toast.error("Failed to add order. Please check all fields.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] max-h-[90vh] rounded-lg shadow-lg p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Order</h2>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Staff ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Staff ID *</label>
            <input
              name="staff_id"
              value={form.staff_id}
              onChange={handleChange}
              placeholder="e.g., 100021"
              className="w-full mb-3 border p-2 rounded"
              required
            />
          </div>

          {/* Delivery Mode */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Delivery Mode *
            </label>
            <select
              name="mode_of_delivery"
              value={form.mode_of_delivery}
              onChange={handleChange}
              className="w-full mb-3 border p-2 rounded"
              required
            >
              <option value="">Select delivery mode</option>
              <option value="Door Delivery">Door Delivery</option>
              <option value="Pick Up">Pick Up</option>
            </select>
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="e.g., urgent order for party"
            className="w-full mb-3 border p-2 rounded"
            rows="2"
          />
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Order Items *</label>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Add Item
            </button>
          </div>

          {form.items.map((item, index) => (
            <div key={index} className="border p-3 rounded mb-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Item {index + 1}</span>
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Product ID *
                  </label>
                  <input
                    value={item.product_id}
                    onChange={(e) =>
                      handleItemChange(index, "product_id", e.target.value)
                    }
                    placeholder="e.g., 160"
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Product Name *
                  </label>
                  <input
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(index, "product", e.target.value)
                    }
                    placeholder="e.g., Midknight Orange 15 kg"
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Category ID *
                  </label>
                  <input
                    value={item.category_id}
                    onChange={(e) =>
                      handleItemChange(index, "category_id", e.target.value)
                    }
                    placeholder="e.g., 34"
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Category *
                  </label>
                  <input
                    value={item.category}
                    onChange={(e) =>
                      handleItemChange(index, "category", e.target.value)
                    }
                    placeholder="e.g., Orange"
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    placeholder="e.g., 10.50"
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    placeholder="e.g., 120.00"
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Unit *
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(index, "unit", e.target.value)
                    }
                    className="w-full border p-2 rounded text-sm"
                    required
                  >
                    <option value="">Select unit</option>
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="box">box</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Total
                  </label>
                  <input
                    value={item.total || "0.00"}
                    readOnly
                    className="w-full border p-2 rounded text-sm bg-gray-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Amount Display */}
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-bold">${calculateTotalAmount()}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Order
          </button>
        </div>
      </div>
    </div>
  );
}
