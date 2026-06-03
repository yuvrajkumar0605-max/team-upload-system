import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { TeamRegistration, UserProfile, CaptainInfo, TeamMember, Announcement, Result, SocialMediaLinks, ReportMetadata, RegistrationSummary, DuplicateEntry, IdPassGroupLink, LogoUpload } from '../backend';
import { ExternalBlob } from '../backend';

// Production-optimized cache times
const CACHE_TIMES = {
  SHORT: 10000,      // 10 seconds
  MEDIUM: 30000,     // 30 seconds
  LONG: 120000,      // 2 minutes
  VERY_LONG: 300000, // 5 minutes
};

// Safe error handler
function safeQueryFn<T>(fn: () => Promise<T>, fallback: T) {
  return async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      return fallback;
    }
  };
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor || !identity) return null;
        return actor.getCallerUserProfile();
      },
      null
    ),
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor || !identity) return false;
        return actor.isCallerAdmin();
      },
      false
    ),
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isFetched: !!actor && query.isFetched,
  };
}

export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeAccessControl();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

export function useGetRegistrationStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['registrationStatus'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return true;
        return actor.getRegistrationStatus();
      },
      true
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchInterval: 60000, // Refetch every 60 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCloseRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.closeRegistration(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationStatus'] });
    },
  });
}

export function useGetMaxTeamRegistrations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['maxTeamRegistrations'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return null;
        return actor.getMaxTeamRegistrations();
      },
      null
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useSetMaxTeamRegistrations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (limit: bigint | null) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setMaxTeamRegistrations(limit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maxTeamRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['registrationSummary'] });
    },
  });
}

export function useGetRegistrationSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RegistrationSummary>({
    queryKey: ['registrationSummary'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) {
          return { totalTeams: BigInt(0), confirmedTeams: BigInt(0), maxTeams: undefined };
        }
        return actor.getRegistrationSummary();
      },
      { totalTeams: BigInt(0), confirmedTeams: BigInt(0), maxTeams: undefined }
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamName,
      logo,
      captain,
      members,
    }: {
      teamName: string;
      logo: ExternalBlob;
      captain: CaptainInfo;
      members: TeamMember[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      if (!teamName?.trim()) throw new Error('Team name is required');
      if (!captain?.name?.trim()) throw new Error('Captain name is required');
      if (!captain?.phone?.trim()) throw new Error('Captain phone is required');
      if (!members || members.length === 0) throw new Error('At least one team member is required');
      
      return actor.submitRegistration(teamName, logo, captain, members);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['teamDetailsViewer'] });
      queryClient.invalidateQueries({ queryKey: ['registrationSummary'] });
      queryClient.invalidateQueries({ queryKey: ['duplicateRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithGroupInfo'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithIdPassStatus'] });
    },
    retry: 1,
    retryDelay: 1000,
  });
}

export function useGetAllRegistrations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TeamRegistration[]>({
    queryKey: ['registrations'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllRegistrations();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useSearchTeamsByName() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchTeamsByName(searchTerm);
    },
  });
}

export function useGetPublicRegistrations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<{ teamName: string; logo: ExternalBlob }>>({
    queryKey: ['publicRegistrations'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        const teams = await actor.getAllTeamsWithGroupInfo();
        return teams.map(team => ({ teamName: team.teamName, logo: team.logo }));
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetTeamDetailsViewer() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TeamRegistration[]>({
    queryKey: ['teamDetailsViewer'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getTeamDetailsViewer();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useDeleteRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRegistration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['publicRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['teamDetailsViewer'] });
      queryClient.invalidateQueries({ queryKey: ['registrationSummary'] });
      queryClient.invalidateQueries({ queryKey: ['duplicateRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithGroupInfo'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithIdPassStatus'] });
    },
  });
}

export function useGetAllTeamsWithGroupInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TeamRegistration[]>({
    queryKey: ['allTeamsWithGroupInfo'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllTeamsWithGroupInfo();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useSearchTeamsByNameOrPhone() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchTeamsByNameOrPhone(searchTerm);
    },
  });
}

export function useGetTeamById() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (teamId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTeamById(teamId);
    },
  });
}

export function useAddGroupLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupNumber, link }: { groupNumber: bigint; link: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGroupLink(groupNumber, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGroupLinks'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithGroupInfo'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithIdPassStatus'] });
    },
  });
}

