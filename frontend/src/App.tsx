import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';

// Lazy load components for better code splitting
const Header = lazy(() => import('./components/Header'));
const AdminHeader = lazy(() => import('./components/AdminHeader'));
const Footer = lazy(() => import('./components/Footer'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AdminPortalPage = lazy(() => import('./pages/AdminPortalPage'));
const RegisteredTeamsPage = lazy(() => import('./pages/RegisteredTeamsPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const IDPassPage = lazy(() => import('./pages/IDPassPage'));
const IDPassGroupFinderPage = lazy(() => import('./pages/IDPassGroupFinderPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const TeamLogoUploadPage = lazy(() => import('./pages/TeamLogoUploadPage'));

// Production-optimized QueryClient with aggressive memory management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds - reduce refetch frequency
      gcTime: 180000, // 3 minutes - aggressive garbage collection
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});

// Aggressive memory management for production
if (typeof window !== 'undefined') {
  // Clear stale queries every 3 minutes
  setInterval(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const now = Date.now();
    
    queries.forEach((query) => {
      const state = query.state;
      // Remove queries older than 5 minutes
      if (state.dataUpdatedAt && now - state.dataUpdatedAt > 300000) {
        cache.remove(query);
      }
    });
  }, 180000);

  // Full cache clear every 15 minutes to prevent memory buildup
  setInterval(() => {
    queryClient.clear();
  }, 900000);

  // Clear cache on page visibility change (when user switches tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Clear old queries when tab becomes hidden
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      const now = Date.now();
      
      queries.forEach((query) => {
        const state = query.state;
        if (state.dataUpdatedAt && now - state.dataUpdatedAt > 120000) {
          cache.remove(query);
        }
      });
    }
  });
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Root route with conditional layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Suspense fallback={<LoadingFallback />}>
        <ConditionalLayout />
      </Suspense>
    </ThemeProvider>
  );
}

function ConditionalLayout() {
  const location = useLocation();
  const isAdminPortal = location.pathname.startsWith('/admin');
  const prefetchedRef = useRef(false);

  // Minimal prefetching - only critical data
  useEffect(() => {
    if (!prefetchedRef.current && !isAdminPortal) {
      prefetchedRef.current = true;
      
      // Prefetch only registration status (lightweight)
      setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: ['registrationStatus'],
          staleTime: 30000,
        });
      }, 500);
    }
  }, [isAdminPortal]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card" />}>
        {isAdminPortal ? <AdminHeader /> : <Header />}
      </Suspense>
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-16 bg-card" />}>
        <Footer />
      </Suspense>
      <Toaster />
    </div>
  );
}

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams',
  component: RegisteredTeamsPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

const idPassRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/id-pass',
  component: IDPassPage,
});

const idPassGroupFinderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/id-pass-group-finder',
  component: IDPassGroupFinderPage,
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedule',
  component: SchedulePage,
});

const teamLogoUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team-logo-upload',
  component: TeamLogoUploadPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPortalPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  teamsRoute,
  resultsRoute,
  idPassRoute,
  idPassGroupFinderRoute,
  scheduleRoute,
  teamLogoUploadRoute,
  adminRoute,
]);

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadDelay: 100,
});

// Type declaration
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
