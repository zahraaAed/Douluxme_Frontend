"use client";

import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiTrash, FiEdit } from "react-icons/fi";
import { useRouter } from 'next/navigation';

// Define types for user and address
interface Address {
  region: string;
  "address-direction": string;
  phone: string;
  building: string;
  floor: string;
}

interface User {
  id: string | null;
  name: string;
  email: string;
  password: string;
  address: Address;
  role: "customer" | "admin";
}

const UsersPage = () => {
  // State variables with types
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: null,
    name: "",
    email: "",
    password: "",
    address: {
      region: "",
      "address-direction": "",
      phone: "",
      building: "",
      floor: "",
    },
    role: "customer",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [, setFormErrors] = useState<Record<string, string>>({});

  const router = useRouter();  // Use Next.js router for redirection



  // Filter users whenever the role filter or users change
  useEffect(() => {
    filterUsers();
  }, [roleFilter, users]);

  // Check if the user is an admin and fetch users accordingly
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await axios.get<{ user: User }>('http://localhost:5000/api/users/me', {
          withCredentials: true,
        });
  
        const user = res.data.user;
        if (user.role === "admin") {
          setIsAdmin(true);
          fetchUsers();
        } else {
          throw new Error("Not admin");
        }
      } catch (error) {
        console.error(error);
        setIsAdmin(false);
        toast.error("Access denied. Admins only.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };
  
    checkAdminStatus();
  }, []);
  

  // Fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/users/get', {
        withCredentials: true,
      });
  
      // Log and inspect the response data
      console.log("data",res.data);
  
      // Check if 'users' is present in the response and it's an array
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        console.log("Fetched users:", res.data);
      
      } else {
        setUsers([]); // Fallback if users data is missing or not an array
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };
  

  const filterUsers = useCallback(() => {
    const filtered = users.filter((user) => roleFilter === "all" || user.role === roleFilter);
    setFilteredUsers(filtered);
  }, [roleFilter, users]);
  
  useEffect(() => {
    filterUsers();
  }, [filterUsers]);
  

  // Validate the address fields before submitting
  const validateAddress = (address: Address): boolean => {
    return (
      address.region !== "" &&
      address["address-direction"] !== "" &&
      address.phone !== "" &&
      address.building !== "" &&
      address.floor !== ""
    );
  };

  // Handle adding a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateAddress(newUser.address)) {
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/register', newUser, { withCredentials: true });
      fetchUsers();
      resetForm();
      toast.success("User added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add user.");
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${userId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    }
  };

  // Handle editing a user
  const handleEditUser = (user: User) => {
    setEditUserId(user.id);
    setNewUser({
      ...user,
      password: "", // For editing, we clear the password field
    });
  };

  // Handle updating user data
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateAddress(newUser.address)) {
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/users/update/${editUserId}`, newUser, { withCredentials: true });
      fetchUsers();
      resetForm();
      toast.success("User updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user.");
    }
  };

  // Reset the form fields after adding or updating a user
  const resetForm = () => {
    setEditUserId(null);
    setNewUser({
      id: null,
      name: "",
      email: "",
      password: "",
      address: {
        region: "",
        "address-direction": "",
        phone: "",
        building: "",
        floor: "",
      },
      role: "customer",
    });
  };

  // Address Form component for reusable form fields
  interface AddressFormProps {
    address: Address;
    updateAddress: (updatedAddress: Address) => void;
  }

  const AddressForm: React.FC<AddressFormProps> = ({ address, updateAddress }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateAddress({
        ...address,
        [name]: value,
      });
    };

    return (
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="region"
          value={address.region}
          onChange={handleChange}
          placeholder="Region"
          className="border p-2 rounded-md text-[#A03321]"
        />
        <input
          type="text"
          name="address-direction"
          value={address["address-direction"]}
          onChange={handleChange}
          placeholder="Address Direction"
          className="border p-2 rounded-md text-[#A03321]"
        />
        <input
          type="text"
          name="phone"
          value={address.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded-md text-[#A03321]"
        />
        <input
          type="text"
          name="building"
          value={address.building}
          onChange={handleChange}
          placeholder="Building"
          className="border p-2 rounded-md text-[#A03321]"
        />
        <input
          type="text"
          name="floor"
          value={address.floor}
          onChange={handleChange}
          placeholder="Floor"
          className="border p-2 rounded-md text-[#A03321]"
        />
      </div>
    );
  };

  return (
    <div className="p-4 mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center text-[#A03321]">Manage Users</h1>
      {isAdmin ? (
        <>
          {/* Role Filter */}
          <div className="my-4 flex flex-col sm:flex-row items-center gap-4">
            <label className="text-lg font-medium text-[#A03321]">Filter by role:</label>
            <select
              onChange={(e) => setRoleFilter(e.target.value as "all" | "admin" | "customer")}
              className="p-2 border rounded-md w-full sm:w-auto border-[#A03321]"
            >
              <option value="all text-[#A03321]">All</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
       
                <form onSubmit={handleAddUser} className="flex flex-col gap-3 p-4 rounded-md">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="border p-2 rounded-md text-[#A03321]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="border p-2 rounded-md text-[#A03321]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                   className="border p-2 rounded-md text-[#A03321]"
                  />
                  {/* Address Form */}
                  <AddressForm
                    address={newUser.address}
                    updateAddress={(updatedAddress) =>
                      setNewUser({ ...newUser, address: updatedAddress })
                    }
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "customer" })}
                   className="border p-2 rounded-md text-[#A03321]"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="bg-[#A6CC9A] text-white p-2 rounded-md">
                    Add User
                  </button>
                </form>
          {/* Users Table */}
          {loading ? (
            <div className="text-center text-[#A03321]">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm sm:text-base">
                <thead>
                  <tr className="bg-[#A03321] text-white">
                    <th className="border p-2 ">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2 ">Email</th>
                    <th className="border p-2 ">Role</th>
                    <th className="border p-2 ">Address</th>
                    <th className="border p-2 ">Actions</th>
                  </tr>
                </thead>
                <tbody>
  {filteredUsers.length === 0 ? (
    <tr>
      <td className="text-center p-2">No users found</td>
    </tr>
  ) : (
    filteredUsers.map((user) => (
      <tr key={user.id} className="text-center">
        <td className="border p-2 text-[#A03321]">{user.id}</td>
        <td className="border p-2 text-[#A03321]">{user.name}</td>
        <td className="border p-2 text-[#A03321]">{user.email}</td>
        <td className="border p-2 text-[#A03321]">{user.role}</td>
        <td className="border p-2 text-[#A03321]">
          {user.address
            ? `${user.address.region}, ${user.address["address-direction"]}, ${user.address.building}, ${user.address.floor}, ${user.address.phone}`
            : "N/A"}
        </td>
        <td className="p-2 border space-x-2">
        <button onClick={() => handleEditUser(user)} className="text-white p-2 hover:text-blue-800">
            <FiEdit className="inline-block h-5 w-5 hover:scale-105 transition " />
          </button>
          <button onClick={() => handleDeleteUser(user.id!)}className="text-red-500 bg-red p-2 hover:text-blue-800">
            <FiTrash className="inline-block h-5 w-5 hover:scale-105 transition " />
          </button>
         
        </td>
      </tr>
    ))
  )}
</tbody>

              </table>
            </div>
          )}

          {/* Add or Edit User Form */}
          <div className="my-6 bg-gray-200 p-4 rounded-md">
            {editUserId ? (
              <>
              
                <h2 className="text-xl font-bold mb-2 text-[#A03321]">Edit User</h2>
                <form onSubmit={handleUpdateUser} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="border p-2 rounded-md"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="border p-2 rounded-md"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "customer" })}
                    className="border p-2 rounded-md"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {/* Address Form */}
                  <AddressForm
                    address={newUser.address}
                    updateAddress={(updatedAddress) =>
                      setNewUser({ ...newUser, address: updatedAddress })
                    }
                  />
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                    Update User
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-400 text-white p-2 rounded-md">
                    Cancel
                  </button>
                </form>
              </>
            ) : (
              <>
              
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-red-500 text-center">Access denied. Admins only.</p>
      )}
    </div>
  );
};

export default UsersPage;
