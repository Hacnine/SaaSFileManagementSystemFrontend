import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch {
        setStatus('error');
        setMessage('Invalid or expired verification link.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">
                Verifying your email...
              </h2>
              <p className="text-gray-500 mt-2">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Email Verified!
              </h2>
              <p className="text-gray-500 mt-2">{message}</p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Verification Failed
              </h2>
              <p className="text-gray-500 mt-2">{message}</p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
