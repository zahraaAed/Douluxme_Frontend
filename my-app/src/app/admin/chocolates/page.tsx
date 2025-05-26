"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash } from "react-icons/fi";

interface Chocolate {
  id: number;
  type: string;
  price: number;
}

const ChocolatesPage = () => {
  const [chocolates, setChocolates] = useState<Chocolate[]>([]);
  const [type, setType] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentChocolate, setCurrentChocolate] = useState<Chocolate | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await axios.get("https://douluxme-backend.onrender.com/api/users/me", {
          withCredentials: true,
        });
        if (res.data.user.role === "admin") {
          setIsAdmin(true);
          fetchChocolates();
        } else {
          throw new Error("Not authorized");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Access denied. Admins only.");
        setTimeout(() => router.push("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const fetchChocolates = async () => {
    try {
      const res = await axios.get("https://douluxme-backend.onrender.com/api/chocolates/get", {
        withCredentials: true,
      });
      setChocolates(res.data);
    } catch (error) {
      console.error("Failed to fetch chocolates:", error);
      toast.error("Failed to fetch chocolates.");
    }
  };

  const handleAddChocolates = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://douluxme-backend.onrender.com/api/chocolates/create",
        { type, price },
        { withCredentials: true }
      );
      toast.success("Chocolate added!");
      fetchChocolates();
      setType("");
      setPrice(0);
    } catch (error) {
      console.error("Failed to add chocolate:", error);
      toast.error("Failed to add chocolate.");
    }
  };

  const handleEditClick = (chocolate: Chocolate) => {
    setCurrentChocolate(chocolate);
    setType(chocolate.type);
    setPrice(chocolate.price);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChocolate) return;

    try {
      await axios.patch(
        `https://douluxme-backend.onrender.com/api/chocolates/update/${currentChocolate.id}`,
        { type, price },
        { withCredentials: true }
      );

      const updated = chocolates.map((n) =>
        n.id === currentChocolate.id ? { ...n, type, price } : n
      );
      setChocolates(updated);
      toast.success("Chocolate updated!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update chocolate:", error);
      toast.error("Failed to update chocolate.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this chocolate?")) return;

    try {
      await axios.delete(`https://douluxme-backend.onrender.com/api/chocolates/delete/${id}`, {
        withCredentials: true,
      });
      setChocolates((prev) => prev.filter((n) => n.id !== id));
      toast.success("Chocolate deleted.");
    } catch (error) {
      console.error("Failed to delete chocolate:", error);
      toast.error("Failed to delete chocolate.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-[#A03321]">Checking admin access...</p>;
  }

  return (
    <div className="p-4">
      <ToastContainer />
      {isAdmin ? (
        <>
          <h1 className="text-2xl font-bold text-center text-[#A03321] mb-4">
            Manage Chocolates
          </h1>

          {/* Add Chocolate Form */}
          <form onSubmit={handleAddChocolates} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="border p-2 rounded-md w-full text-[#A03321]"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
              className="border p-2 rounded-md w-full text-[#A03321]"
            />
            <button type="submit" className="bg-[#A6CC9A] text-white p-2 rounded-md">
              Add Chocolate
            </button>
          </form>

          {/* Chocolates Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm sm:text-base">
              <thead>
                <tr className="bg-[#A03321] text-white">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chocolates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-2">
                      No chocolates found.
                    </td>
                  </tr>
                ) : (
                  chocolates.map((chocolate) => (
                    <tr key={chocolate.id} className="text-center">
                      <td className="border p-2 text-[#A03321]">{chocolate.id}</td>
                      <td className="border p-2 text-[#A03321]">{chocolate.type}</td>
                      <td className="border p-2 text-[#A03321]">${chocolate.price.toFixed(2)}</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(chocolate)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                           <FiEdit className="inline-block h-5 w-5 hover:scale-105 transition " />
                        </button>
                        <button
                          onClick={() => handleDelete(chocolate.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                         <FiTrash className="inline-block h-5 w-5 hover:scale-105 transition " />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {editModalOpen && (
         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-300">
                <h2 className="text-xl font-semibold text-[#A03321] mb-4">Edit Chocolate</h2>
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border p-2 w-full rounded text-[#A03321]"
                    required
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="border p-2 w-full rounded text-[#A03321]"
                    required
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      type="submit"
                      className="bg-[#A6CC9A] text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-red-500 mt-10">Access denied. Admins only.</p>
      )}
    </div>
  );
};

export default ChocolatesPage;
