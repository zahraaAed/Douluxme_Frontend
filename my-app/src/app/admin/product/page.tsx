"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { FaPen, FaTrashAlt, FaPlusCircle } from "react-icons/fa"
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image";

// Interface for Product
interface ProductAdmin {
  id: number;
  name: string;
  price: number;
  image: string;
  boxSiza?: number;
  nut: {
    variety: string;
  };
  chocolate: {
    type: string;
  };
  category: {
    name: string;
  };
}

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductAdmin | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: null as File | null,
    boxSiza: undefined as number | undefined,
    nutVariety: "",
    chocolateType: "",
    categoryName: ""
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const router = useRouter();

  // Fetch products on component mount
  useEffect(() => {
    axios.get('https://douluxme-backend.onrender.com/api/products/get')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products!");
      });
  }, []);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
     /*  setFormData(prev => ({ ...prev, image: e.target.files[0] })); */
    }
  };

  // Open modal for adding a new product
  const handleAddProduct = () => {
    setEditProduct(null);
    setFormData({
      name: "",
      price: 0,
      image: null,
      boxSiza: undefined,
      nutVariety: "",
      chocolateType: "",
      categoryName: ""
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing product
  const handleEditProduct = (product: ProductAdmin) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: null, // We will keep the old image unless the user uploads a new one
      boxSiza: product.boxSiza,
      nutVariety: product.nut.variety,
      chocolateType: product.chocolate.type,
      categoryName: product.category.name
    });
    setIsModalOpen(true);
  };

  // Handle add/edit product form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("image", formData.image as Blob); // Adding image
    formDataToSend.append("boxSiza", formData.boxSiza?.toString() || "");
    formDataToSend.append("nutVariety", formData.nutVariety);
    formDataToSend.append("chocolateType", formData.chocolateType);
    formDataToSend.append("categoryName", formData.categoryName);

    try {
      if (editProduct) {
        // Update existing product
        await axios.patch(`https://douluxme-backend.onrender.com/api/products/update/${editProduct.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        // Create a new product
        await axios.post('https://douluxme-backend.onrender.com/api/products/create', formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }
      setIsModalOpen(false); // Close modal after submit
      setFormData({
        name: "",
        price: 0,
        image: null,
        boxSiza: undefined,
        nutVariety: "",
        chocolateType: "",
        categoryName: ""
      });
     
    } catch (err) {
      console.error("Error while submitting the product:", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`https://douluxme-backend.onrender.com/api/products/delete/${productToDelete}`);
        toast.success("Product deleted successfully!");
        setIsDeleteConfirmOpen(false);
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product.");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#A03321]">Product List</h2>
        <button
          className="flex items-center gap-1 text-[#A6CC9A] hover:text-green-800"
          onClick={handleAddProduct}
        >
          <FaPlusCircle size={20} />
          Add Product
        </button>
      </div>

      <table className="min-w-full border border-[#A03321]">
        <thead className="bg-[#A03321]">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Box Size</th>
            <th className="p-2 border">Nut</th>
            <th className="p-2 border">Chocolate</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="text-center border text-[#A03321]">
              <td className="p-2 border">
                <Image src={product.image} alt={product.name} className="w-12 h-12 object-cover mx-auto" />
              </td>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">${product.price}</td>
              <td className="p-2 border">{product.boxSiza ?? '-'}</td>
              <td className="p-2 border">{product.nut.variety}</td>
              <td className="p-2 border">{product.chocolate.type}</td>
              <td className="p-2 border">{product.category.name}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800">
                  <FaPen size={18} />
                </button>
                <button onClick={() => { setProductToDelete(product.id); setIsDeleteConfirmOpen(true); }} className="text-red-600 hover:text-red-800">
                  <FaTrashAlt size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {editProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this product?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toastify Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProductAdmin;
