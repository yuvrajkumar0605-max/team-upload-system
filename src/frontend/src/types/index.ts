import type { ExternalBlob } from "@/backend";
import { type ApprovalStatus, DuplicateReason, type UserRole } from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export type { ExternalBlob, Principal, ApprovalStatus, UserRole };
export { DuplicateReason };

export interface TeamMember {
  name: string;
  playerId?: string;
}

export interface CaptainInfo {
  name: string;
  phone: string;
}

export interface TeamRegistration {
  id: string;
  teamName: string;
  logo: ExternalBlob;
  captain: CaptainInfo;
  members: TeamMember[];
  creator?: Principal;
  teamId: bigint;
  groupNumber: bigint;
  groupLink?: string;
  idPassAssigned: boolean;
}

export interface LogoUpload {
  teamName: string;
  logo: ExternalBlob;
  uploadTime: bigint;
  fileSize: bigint;
}

export interface IdPassGroupLink {
  id: string;
  groupId: bigint;
  groupNumber: bigint;
  groupLink: string;
  createdAt: bigint;
  creator: Principal;
}

export interface UserProfile {
  name: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  image: ExternalBlob;
  link?: string;
  createdAt: bigint;
}

export interface TournamentResult {
  id: string;
  title: string;
  image: ExternalBlob;
  description: string;
  link?: string;
  createdAt: bigint;
}

export interface Banner {
  id: string;
  image: ExternalBlob;
  createdAt: bigint;
}

export interface SocialMediaLinks {
  instagram?: string;
  discord?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface RegistrationSummary {
  totalTeams: bigint;
  maxTeams?: bigint;
  confirmedTeams: bigint;
}

export interface ReportMetadata {
  filename: string;
  size: bigint;
  created: bigint;
  blob: ExternalBlob;
}

export interface DuplicateEntry {
  originalId: string;
  duplicateId: string;
  reason: DuplicateReason;
  duplicatedAt: bigint;
}
