'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';


interface Category {
  id: number;
  name: string;
  image: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          withCredentials: true,
        });
  
        if (res.data.user.role === 'admin') {
          setIsAdmin(true);
          fetchCategories();
        } else {
          throw new Error('Not authorized');
        }
      } catch (error) {
        console.error('Admin check failed:', error); // ✅ logs full error
        if (axios.isAxiosError(error) && error.response) {
          toast.error(`Access denied: ${error.response.data.message || 'Admins only'}`);
        } else {
          toast.error('Access denied. Admins only.');
        }
        setTimeout(() => router.push('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };
  
    checkAdminStatus();
  }, [router]); // ✅ include 'router' in dependency array
  

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories/get', {
        withCredentials: true,
      });
      setCategories(res.data);
    }   catch (err) {
              // First, ensure that the error is an AxiosError
              if (err instanceof AxiosError) {
                const message =
                  err.response?.data?.message ||  // Check if the response has a message
                  err.message ||                  // Fallback to the error message from AxiosError
                  'Unknown error';                // Default message if no message is found
            
                console.error("category Error:", err);
            
                // Show the error message in the toast
                toast.error(message);
              } else {
                // If the error is not an instance of AxiosError, handle it as a generic error
                console.error("Non-Axios error:", err);
                toast.error('An unknown error occurred');
              }
            }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/categories/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Category added!");
      fetchCategories();
      setName("");
      setImage(null);
    }   catch (err) {
              // First, ensure that the error is an AxiosError
              if (err instanceof AxiosError) {
                const message =
                  err.response?.data?.message ||  // Check if the response has a message
                  err.message ||                  // Fallback to the error message from AxiosError
                  'Unknown error';                // Default message if no message is found
            
                console.error("category Error:", err);
            
                // Show the error message in the toast
                toast.error(message);
              } else {
                // If the error is not an instance of AxiosError, handle it as a generic error
                console.error("Non-Axios error:", err);
                toast.error('An unknown error occurred');
              }
            }
  };

  const handleEditClick = (category: Category) => {
    setCurrentCategory(category);
    setName(category.name);
    setImage(null); // Reset file input
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/categories/update/${currentCategory.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchCategories();
      toast.success('Category updated!');
      setEditModalOpen(false);
    }   catch (err) {
              // First, ensure that the error is an AxiosError
              if (err instanceof AxiosError) {
                const message =
                  err.response?.data?.message ||  // Check if the response has a message
                  err.message ||                  // Fallback to the error message from AxiosError
                  'Unknown error';                // Default message if no message is found
            
                console.error("category Error:", err);
            
                // Show the error message in the toast
                toast.error(message);
              } else {
                // If the error is not an instance of AxiosError, handle it as a generic error
                console.error("Non-Axios error:", err);
                toast.error('An unknown error occurred');
              }
            }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/delete/${id}`, {
        withCredentials: true,
      });
      setCategories((prev) => prev.filter((n) => n.id !== id));
      toast.success('Category deleted.');
    }  catch (err) {
              // First, ensure that the error is an AxiosError
              if (err instanceof AxiosError) {
                const message =
                  err.response?.data?.message ||  // Check if the response has a message
                  err.message ||                  // Fallback to the error message from AxiosError
                  'Unknown error';                // Default message if no message is found
            
                console.error("category Error:", err);
            
                // Show the error message in the toast
                toast.error(message);
              } else {
                // If the error is not an instance of AxiosError, handle it as a generic error
                console.error("Non-Axios error:", err);
                toast.error('An unknown error occurred');
              }
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
            Manage Categories
          </h1>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border p-2 rounded-md w-full text-[#A03321]"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
              className="border p-2 rounded-md w-full text-[#A03321]"
            />
            <button type="submit" className="bg-[#A6CC9A] text-white p-2 rounded-md">
              Add Category
            </button>
          </form>

          {/* Categories Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm sm:text-base">
              <thead>
                <tr className="bg-[#A03321] text-white">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-2">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="text-center">
                      <td className="border p-2 text-[#A03321]">{category.id}</td>
                      <td className="border p-2 text-[#A03321]">{category.name}</td>
                      <td className="border p-2">
                        <img
                          src={`http://localhost:5000/uploads/${category.image}`}
                          alt={category.name}
                          className="w-16 h-16 object-cover mx-auto"
                        />
                      </td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
                <h2 className="text-xl font-semibold text-[#A03321] mb-4">Edit Category</h2>
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full rounded text-[#A03321]"
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="border p-2 w-full rounded text-[#A03321]"
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

export default Categories;
