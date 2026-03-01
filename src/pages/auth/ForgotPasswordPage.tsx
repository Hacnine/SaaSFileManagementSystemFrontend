import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useForgotPasswordMutation } from '@/services/authApi';
import { getErrorMessage } from '@/utils/errorHelper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [forgotPassword, { isLoading: isSubmitting }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword(email).unwrap();
      setIsSent(true);
      toast.success('Password reset email sent!');
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error as import('@reduxjs/toolkit/query').FetchBaseQueryError,
          'Failed to send reset email.',
        ),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-background to-purple-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              {isSent
                ? 'Check your email for a reset link'
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-muted-foreground mb-4">
                  We've sent a password reset link to{' '}
                  <strong className="text-foreground">{email}</strong>. Please
                  check your inbox and spam folder.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setIsSent(false)}
                  className="text-sm"
                >
                  Didn't receive it? Try again
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