export function useGetAllGroupLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, string]>>({
    queryKey: ['allGroupLinks'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllGroupLinks();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetAllTeamsWithIdPassStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TeamRegistration[]>({
    queryKey: ['allTeamsWithIdPassStatus'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllTeamsWithIdPassStatus();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateIdPassStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, status }: { teamId: bigint; status: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateIdPassStatus(teamId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithIdPassStatus'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithGroupInfo'] });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['teamDetailsViewer'] });
    },
  });
}

export function useBulkUpdateIdPassStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUpdateIdPassStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithIdPassStatus'] });
      queryClient.invalidateQueries({ queryKey: ['allTeamsWithGroupInfo'] });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['teamDetailsViewer'] });
    },
  });
}

export function useGetDuplicateRegistrations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DuplicateEntry[]>({
    queryKey: ['duplicateRegistrations'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getDuplicateRegistrations();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useDeleteDuplicateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDuplicateEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duplicateRegistrations'] });
    },
  });
}

export function useGetAllAnnouncements() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllAnnouncements();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetAnnouncementsCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['announcementsCount'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return BigInt(0);
        return actor.getAnnouncementsCount();
      },
      BigInt(0)
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      image,
      link,
    }: {
      title: string;
      description: string;
      image: ExternalBlob;
      link: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAnnouncement(title, description, image, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcementsCount'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      image,
      link,
    }: {
      id: string;
      title: string;
      description: string;
      image: ExternalBlob;
      link: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAnnouncement(id, title, description, image, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcementsCount'] });
    },
  });
}

export function useGetAllResults() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Result[]>({
    queryKey: ['results'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllResults();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetResultsCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['resultsCount'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return BigInt(0);
        return actor.getResultsCount();
      },
      BigInt(0)
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      image,
      description,
      link,
    }: {
      title: string;
      image: ExternalBlob;
      description: string;
      link: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createResult(title, image, description, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['resultsCount'] });
    },
  });
}

export function useUpdateResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      image,
      description,
      link,
    }: {
      id: string;
      title: string;
      image: ExternalBlob;
      description: string;
      link: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateResult(id, title, image, description, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
}

export function useDeleteResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteResult(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['resultsCount'] });
    },
  });
}

export function useGetSocialMediaLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SocialMediaLinks>({
    queryKey: ['socialMediaLinks'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return { instagram: undefined, discord: undefined, youtube: undefined, whatsapp: undefined };
        return actor.getSocialMediaLinks();
      },
      { instagram: undefined, discord: undefined, youtube: undefined, whatsapp: undefined }
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateSocialMediaLinks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (links: SocialMediaLinks) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSocialMediaLinks(links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMediaLinks'] });
    },
  });
}

export function useGetAllReports() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReportMetadata[]>({
    queryKey: ['reports'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllReports();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useStoreReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      filename,
      blob,
      size,
    }: {
      filename: string;
      blob: ExternalBlob;
      size: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.storeReport(filename, blob, size);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filename: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReport(filename);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: async (report: ReportMetadata) => {
      const bytes = await report.blob.getBytes();
      const blob = new Blob([bytes], { type: 'text/csv;charset=utf-8;' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = report.filename;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

export function useSearchGroupLinkByTeam() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ teamName, phoneNumber }: { teamName: string; phoneNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.searchGroupLinkByTeam(teamName, phoneNumber);
      if (!result) {
        throw new Error('Team not found or not registered');
      }
      return result;
    },
  });
}

export function useGetAllGroupLinksWithInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IdPassGroupLink[]>({
    queryKey: ['allGroupLinksWithInfo'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllGroupLinksWithInfo();
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateGroupLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, groupNumber, groupLink }: { groupId: bigint; groupNumber: bigint; groupLink: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGroupLink(groupId, groupNumber, groupLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGroupLinksWithInfo'] });
    },
  });
}

export function useDeleteGroupLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGroupLink(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGroupLinksWithInfo'] });
    },
  });
}

export function useUploadTeamLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamName,
      logo,
      fileSize,
    }: {
      teamName: string;
      logo: ExternalBlob;
      fileSize: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadTeamLogo(teamName, logo, fileSize);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamLogos'] });
      queryClient.invalidateQueries({ queryKey: ['registrationSummary'] });
    },
  });
}

export function useCheckTeamLogoExists() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (teamName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkTeamLogoExists(teamName);
    },
  });
}

export function useGetAllTeamLogos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LogoUpload[]>({
    queryKey: ['teamLogos'],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) return [];
        return actor.getAllTeamLogosPaginated(BigInt(1), BigInt(100));
      },
      []
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useDeleteTeamLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamName: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Delete functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamLogos'] });
      queryClient.invalidateQueries({ queryKey: ['registrationSummary'] });
    },
  });
}
