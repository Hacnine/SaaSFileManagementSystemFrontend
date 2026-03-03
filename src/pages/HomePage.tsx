import React from 'react';
import { Link } from 'react-router-dom';
import { useGetPublicPackagesQuery } from '@/services/publicPackagesApi';
import { useAuth } from '@/contexts/AuthContext';
import {
  useGetSubscriptionStatusQuery,
  useSubscribePackageMutation,
  useUnsubscribePackageMutation,
} from '@/services/userApi';
import toast from 'react-hot-toast';
import {
  FolderTree,
  FileText,
  HardDrive,
  Layers,
  ArrowRight,
  Loader2,
  Check,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const { data: packages, isLoading, isError } = useGetPublicPackagesQuery();
  const { isAuthenticated } = useAuth();

  const {
    data: subscriptionStatus,
    isLoading: statusLoading,
  } = useGetSubscriptionStatusQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [subscribePackage, { isLoading: subscribing }] =
    useSubscribePackageMutation();
  const [unsubscribePackage, { isLoading: unsubscribing }] =
    useUnsubscribePackageMutation();

  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSubscribe = async (pkgId: string) => {
    try {
      await subscribePackage({ packageId: pkgId }).unwrap();
      const msg = 'Subscribed successfully.';
      setFeedback(msg);
      toast.success(msg);
    } catch (err: any) {
      const msg = err?.data?.message || 'Subscription failed.';
      setFeedback(msg);
      toast.error(msg);
      console.error('subscribe failed', err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribePackage().unwrap();
      const msg = 'Subscription cancelled.';
      setFeedback(msg);
      toast.success(msg);
    } catch (err: any) {
      const msg = err?.data?.message || 'Unsubscribe failed.';
      setFeedback(msg);
      toast.error(msg);
      console.error('unsubscribe failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Nav */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  SF
                </span>
              </div>
              <span className="font-semibold text-foreground">
                SaaS File Manager
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Cloud File Management
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
            Manage Your Files
            <br />
            <span className="text-primary">Simply & Securely</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Organize, store, and access your files from anywhere. Choose a plan
            that fits your needs and start managing your files today.
          </p>
          <div className="flex items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Subscription Packages
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the plan that best fits your file management needs. All
              plans include secure cloud storage and easy access.
            </p>
            {feedback && (
              <p className="mt-4 text-sm text-primary">{feedback}</p>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <div className="text-center py-16">
              <p className="text-destructive">
                Failed to load packages. Please try again later.
              </p>
            </div>
          )}

          {packages && packages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No subscription packages available at the moment.
              </p>
            </div>
          )}

          {packages && packages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg, index) => (
                <Card
                  key={pkg.id}
                  className={
                    index === 1
                      ? 'border-primary shadow-lg relative'
                      : 'relative'
                  }
                >
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      {subscriptionStatus?.hasActivePackage &&
                        subscriptionStatus.package?.id === pkg.id && (
                          <Badge variant="secondary" className="text-xs">
                            Your plan
                          </Badge>
                        )}
                    </div>
                    <CardDescription>
                      Everything you need to manage your files effectively
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                          <FolderTree className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {pkg.maxFolders} Folders
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Up to {pkg.maxNestingLevel} nesting levels
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                          <HardDrive className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {pkg.maxFileSize} MB max file size
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pkg.totalFileLimit} total files
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                          <Layers className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {pkg.filesPerFolder} files per folder
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Supported types</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pkg.allowedFileTypes.map((type) => (
                              <Badge
                                key={type}
                                variant="secondary"
                                className="text-xs"
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        Secure cloud storage
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        Access from anywhere
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        Folder organization
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isAuthenticated ? (
                      // determine subscription state
                      (() => {
                        const isCurrent =
                          subscriptionStatus?.hasActivePackage &&
                          subscriptionStatus.package?.id === pkg.id;
                        const hasAnother =
                          subscriptionStatus?.hasActivePackage && !isCurrent;
                        if (statusLoading) {
                          return (
                            <Button className="w-full" disabled>
                              Loading...
                            </Button>
                          );
                        }

                        if (isCurrent) {
                          return (
                            <Button
                              className="w-full"
                              variant="destructive"
                              onClick={handleUnsubscribe}
                              disabled={unsubscribing}
                            >
                              {unsubscribing ? 'Cancelling...' : 'Cancel'}
                            </Button>
                          );
                        }

                        if (hasAnother) {
                          return (
                            <Button
                              className="w-full"
                              variant="outline"
                              disabled
                              title="Unsubscribe from current plan first"
                            >
                              Subscribe
                            </Button>
                          );
                        }

                        return (
                          <Button
                            className="w-full"
                            variant={index === 1 ? 'default' : 'outline'}
                            onClick={() => handleSubscribe(pkg.id)}
                            disabled={subscribing}
                          >
                            {subscribing ? 'Subscribing...' : 'Subscribe'}
                          </Button>
                        );
                      })()
                    ) : (
                      <Link to="/register" className="w-full">
                        <Button
                          className="w-full"
                          variant={index === 1 ? 'default' : 'outline'}
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SaaS File Manager. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
