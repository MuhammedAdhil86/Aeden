"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchableSelect";
import axios from "axios";
import { Timer } from "lucide-react";

const FLEET_BASE_URL = "https://aeden-fleet-t579q.ondigitalocean.app";

// ================= SUB-MODAL COMPONENTS =================

const SimpleAddDialog = ({ isOpen, onClose, title, endpoint, payloadKey, onSuccess, categoryId }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      // localStorage access inside event, safe for hydration
      const token = localStorage.getItem("token");

      let payload = { [payloadKey]: value };

      if (title === "Product" && categoryId) {
        payload.category = { id: categoryId };
      }

      await axios.post(`${FLEET_BASE_URL}${endpoint}`, payload, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });

      setValue("");
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle>Add {title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label>{title} Name</Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()}`}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LocationAddDialog = ({ isOpen, onClose, onSuccess }) => {
  const [data, setData] = useState({ city: "", state: "", latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${FLEET_BASE_URL}/master/bench/Add-location`, data, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Input placeholder="City" onChange={(e) => setData({ ...data, city: e.target.value })} />
          <Input placeholder="State" onChange={(e) => setData({ ...data, state: e.target.value })} />
          <div className="flex gap-2">
            <Input placeholder="Lat" onChange={(e) => setData({ ...data, latitude: e.target.value })} />
            <Input placeholder="Long" onChange={(e) => setData({ ...data, longitude: e.target.value })} />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-black text-white w-full"
        >
          Save Location
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// ================= MAIN MODAL =================

