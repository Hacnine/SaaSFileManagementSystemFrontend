import React, { useState, useEffect } from 'react';
import { useGetPackagesQuery, useCreatePackageMutation, useUpdatePackageMutation, useDeletePackageMutation } from '../../services/packagesApi';
import { SubscriptionPackage } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PackagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // redirect non-admins back to dashboard
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { data: packages, isLoading, error } = useGetPackagesQuery();
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [formState, setFormState] = useState<Partial<SubscriptionPackage>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormState({});
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (name === 'allowedFileTypes') {
      newValue = value.split(',').map((v) => v.trim());
    } else if (type === 'number') {
      newValue = Number(value);
    }
    setFormState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePackage({ id: editingId, data: formState });
        alert('Package updated');
      } else {
        await createPackage(formState);
        alert('Package created');
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const handleEdit = (pkg: SubscriptionPackage) => {
    setEditingId(pkg.id);
    setFormState({
      name: pkg.name,
      maxFolders: pkg.maxFolders,
      maxNestingLevel: pkg.maxNestingLevel,
      allowedFileTypes: pkg.allowedFileTypes,
      maxFileSize: pkg.maxFileSize,
      totalFileLimit: pkg.totalFileLimit,
      filesPerFolder: pkg.filesPerFolder,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        alert('Deleted');
      } catch (err) {
        console.error(err);
        alert('Failed to delete');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Subscription Packages</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit package' : 'Create new package'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                value={formState.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="maxFolders" className="block text-sm font-medium text-gray-700">Max folders</label>
              <input
                id="maxFolders"
                name="maxFolders"
                type="number"
                value={formState.maxFolders ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="maxNestingLevel" className="block text-sm font-medium text-gray-700">Max nesting level</label>
              <input
                id="maxNestingLevel"
                name="maxNestingLevel"
                type="number"
                value={formState.maxNestingLevel ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="allowedFileTypes" className="block text-sm font-medium text-gray-700">Allowed file types (comma separated)</label>
              <input
                id="allowedFileTypes"
                name="allowedFileTypes"
                value={Array.isArray(formState.allowedFileTypes) ? formState.allowedFileTypes.join(', ') : formState.allowedFileTypes || ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700">Max file size (MB)</label>
              <input
                id="maxFileSize"
                name="maxFileSize"
                type="number"
                value={formState.maxFileSize ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="totalFileLimit" className="block text-sm font-medium text-gray-700">Total file limit</label>
              <input
                id="totalFileLimit"
                name="totalFileLimit"
                type="number"
                value={formState.totalFileLimit ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="filesPerFolder" className="block text-sm font-medium text-gray-700">Files per folder</label>
              <input
                id="filesPerFolder"
                name="filesPerFolder"
                type="number"
                value={formState.filesPerFolder ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Existing packages</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-600">Failed to load packages</p>}
          {packages && packages.length === 0 && <p>No packages defined yet.</p>}
          {packages && packages.length > 0 && (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-left">Name</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{pkg.name}</td>
                    <td className="border px-2 py-1 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
