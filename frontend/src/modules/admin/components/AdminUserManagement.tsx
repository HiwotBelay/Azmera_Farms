"use client";

import { useEffect, useState } from "react";
import { Search, Edit, Trash2, Shield, UserCheck, UserX, Mail } from "lucide-react";
import { adminApi, User, UpdateUserDto } from "../api/admin.api";

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [filter, setFilter] = useState<{
    role?: 'LEARNER' | 'CREATOR' | 'ADMIN';
    search?: string;
  }>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserDto>({});

  useEffect(() => {
    fetchUsers();
  }, [page, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers({
        ...filter,
        page,
        limit,
      });
      setUsers(response.users);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    try {
      await adminApi.updateUser(userId, editForm);
      alert('User updated successfully!');
      setEditingUser(null);
      setEditForm({});
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      LEARNER: { color: 'bg-blue-100 text-blue-800', label: 'Learner' },
      CREATOR: { color: 'bg-purple-100 text-purple-800', label: 'Creator' },
      ADMIN: { color: 'bg-red-100 text-red-800', label: 'Admin' },
    };
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.LEARNER;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filter.search || ''}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filter.role || 'ALL'}
              onChange={(e) => setFilter(prev => ({ 
                ...prev, 
                role: e.target.value === 'ALL' ? undefined : e.target.value as User['role']
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ALL">All Roles</option>
              <option value="LEARNER">Learners</option>
              <option value="CREATOR">Creators</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No users found</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.firstName || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                          <UserX className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={editForm.firstName || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editForm.role || 'LEARNER'}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="LEARNER">Learner</option>
                  <option value="CREATOR">Creator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editForm.isActive ?? true}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setEditForm({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateUser(editingUser.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

