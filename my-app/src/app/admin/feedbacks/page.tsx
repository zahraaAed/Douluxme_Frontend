'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { FiTrash, FiEdit } from "react-icons/fi";

interface Feedback {
  id: number;
  comment: string;
  ProductId: number;
  UserId: number;
  product: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
}

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [comment, setComment] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await axios.get("https://douluxme-backend.onrender.com/api/users/me", {
          withCredentials: true,
        });
        if (res.data.user.role === "admin") {
          setIsAdmin(true);
          fetchFeedbacks();
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

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("https://douluxme-backend.onrender.com/api/feedbacks/get", {
        withCredentials: true,
      });
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      toast.error("Failed to fetch feedbacks.");
    }
  };


  const handleEditClick = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setComment(feedback.comment);
  
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFeedback) return;

    try {
      await axios.patch(
        `https://douluxme-backend.onrender.com/api/feedbacks/update/${currentFeedback.id}`,
        { comment},
        { withCredentials: true }
      );

      const updated = feedbacks.map((n) =>
        n.id === currentFeedback.id ? { ...n, comment } : n
      );
      setFeedbacks(updated);
      toast.success("Feedback updated!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update feedback:", error);
      toast.error("Failed to update feedback.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axios.delete(`https://douluxme-backend.onrender.com/api/feedbacks/delete/${id}`, {
        withCredentials: true,
      });
      setFeedbacks((prev) => prev.filter((n) => n.id !== id));
      toast.success("Feedback deleted.");
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      toast.error("Failed to delete feedback.");
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
            Manage Feedbacks
          </h1>

      
          {/* Feedbacks Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm sm:text-base">
            <thead>
  <tr className="bg-[#A03321] text-white">
    <th className="p-2 border">ID</th>
    <th className="p-2 border">Product</th>
    <th className="p-2 border">User</th> {/* Optional */}
    <th className="p-2 border">Comment</th>
    <th className="p-2 border">Actions</th>
  </tr>
</thead>
<tbody>
  {feedbacks.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center p-2">
        No feedbacks found.
      </td>
    </tr>
  ) : (
    feedbacks.map((feedback) => (
      <tr key={feedback.id} className="text-center">
        <td className="border p-2 text-[#A03321]">{feedback.id}</td>
        <td className="border p-2 text-[#A03321]">{feedback.product?.name ?? "Unknown"}</td>
        <td className="border p-2 text-[#A03321]">{feedback.user?.name ?? "Unknown"}</td> {/* Optional */}
        <td className="border p-2 text-[#A03321]">{feedback.comment}</td>
        <td className="border p-2 flex justify-center gap-2">
          <button
            onClick={() => handleEditClick(feedback)}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
                       <FiEdit className="inline-block h-5 w-5 hover:scale-105 transition " />
          </button>
          <button
            onClick={() => handleDelete(feedback.id)}
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
                <h2 className="text-xl font-semibold text-[#A03321] mb-4">Edit Feedback</h2>
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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

export default Feedbacks;