const AddBenchmarkModal = ({ isOpen, onClose }) => {
  const [activeSubModal, setActiveSubModal] = useState(null);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [units, setUnits] = useState([]);

  const [loading, setLoading] = useState({
    category: false,
    product: false,
    country: false,
    supplier: false,
    brand: false,
    location: false,
    unit: false,
  });

  const [formData, setFormData] = useState({
    category: null,
    product: null,
    brand: null,
    provider: null,
    originCountry: null,
    region: "",
    price: "",
    count: "",
    unit: null,
    demand: "",
    remarks: "",
    regionCoords: null,
    link: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchCountries();
      fetchSuppliers();
      fetchBrands();
      fetchLocations();
      fetchUnits();
    }
  }, [isOpen]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: token ? `Bearer ${token}` : "" };
  };

  const fetchCategories = async () => {
    try {
      setLoading((p) => ({ ...p, category: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/stock/getAllCategory`, { headers: getAuthHeader() });
      setCategories(res.data?.data?.map((i) => ({ label: i.category_name, value: i.id })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, category: false })); }
  };

  const fetchProductsByCategory = async (categoryName) => {
    if (!categoryName) return;
    try {
      setLoading((p) => ({ ...p, product: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/stock/getAllProductByCategory?category=${categoryName}`, { headers: getAuthHeader() });
      setProducts(res.data?.map((i) => ({ label: i.product_name, value: i.id })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, product: false })); }
  };

  const fetchCountries = async () => {
    try {
      setLoading((p) => ({ ...p, country: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/bench/getAll-country`, { headers: getAuthHeader() });
      setCountries(res.data?.data?.map((i) => ({ label: i.country_name || i.name, value: i.id })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, country: false })); }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading((p) => ({ ...p, supplier: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/bench/getAll-company`, { headers: getAuthHeader() });
      setSuppliers(res.data?.data?.map((i) => ({ label: i.company_name || i.name, value: i.id })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, supplier: false })); }
  };

  const fetchBrands = async () => {
    try {
      setLoading((p) => ({ ...p, brand: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/bench/getAll-brand`, { headers: getAuthHeader() });
      setBrands(res.data?.data?.map((i) => ({ label: i.brand_name || i.name, value: i.id })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, brand: false })); }
  };

  const fetchLocations = async () => {
    try {
      setLoading((p) => ({ ...p, location: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/bench/getAll-location`, { headers: getAuthHeader() });
      setLocations(res.data?.data?.map((i) => ({
        label: `${i.city}, ${i.state}`,
        value: i.id,
        latitude: i.latitude,
        longitude: i.longitude
      })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, location: false })); }
  };

  const fetchUnits = async () => {
    try {
      setLoading((p) => ({ ...p, unit: true }));
      const res = await axios.get(`${FLEET_BASE_URL}/master/bench/getAll-units`, { headers: getAuthHeader() });
      setUnits(res.data?.data?.map((i) => ({ label: i.unit_name || i.name, value: i.id })) || []);
    } catch (e) { console.error(e); } finally { setLoading((p) => ({ ...p, unit: false })); }
  };

  const generateLink = (data) => {
    if (!data.category || !data.product || !data.brand || !data.provider || !data.originCountry || !data.unit || !data.region) return "";
    return [data.category.label, data.product.label, data.brand.label, data.provider.label, data.originCountry.label, data.unit.label, data.region]
      .map(p => encodeURIComponent(p)).join("-");
  };

  const handleChange = (field, option) => {
    setFormData((p) => {
      let updated = { ...p, [field]: option };
      if (field === "category" && option?.value) {
        fetchProductsByCategory(option.label);
        updated.product = null;
      }
      updated.link = generateLink(updated);
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!formData.product || !formData.category || !formData.brand || !formData.originCountry || !formData.provider) {
      alert("Please fill all required fields!");
      return;
    }

    const payload = {
      product: { id: formData.product.value },
      category: { id: formData.category.value },
      brand: { id: formData.brand.value },
      origin: { id: formData.originCountry.value },
      company: { id: formData.provider.value },
      region: formData.region,
      price: formData.price,
      count: formData.count,
      unit: formData.unit?.label,
      demand: formData.demand?.toUpperCase(),
      remarks: formData.remarks || "",
      date: new Date().toISOString(), // client-side date, safe in event handler
      provider: formData.provider?.label,
      location: formData.regionCoords ? { latitude: formData.regionCoords.latitude, longitude: formData.regionCoords.longitude } : undefined,
      link: formData.link,
    };

    try {
      await axios.post(`${FLEET_BASE_URL}/master/bench/Add`, payload, { headers: getAuthHeader() });
      onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] bg-white p-0 overflow-hidden rounded-xl border-none">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="text-pink-500"><Timer size={24} /></div>
              <DialogTitle className="text-lg font-bold text-slate-800">Add Product Price</DialogTitle>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
          </div>

          <div className="px-8 py-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <Field label="Category" onAdd={() => setActiveSubModal('category')}>
                <SearchableSelect value={formData.category} placeholder={loading.category ? "Loading..." : "Category"} options={categories} onChange={(i) => handleChange("category", i)} />
              </Field>

              <Field label="Product" onAdd={() => setActiveSubModal('product')}>
                <SearchableSelect value={formData.product} placeholder={loading.product ? "Loading..." : "Product"} options={products} onChange={(i) => handleChange("product", i)} />
              </Field>

              <Field label="Origin Country" onAdd={() => setActiveSubModal('country')}>
                <SearchableSelect value={formData.originCountry} placeholder="Choose Origin Country" options={countries} onChange={(i) => handleChange("originCountry", i)} />
              </Field>

              <Field label="Supplier/Company" onAdd={() => setActiveSubModal('supplier')}>
                <SearchableSelect value={formData.provider} placeholder="Choose Provider" options={suppliers} onChange={(i) => handleChange("provider", i)} />
              </Field>

              <div className="col-span-2 border-t pt-2 mt-2 opacity-20"></div>

              <Field label="Brand" onAdd={() => setActiveSubModal('brand')}>
                <SearchableSelect value={formData.brand} placeholder="Choose brand" options={brands} onChange={(i) => handleChange("brand", i)} />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Count">
                  <Input className="h-10" placeholder="0" value={formData.count} onChange={(e) => handleChange("count", e.target.value)} />
                </Field>
                <Field label="Unit" onAdd={() => setActiveSubModal('unit')}>
                  <SearchableSelect value={formData.unit} placeholder="Box" options={units} onChange={(i) => handleChange("unit", i)} />
                </Field>
              </div>

              <Field label="Location" onAdd={() => setActiveSubModal('location')}>
                <SearchableSelect
                  value={formData.region ? { label: formData.region } : null}
                  placeholder="Select Location"
                  options={locations}
                  onChange={(i) => {
                    handleChange("region", i?.label);
                    handleChange("regionCoords", { latitude: i?.latitude, longitude: i?.longitude });
                  }}
                />
              </Field>

              <Field label="Price">
                <Input className="h-10" placeholder="₹0.00" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} />
              </Field>

              <div className="col-span-2">
                <Field label="Remarks">
                  <Input className="h-10 w-full" placeholder="Enter Remarks" value={formData.remarks} onChange={(e) => handleChange("remarks", e.target.value)} />
                </Field>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 border-t flex items-center justify-between bg-slate-50/50">
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Added By</span><br />
              <span className="text-green-600 font-semibold text-sm">Sidharth C R</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="px-8 py-2 border-gray-300 text-red-400 font-medium hover:bg-red-50">Cancel</Button>
              <Button onClick={handleSubmit} className="px-10 py-2 bg-black text-white hover:bg-gray-800 rounded-lg">Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SUB-MODALS */}
      <SimpleAddDialog
        isOpen={activeSubModal === 'category'}
        onClose={() => setActiveSubModal(null)}
        title="Category" endpoint="/master/stock/Addcategory" payloadKey="category_name"
        onSuccess={fetchCategories}
      />
      <SimpleAddDialog
        isOpen={activeSubModal === 'product'}
        onClose={() => setActiveSubModal(null)}
        title="Product" endpoint="/master/stock/Addproduct" payloadKey="product_name"
        onSuccess={() => fetchProductsByCategory(formData.category?.label)}
        categoryId={formData.category?.value}
      />
      <SimpleAddDialog
        isOpen={activeSubModal === 'country'}
        onClose={() => setActiveSubModal(null)}
        title="Country" endpoint="/master/bench/Add-country" payloadKey="country_name"
        onSuccess={fetchCountries}
      />
      <SimpleAddDialog
        isOpen={activeSubModal === 'supplier'}
        onClose={() => setActiveSubModal(null)}
        title="Supplier" endpoint="/master/bench/Add-company" payloadKey="company_name"
        onSuccess={fetchSuppliers}
      />
      <SimpleAddDialog
        isOpen={activeSubModal === 'brand'}
        onClose={() => setActiveSubModal(null)}
        title="Brand" endpoint="/master/bench/Add-brand" payloadKey="brand_name"
        onSuccess={fetchBrands}
      />
      <SimpleAddDialog
        isOpen={activeSubModal === 'unit'}
        onClose={() => setActiveSubModal(null)}
        title="Unit" endpoint="/master/bench/Add-unit" payloadKey="unit_name"
        onSuccess={fetchUnits}
      />
      <LocationAddDialog
        isOpen={activeSubModal === 'location'}
        onClose={() => setActiveSubModal(null)}
        onSuccess={fetchLocations}
      />
    </>
  );
};

const Field = ({ label, children, onAdd }) => (
  <div className="space-y-1.5 flex flex-col">
    <div className="flex justify-between items-center px-0.5">
      <Label className="text-[13px] font-semibold text-gray-700">{label}</Label>
      {onAdd && (
        <button onClick={onAdd} className="text-[13px] font-semibold text-gray-800 hover:underline">Add</button>
      )}
    </div>
    {children}
  </div>
);

export default AddBenchmarkModal;
