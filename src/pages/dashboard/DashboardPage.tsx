import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="font-semibold text-gray-900">
                SaaS File Manager
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {user?.role === 'ADMIN' ? (
                  <Shield className="w-4 h-4 text-indigo-600" />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-500">
            {user?.role === 'ADMIN'
              ? 'You are logged in as an administrator. You can manage subscription packages from here.'
              : 'You are logged in as a user. Start managing your files and folders.'}
          </p>

          {!user?.isEmailVerified && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Your email is not verified yet. Please
                check your inbox for a verification link.
              </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
              <h3 className="font-semibold text-indigo-900">
                {user?.role === 'ADMIN' ? 'Manage Packages' : 'My Subscription'}
              </h3>
              <p className="text-indigo-700 text-sm mt-1">
                {user?.role === 'ADMIN'
                  ? 'Create and manage subscription packages.'
                  : user?.activePackage
                    ? `Current: ${user.activePackage.name}`
                    : 'No active subscription package.'}
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-purple-900">My Folders</h3>
              <p className="text-purple-700 text-sm mt-1">
                Manage your folder structure.
              </p>
            </div>
            <div className="p-6 bg-pink-50 rounded-xl border border-pink-100">
              <h3 className="font-semibold text-pink-900">My Files</h3>
              <p className="text-pink-700 text-sm mt-1">
                Upload, view, and manage your files.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
