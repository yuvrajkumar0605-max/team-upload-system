import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface LogoUpload {
    teamName: string;
    logo: ExternalBlob;
    fileSize: bigint;
    uploadTime: Time;
}
export interface SocialMediaLinks {
    instagram?: string;
    whatsapp?: string;
    discord?: string;
    youtube?: string;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface ReportMetadata {
    created: Time;
    blob: ExternalBlob;
    size: bigint;
    filename: string;
}
export interface TeamRegistration {
    id: string;
    creator?: Principal;
    teamName: string;
    members: Array<TeamMember>;
    groupNumber: bigint;
    logo: ExternalBlob;
    idPassAssigned: boolean;
    captain: CaptainInfo;
    teamId: bigint;
    groupLink?: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface DuplicateEntry {
    originalId: string;
    duplicatedAt: Time;
    duplicateId: string;
    reason: DuplicateReason;
}
export interface Result {
    id: string;
    title: string;
    link?: string;
    createdAt: Time;
    description: string;
    image: ExternalBlob;
}
export interface CaptainInfo {
    name: string;
    phone: string;
}
export interface Banner {
    id: string;
    createdAt: bigint;
    image: ExternalBlob;
}
export interface RegistrationSummary {
    totalTeams: bigint;
    confirmedTeams: bigint;
    maxTeams?: bigint;
}
export interface TeamMember {
    playerId?: string;
    name: string;
}
export interface IdPassGroupLink {
    id: string;
    creator: Principal;
    groupNumber: bigint;
    createdAt: Time;
    groupId: bigint;
    groupLink: string;
}
export interface Announcement {
    id: string;
    title: string;
    link?: string;
    createdAt: Time;
    description: string;
    image: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum DuplicateReason {
    captainPhone = "captainPhone",
    teamName = "teamName"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGroupLink(groupNumber: bigint, link: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUpdateIdPassStatus(status: boolean): Promise<void>;
    checkTeamLogoExists(teamName: string): Promise<boolean>;
    closeRegistration(status: boolean): Promise<void>;
    createAnnouncement(title: string, description: string, image: ExternalBlob, link: string | null): Promise<string>;
    createGroupLink(groupId: bigint, groupNumber: bigint, groupLink: string): Promise<void>;
    createResult(title: string, image: ExternalBlob, description: string, link: string | null): Promise<string>;
    deleteAnnouncement(id: string): Promise<void>;
    deleteBanner(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteDuplicateEntry(id: string): Promise<void>;
    deleteGroupLink(groupId: bigint): Promise<void>;
    deleteRegistration(id: string): Promise<void>;
    deleteReport(filename: string): Promise<void>;
    deleteResult(id: string): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllGroupLinks(): Promise<Array<[bigint, string]>>;
    getAllGroupLinksWithInfo(): Promise<Array<IdPassGroupLink>>;
    getAllRegistrations(): Promise<Array<TeamRegistration>>;
    getAllReports(): Promise<Array<ReportMetadata>>;
    getAllResults(): Promise<Array<Result>>;
    getAllTeamLogosPaginated(pageNumber: bigint, pageSize: bigint): Promise<Array<LogoUpload>>;
    getAllTeamsWithGroupInfo(): Promise<Array<TeamRegistration>>;
    getAllTeamsWithIdPassStatus(): Promise<Array<TeamRegistration>>;
    getAnnouncement(id: string): Promise<Announcement>;
    getAnnouncementsCount(): Promise<bigint>;
    getBanner(): Promise<Banner | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDuplicateRegistrations(): Promise<Array<DuplicateEntry>>;
    getGroupLink(groupNumber: bigint): Promise<string | null>;
    getGroupLinkById(groupId: bigint): Promise<IdPassGroupLink>;
    getIdPassStatus(teamId: bigint): Promise<boolean>;
    getLogoByTeamName(teamName: string): Promise<LogoUpload>;
    getMaxTeamRegistrations(): Promise<bigint | null>;
    getRegistrationStatus(): Promise<boolean>;
    getRegistrationSummary(): Promise<RegistrationSummary>;
    getReport(filename: string): Promise<ReportMetadata>;
    getResult(id: string): Promise<Result>;
    getResultsCount(): Promise<bigint>;
    getSocialMediaLinks(): Promise<SocialMediaLinks>;
    getTeamById(teamId: bigint): Promise<TeamRegistration>;
    getTeamDetailsViewer(): Promise<Array<TeamRegistration>>;
    getTeamRegistration(id: string): Promise<TeamRegistration>;
    getTeamsByIdPassStatus(status: boolean): Promise<Array<TeamRegistration>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchGroupLinkByTeam(teamName: string, phoneNumber: string): Promise<IdPassGroupLink | null>;
    searchGroupLinks(searchTerm: string): Promise<Array<IdPassGroupLink>>;
    searchTeamsByIdPassStatus(searchTerm: string): Promise<Array<TeamRegistration>>;
    searchTeamsByName(searchTerm: string): Promise<Array<TeamRegistration>>;
    searchTeamsByNameOrPhone(searchTerm: string): Promise<Array<TeamRegistration>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setBanner(image: ExternalBlob): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setMaxTeamRegistrations(limit: bigint | null): Promise<void>;
    storeReport(filename: string, blob: ExternalBlob, size: bigint): Promise<void>;
    submitRegistration(teamName: string, logo: ExternalBlob, captain: CaptainInfo, members: Array<TeamMember>): Promise<string>;
    updateAnnouncement(id: string, title: string, description: string, image: ExternalBlob, link: string | null): Promise<void>;
    updateGroupLink(groupId: bigint, newLink: string): Promise<void>;
    updateIdPassStatus(teamId: bigint, status: boolean): Promise<void>;
    updateLogo(id: string, newLogo: ExternalBlob): Promise<void>;
    updateResult(id: string, title: string, image: ExternalBlob, description: string, link: string | null): Promise<void>;
    updateSocialMediaLinks(newLinks: SocialMediaLinks): Promise<void>;
    uploadTeamLogo(teamName: string, logo: ExternalBlob, fileSize: bigint): Promise<void>;
}
