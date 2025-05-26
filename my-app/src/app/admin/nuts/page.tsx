"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

interface Nut {
  id: number;
  variety: string;
  price: number;
}

const NutsPage = () => {
  const [nuts, setNuts] = useState<Nut[]>([]);
  const [variety, setVariety] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentNut, setCurrentNut] = useState<Nut | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await axios.get("https://douluxme-backend.onrender.com/api/users/me", {
          withCredentials: true,
        });
        if (res.data.user.role === "admin") {
          setIsAdmin(true);
          fetchNuts();
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
  }, [router]);

  const fetchNuts = async () => {
    try {
      const res = await axios.get("https://douluxme-backend.onrender.com/api/nuts/get", {
        withCredentials: true,
      });
      setNuts(res.data);
    } catch (error) {
      console.error("Failed to fetch nuts:", error);
      toast.error("Failed to fetch nuts.");
    }
  };

  const handleAddNut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://douluxme-backend.onrender.com/api/nuts/create",
        { variety, price },
        { withCredentials: true }
      );
      toast.success("Nut added!");
      fetchNuts();
      setVariety("");
      setPrice(0);
    } catch (error) {
      console.error("Failed to add nut:", error);
      toast.error("Failed to add nut.");
    }
  };

  const handleEditClick = (nut: Nut) => {
    setCurrentNut(nut);
    setVariety(nut.variety);
    setPrice(nut.price);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNut) return;

    try {
     await axios.patch(
        `https://douluxme-backend.onrender.com/api/nuts/update/${currentNut.id}`,
        { variety, price },
        { withCredentials: true }
      );

      const updated = nuts.map((n) =>
        n.id === currentNut.id ? { ...n, variety, price } : n
      );
      setNuts(updated);
      toast.success("Nut updated!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update nut:", error);
      toast.error("Failed to update nut.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this nut?")) return;

    try {
      await axios.delete(`https://douluxme-backend.onrender.com/api/nuts/delete/${id}`, {
        withCredentials: true,
      });
      setNuts((prev) => prev.filter((n) => n.id !== id));
      toast.success("Nut deleted.");
    } catch (error) {
      console.error("Failed to delete nut:", error);
      toast.error("Failed to delete nut.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-[#A03321]">Checking admin access...</p>;
  }

  return (
    <div className="p-4 ">
      <ToastContainer />
      {isAdmin ? (
        <>
          <h1 className="text-2xl font-bold text-center text-[#A03321] mb-4">
            Manage Nuts
          </h1>
 {/* Add Nut Form */}
 <form onSubmit={handleAddNut} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Variety"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
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
              Add Nut
            </button>
            </form>
          {/* Nuts Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm sm:text-base">
              <thead>
                <tr className="bg-[#A03321] text-white">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Variety</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nuts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-2">
                      No nuts found.
                    </td>
                  </tr>
                ) : (
                  nuts.map((nut) => (
                    <tr key={nut.id} className="text-center">
                      <td className="border p-2 text-[#A03321]">{nut.id}</td>
                      <td className="border p-2 text-[#A03321]">{nut.variety}</td>
                      <td className="border p-2 text-[#A03321]">${nut.price.toFixed(2)}</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(nut)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(nut.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
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
                <h2 className="text-xl font-semibold text-[#A03321] mb-4">Edit Nut</h2>
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
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

export default NutsPage;
