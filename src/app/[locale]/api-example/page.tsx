'use client';

import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ApiExamplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users by role
  const fetchUsersByRole = async (role: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/users?role=${role}`);
      const data = await response.json();
      setUsers(data.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      setNewUser({ name: '', email: '', role: 'User' });
      await fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-foreground">Next.js API Routes Example</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Fetch Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Fetch All Users
          </button>
          <button
            onClick={() => fetchUsersByRole('Admin')}
            disabled={loading}
            className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Fetch Admins
          </button>
          <button
            onClick={() => fetchUsersByRole('User')}
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Fetch Users
          </button>
        </div>

        {/* Create User Form */}
        <div className="mb-8 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Create New User</h2>
          <form onSubmit={createUser} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-foreground dark:border-gray-600 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-foreground dark:border-gray-600 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-foreground dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Create User
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Users ({users.length})
          </h2>
          {loading && <p className="text-foreground">Loading...</p>}
          {!loading && users.length === 0 && (
            <p className="text-gray-500">No users found. Click a button to fetch users.</p>
          )}
          {!loading && users.length > 0 && (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-700"
                >
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    disabled={loading}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
