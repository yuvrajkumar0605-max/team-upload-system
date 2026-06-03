import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import AdminDashboard from '../components/AdminDashboard';
import ProfileSetupModal from '../components/ProfileSetupModal';

export default function AdminPortalPage() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched: isAdminFetched } = useIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  useEffect(() => {
    // Wait for all checks to complete
    if (isInitializing || isAdminLoading || profileLoading) {
      return;
    }

    // If not authenticated, redirect to home with message
    if (!isAuthenticated) {
      toast.error('Please login to access the admin portal');
      navigate({ to: '/' });
      return;
    }

    // If profile not set up yet, wait for modal
    if (showProfileSetup) {
      return;
    }

    // If authenticated but not admin, show access denied and redirect
    if (isAdminFetched && !isAdmin) {
      toast.error('Access Denied: Admins Only');
      navigate({ to: '/' });
      return;
    }
  }, [isAuthenticated, isAdmin, isAdminFetched, isInitializing, isAdminLoading, profileLoading, showProfileSetup, navigate]);

  // Show loading state
  if (isInitializing || isAdminLoading || profileLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show profile setup if needed
  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  // Show dashboard only if admin
  if (isAuthenticated && isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    );
  }

  // Fallback (should not reach here due to useEffect redirects)
  return null;
}
