import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupModal from '../components/ProfileSetupModal';
import RegistrationForm from '../components/RegistrationForm';
import HeroSection from '../components/HeroSection';
import AnnouncementsSection from '../components/AnnouncementsSection';
import SocialMediaLinks from '../components/SocialMediaLinks';

export default function HomePage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  
  // Only show profile setup for authenticated users who don't have a profile yet
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Don't block page rendering for anonymous users
  if (isInitializing && isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <AnnouncementsSection />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <SocialMediaLinks />
        </div>
      </div>
      <RegistrationForm />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
