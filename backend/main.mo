import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Access control and approval state
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  // ---- USER APPROVAL ----
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // ---- TYPES ----
  public type TeamMember = {
    name : Text;
    playerId : ?Text;
  };

  module TeamMember {
    public func compare(a : TeamMember, b : TeamMember) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  public type CaptainInfo = {
    name : Text;
    phone : Text;
  };

  public type TeamRegistration = {
    id : Text;
    teamName : Text;
    logo : Storage.ExternalBlob;
    captain : CaptainInfo;
    members : [TeamMember];
    creator : ?Principal;
    teamId : Nat;
    groupNumber : Nat;
    groupLink : ?Text;
    idPassAssigned : Bool;
  };

  module TeamRegistration {
    public func compare(a : TeamRegistration, b : TeamRegistration) : Order.Order {
      Text.compare(a.teamName, b.teamName);
    };
  };

  public type LogoUpload = {
    teamName : Text;
    logo : Storage.ExternalBlob;
    uploadTime : Time.Time;
    fileSize : Nat;
  };

  module LogoUpload {
    public func compare(a : LogoUpload, b : LogoUpload) : Order.Order {
      Int.compare(b.uploadTime, a.uploadTime);
    };
  };

  public type IdPassGroupLink = {
    id : Text;
    groupId : Nat;
    groupNumber : Nat;
    groupLink : Text;
    createdAt : Time.Time;
    creator : Principal;
  };

  module IdPassGroupLink {
    public func compare(a : IdPassGroupLink, b : IdPassGroupLink) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  public type Announcement = {
    id : Text;
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
    link : ?Text;
    createdAt : Time.Time;
  };

  module Announcement {
    public func compare(a : Announcement, b : Announcement) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  public type Result = {
    id : Text;
    title : Text;
    image : Storage.ExternalBlob;
    description : Text;
    link : ?Text;
    createdAt : Time.Time;
  };

  module Result {
    public func compare(a : Result, b : Result) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  public type SocialMediaLinks = {
    instagram : ?Text;
    discord : ?Text;
    youtube : ?Text;
    whatsapp : ?Text;
  };

  public type PublicTeamView = {
    teamName : Text;
    logo : Storage.ExternalBlob;
  };

  public type RegistrationSummary = {
    totalTeams : Nat;
    maxTeams : ?Nat;
    confirmedTeams : Nat;
  };

  public type ReportMetadata = {
    filename : Text;
    size : Nat;
    created : Time.Time;
    blob : Storage.ExternalBlob;
  };

  public type DuplicateEntry = {
    originalId : Text;
    duplicateId : Text;
    reason : DuplicateReason;
    duplicatedAt : Time.Time;
  };

  public type DuplicateReason = {
    #teamName;
    #captainPhone;
  };

  module DuplicateEntry {
    public func compare(a : DuplicateEntry, b : DuplicateEntry) : Order.Order {
      Int.compare(a.duplicatedAt, b.duplicatedAt);
    };
  };

  let registrations = Map.empty<Text, TeamRegistration>();
  let logoUploads = Map.empty<Text, LogoUpload>();
  let announcements = Map.empty<Text, Announcement>();
  let results = Map.empty<Text, Result>();
  let reports = Map.empty<Text, ReportMetadata>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let duplicates = Map.empty<Text, DuplicateEntry>();
  let groupLinks = Map.empty<Nat, Text>();
  let idPassGroupLinks = Map.empty<Nat, IdPassGroupLink>();

  var isRegistrationOpen : Bool = true;
  var maxTeamRegistrations : ?Nat = null;
  var confirmedTeamRegistrations : Nat = 0;
  var socialMediaLinks : SocialMediaLinks = {
    instagram = null;
    discord = null;
    youtube = null;
    whatsapp = null;
  };

  // ---- ACCESS CONTROL ----
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---- TEAM REGISTRATION (PUBLIC + ADMIN) ----
  public shared ({ caller }) func closeRegistration(status : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can change registration status");
    };
    isRegistrationOpen := status;
  };

  public query func getRegistrationStatus() : async Bool {
    isRegistrationOpen;
  };

  func getAuthenticatedCaller(_caller : Principal) : ?Principal {
    if (_caller.isAnonymous()) {
      null;
    } else { ?_caller };
  };

  public shared ({ caller }) func submitRegistration(
    teamName : Text,
    logo : Storage.ExternalBlob,
    captain : CaptainInfo,
    members : [TeamMember]
  ) : async Text {
    if (not isRegistrationOpen) {
      Runtime.trap("Registration is closed. Please try once it opens again.");
    };

    let currentSize = confirmedTeamRegistrations;
    switch (maxTeamRegistrations) {
      case (?limit) {
        if (currentSize >= limit) {
          Runtime.trap("Registrations are full");
        };
      };
      case (null) {};
    };

    if (teamName == "") {
      Runtime.trap("Team name cannot be empty");
    };

    if (members.size() == 0) {
      Runtime.trap("Team must have at least one member");
    };

    let normalizedTeamName = teamName.trim(#char ' ').toLower();

    let existingTeam = registrations.values().toArray().find(
      func(team) {
        team.teamName.toLower().trim(#char ' ') == normalizedTeamName;
      }
    );

    switch (existingTeam) {
      case (?_) {
        Runtime.trap("Team name already registered");
      };
      case (null) {};
    };

    let authenticCaller = getAuthenticatedCaller(caller);

    switch (authenticCaller) {
      case (?creator) {
        let principalReg = registrations.values().find(func(r) {
          switch (r.creator) {
            case (?c) { c == creator };
            case (null) { false };
          };
        });
        switch (principalReg) {
          case (?_) {
            Runtime.trap("You have already registered a team");
          };
          case (null) {};
        };
      };
      case (null) {
        // Anonymous user - no duplicate check by principal
      };
    };

    var nextTeamId = 1;
    var firstIteration = true;
    for ((_id, reg) in registrations.entries()) {
      firstIteration := false;
      nextTeamId := reg.teamId + 1;
    };

    if (firstIteration) {
      nextTeamId := 1;
    };

    let groupNumber = if (nextTeamId > 1) {
      ((nextTeamId - 1) % 18) + 1;
    } else { 1 };

    let groupLink = groupLinks.get(groupNumber);

    let registration : TeamRegistration = {
      id = nextTeamId.toText();
      teamName;
      logo;
      captain;
      members;
      creator = authenticCaller;
      teamId = nextTeamId;
      groupNumber;
      groupLink;
      idPassAssigned = false;
    };

    registrations.add(nextTeamId.toText(), registration);
    confirmedTeamRegistrations += 1;

    let entries = registrations.entries().toArray();
    for ((otherId, otherReg) in entries.values()) {
      if (otherId != nextTeamId.toText()) {
        if (otherReg.teamName == teamName and otherId != nextTeamId.toText()) {
          let duplicateEntry : DuplicateEntry = {
            originalId = otherId;
            duplicateId = nextTeamId.toText();
            reason = #teamName;
            duplicatedAt = Time.now();
          };
          duplicates.add(generateDuplicateId(nextTeamId.toText(), "team-name"), duplicateEntry);
        };

        if (otherReg.captain.phone == captain.phone and otherId != nextTeamId.toText()) {
          let duplicateEntry : DuplicateEntry = {
            originalId = otherId;
            duplicateId = nextTeamId.toText();
            reason = #captainPhone;
            duplicatedAt = Time.now();
          };
          duplicates.add(generateDuplicateId(nextTeamId.toText(), "phone"), duplicateEntry);
        };
      };
    };
    nextTeamId.toText();
  };

  public shared ({ caller }) func addGroupLink(groupNumber : Nat, link : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add group links");
    };
    if (groupNumber < 1 or groupNumber > 18) {
      Runtime.trap("Group number must be between 1 and 18");
    };
    groupLinks.add(groupNumber, link);
  };

  public query func getGroupLink(groupNumber : Nat) : async ?Text {
    groupLinks.get(groupNumber);
  };

  public query ({ caller }) func getAllGroupLinks() : async [(Nat, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all group links");
    };
    groupLinks.entries().toArray();
  };

  public query ({ caller }) func getDuplicateRegistrations() : async [DuplicateEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view duplicate registrations");
    };
    duplicates.values().toArray();
  };

  public shared ({ caller }) func deleteDuplicateEntry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete duplicate records");
    };

    switch (duplicates.get(id)) {
      case (null) { Runtime.trap("Duplicate record not found") };
      case (?_) {
        duplicates.remove(id);
      };
    };
  };

  func clearDuplicatesForTeam(teamId : Text) {
    let entries = duplicates.entries().toArray();
    for ((id, entry) in entries.values()) {
      if (entry.originalId == teamId or entry.duplicateId == teamId) {
        duplicates.remove(id);
      };
    };
  };

  public shared ({ caller }) func deleteRegistration(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete registrations");
    };

    switch (registrations.get(id)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?_) {
        registrations.remove(id);
        confirmedTeamRegistrations := if (confirmedTeamRegistrations > 0) {
          confirmedTeamRegistrations - 1;
        } else { 0 };

        clearDuplicatesForTeam(id);
      };
    };
  };

  public shared ({ caller }) func setMaxTeamRegistrations(limit : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set team registration limits");
    };
    maxTeamRegistrations := limit;
  };

  public query func getMaxTeamRegistrations() : async ?Nat {
    maxTeamRegistrations;
  };

  public query func getRegistrationSummary() : async RegistrationSummary {
    let totalTeams = registrations.size();
    {
      totalTeams;
      maxTeams = maxTeamRegistrations;
      confirmedTeams = confirmedTeamRegistrations;
    };
  };

  public query func getAllTeamsWithGroupInfo() : async [TeamRegistration] {
    registrations.values().toArray();
  };

  public query func getTeamById(teamId : Nat) : async TeamRegistration {
    switch (registrations.get(teamId.toText())) {
      case (?team) { team };
      case (null) {
        Runtime.trap("Team not found with this ID. Please try different search criteria.");
      };
    };
  };

  public query func searchTeamsByNameOrPhone(searchTerm : Text) : async [TeamRegistration] {
    let loweredSearchTerm = searchTerm.toLower();

    let filtered = registrations.values().toArray().filter(
      func(team) {
        team.teamName.toLower().contains(#text(loweredSearchTerm)) or team.captain.phone.contains(#text(loweredSearchTerm));
      }
    );

    if (filtered.size() == 0) {
      Runtime.trap("No teams match your search. Please refine your keywords and try again.");
    };

    filtered;
  };

  public query ({ caller }) func getAllRegistrations() : async [TeamRegistration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray().sort();
  };

  public query ({ caller }) func getTeamRegistration(id : Text) : async TeamRegistration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view registration details");
    };

    switch (registrations.get(id)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?registration) { registration };
    };
  };

  public shared ({ caller }) func updateLogo(id : Text, newLogo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update logos");
    };

    switch (registrations.get(id)) {
      case (null) { Runtime.trap("Registration not found") };
      case (?registration) {
        let updated = { registration with logo = newLogo };
        registrations.add(id, updated);
      };
    };
  };

  func generateDuplicateId(regId : Text, reason : Text) : Text {
    regId.concat("_").concat(reason).concat("_").concat(Time.now().toText());
  };

  public shared ({ caller }) func createAnnouncement(
    title : Text,
    description : Text,
    image : Storage.ExternalBlob,
    link : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };

    if (title == "") { Runtime.trap("Title cannot be empty") };
    if (description == "") { Runtime.trap("Description cannot be empty") };

    let id = generateAnnouncementId(title);

    if (announcements.containsKey(id)) {
      Runtime.trap("Announcement with this title already exists");
    };

    let announcement : Announcement = {
      id;
      title;
      description;
      image;
      link;
      createdAt = Time.now();
    };

    announcements.add(id, announcement);
    id;
  };

  public shared ({ caller }) func updateAnnouncement(
    id : Text,
    title : Text,
    description : Text,
    image : Storage.ExternalBlob,
    link : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update announcements");
    };

    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?existing) {
        let updated = {
          id;
          title;
          description;
          image;
          link;
          createdAt = existing.createdAt;
        };
        announcements.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };

    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?_) {
        announcements.remove(id);
      };
    };
  };

  public query func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray().sort(Announcement.compare);
  };

  public query func getAnnouncement(id : Text) : async Announcement {
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?announcement) { announcement };
    };
  };

  public query func getAnnouncementsCount() : async Nat {
    announcements.size();
  };

  func generateAnnouncementId(title : Text) : Text {
    title.concat("_").concat(Time.now().toText());
  };

  public query func getSocialMediaLinks() : async SocialMediaLinks {
    socialMediaLinks;
  };

  public shared ({ caller }) func updateSocialMediaLinks(newLinks : SocialMediaLinks) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update social media links");
    };
    socialMediaLinks := newLinks;
  };

  public shared ({ caller }) func createResult(
    title : Text,
    image : Storage.ExternalBlob,
    description : Text,
    link : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create results");
    };

    if (title == "") { Runtime.trap("Title cannot be empty") };
    if (description == "") { Runtime.trap("Description cannot be empty") };

    let id = generateResultId(title);

    if (results.containsKey(id)) {
      Runtime.trap("Result with this title already exists");
    };

    let result : Result = {
      id;
      title;
      image;
      description;
      link;
      createdAt = Time.now();
    };

    results.add(id, result);
    id;
  };

  public shared ({ caller }) func updateResult(
    id : Text,
    title : Text,
    image : Storage.ExternalBlob,
    description : Text,
    link : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update results");
    };

    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?existing) {
        let updated = {
          id;
          title;
          image;
          description;
          link;
          createdAt = existing.createdAt;
        };
        results.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteResult(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete results");
    };

    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?_) {
        results.remove(id);
      };
    };
  };

  public query func getAllResults() : async [Result] {
    results.values().toArray().sort(Result.compare);
  };

  public query func getResult(id : Text) : async Result {
    switch (results.get(id)) {
      case (null) { Runtime.trap("Result not found") };
      case (?result) { result };
    };
  };

  public query func getResultsCount() : async Nat {
    results.size();
  };

  func generateResultId(title : Text) : Text {
    title.concat("_").concat(Time.now().toText());
  };

  public query ({ caller }) func getTeamDetailsViewer() : async [TeamRegistration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access team details viewer");
    };

    registrations.values().toArray();
  };

  // Query all team logos (teamName and logo) for public use with pagination and type safety
  public query ({ caller }) func getAllTeamLogosPaginated(pageNumber : Nat, pageSize : Nat) : async [LogoUpload] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all logos");
    };

    let sortedLogos = logoUploads.values().toArray().sort();

    let totalLogos = sortedLogos.size();
    if (totalLogos == 0) { return [] };

    let startIndex = if (pageNumber > 0) { Int.abs((pageNumber - 1) * pageSize) } else { 0 };
    let endIndex = startIndex + pageSize;
    if (startIndex >= totalLogos) { return [] };

    let actualEndIndex = if (endIndex > totalLogos) { totalLogos } else {
      endIndex;
    };

    Array.tabulate<LogoUpload>(actualEndIndex - startIndex, func(i) { sortedLogos[startIndex + i] });
  };

  public shared ({ caller }) func storeReport(filename : Text, blob : Storage.ExternalBlob, size : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can store reports");
    };

    let metadata : ReportMetadata = {
      filename;
      size;
      created = Time.now();
      blob;
    };

    reports.add(filename, metadata);
  };

  public query ({ caller }) func getReport(filename : Text) : async ReportMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access reports");
    };
    switch (reports.get(filename)) {
      case (null) { Runtime.trap("Report not found") };
      case (?metadata) { metadata };
    };
  };

  public shared ({ caller }) func deleteReport(filename : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete reports");
    };
    switch (reports.get(filename)) {
      case (null) { Runtime.trap("Report not found") };
      case (?_) {
        reports.remove(filename);
      };
    };
  };

  public query ({ caller }) func getAllReports() : async [ReportMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all reports");
    };
    reports.values().toArray();
  };

  // ----- ID PASS MANAGEMENT -----

  public shared ({ caller }) func updateIdPassStatus(teamId : Nat, status : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ID Pass status");
    };

    let teamKey = teamId.toText();
    switch (registrations.get(teamKey)) {
      case (null) { Runtime.trap("Team not found") };
      case (?team) {
        let updated = { team with idPassAssigned = status };
        registrations.add(teamKey, updated);
      };
    };
  };

  public shared ({ caller }) func bulkUpdateIdPassStatus(status : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform bulk ID Pass updates");
    };

    let entries = registrations.entries().toArray();
    for ((id, _team) in entries.values()) {
      let team = switch (registrations.get(id)) {
        case (null) { Runtime.trap("Team not found") };
        case (?team) { team };
      };
      let updated = { team with idPassAssigned = status };
      registrations.add(id, updated);
    };
  };

  public query func getIdPassStatus(teamId : Nat) : async Bool {
    switch (registrations.get(teamId.toText())) {
      case (null) { Runtime.trap("Team not found") };
      case (?team) { team.idPassAssigned };
    };
  };

  public query func getAllTeamsWithIdPassStatus() : async [TeamRegistration] {
    registrations.values().toArray();
  };

  public query func getTeamsByIdPassStatus(status : Bool) : async [TeamRegistration] {
    let teamsWithStatus = registrations.values().toArray().filter(
      func(team) {
        team.idPassAssigned == status
      }
    );
    teamsWithStatus;
  };

  public query func searchTeamsByIdPassStatus(searchTerm : Text) : async [TeamRegistration] {
    let loweredSearchTerm = searchTerm.toLower();

    let teamsMatchingSearch = registrations.values().toArray().filter(
      func(team) {
        team.teamName.toLower().contains(#text(loweredSearchTerm)) or team.captain.phone.contains(#text(loweredSearchTerm));
      }
    );

    if (teamsMatchingSearch.size() == 0) {
      Runtime.trap("No teams match your search. Please refine your keywords and try again.");
    };

    teamsMatchingSearch;
  };

  // Admin-only: Advanced case-insensitive search for teams by name
  public query ({ caller }) func searchTeamsByName(searchTerm : Text) : async [TeamRegistration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search for teams");
    };

    if (searchTerm.size() == 0) {
      // Return all teams if search term is empty
      return registrations.values().toArray();
    };

    let loweredSearchTerm = searchTerm.toLower();

    let teamsMatchingSearch = registrations.values().toArray().filter(
      func(team) {
        team.teamName.toLower().contains(#text(loweredSearchTerm));
      }
    );

    teamsMatchingSearch;
  };

  // ----- GROUP LINK MANAGEMENT (ADMIN ONLY) -----
  public shared ({ caller }) func createGroupLink(groupId : Nat, groupNumber : Nat, groupLink : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create group links");
    };

    if (groupId == 0) {
      Runtime.trap("Invalid group ID. Group must be between 1 and 18.");
    };

    if (groupNumber == 0 or groupNumber > 18) {
      Runtime.trap("Invalid group number. Group must be between 1 and 18.");
    };

    let creator = caller;
    let id = groupId;
    let link : IdPassGroupLink = {
      id = id.toText();
      groupId;
      groupNumber;
      groupLink;
      createdAt = Time.now();
      creator;
    };

    idPassGroupLinks.add(id, link);
  };

  public shared ({ caller }) func updateGroupLink(groupId : Nat, newLink : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update group links");
    };

    switch (idPassGroupLinks.get(groupId)) {
      case (null) {
        Runtime.trap("Group ID not found: Please verify your group exists and try again.");
      };
      case (?groupLink) {
        let updatedLink = { groupLink with groupLink = newLink };
        idPassGroupLinks.add(groupId, updatedLink);
      };
    };
  };

  public shared ({ caller }) func deleteGroupLink(groupId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete group links");
    };

    switch (idPassGroupLinks.get(groupId)) {
      case (null) {
        Runtime.trap("Group ID not found: Please verify your group exists and try again.");
      };
      case (?_) {
        idPassGroupLinks.remove(groupId);
      };
    };
  };

  // ----- PUBLIC GROUP LINK QUERIES (FOR ID PASS GROUP FINDER) -----
  // Public query: Search for a specific team's group link by team name and phone
  public query func searchGroupLinkByTeam(teamName : Text, phoneNumber : Text) : async ?IdPassGroupLink {
    // Find the team registration matching both team name and phone number
    let normalizedTeamName = teamName.trim(#char ' ').toLower();
    let normalizedPhone = phoneNumber.trim(#char ' ');

    let matchingTeam = registrations.values().toArray().find(
      func(team) {
        let teamNameMatch = team.teamName.toLower().trim(#char ' ') == normalizedTeamName;
        let phoneMatch = team.captain.phone.trim(#char ' ') == normalizedPhone;
        teamNameMatch and phoneMatch;
      }
    );

    switch (matchingTeam) {
      case (null) { null }; // Team not found or credentials don't match
      case (?team) {
        // Return the group link for this team's group number
        idPassGroupLinks.get(team.groupNumber);
      };
    };
  };

  // Public query: Get group link by specific group ID (for direct lookup)
  public query func getGroupLinkById(groupId : Nat) : async IdPassGroupLink {
    switch (idPassGroupLinks.get(groupId)) {
      case (?groupLink) { groupLink };
      case (null) {
        Runtime.trap("Group ID not found: Please verify your group exists and try again.");
      };
    };
  };

  // Admin-only: Get all group links with full information
  public query ({ caller }) func getAllGroupLinksWithInfo() : async [IdPassGroupLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all group links");
    };
    idPassGroupLinks.values().toArray();
  };

  // Admin-only: Search group links (for admin management)
  public query ({ caller }) func searchGroupLinks(searchTerm : Text) : async [IdPassGroupLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search group links");
    };

    let loweredSearchTerm = searchTerm.toLower();

    let groupLinksMatchingSearch = idPassGroupLinks.values().toArray().filter(
      func(link) {
        link.groupNumber.toText().contains(#text(loweredSearchTerm)) or link.groupLink.toLower().contains(#text(loweredSearchTerm));
      }
    );

    if (groupLinksMatchingSearch.size() == 0) {
      Runtime.trap("No groups match your search. Please refine your keywords and try again.");
    };

    groupLinksMatchingSearch;
  };

  // Public function to upload team logo with duplicate name check
  public shared ({ caller = _ }) func uploadTeamLogo(teamName : Text, logo : Storage.ExternalBlob, fileSize : Nat) : async () {
    let normalizedTeamName = teamName.trim(#char ' ').toLower();

    // Check for existing logo with the same normalized team name
    let existingLogo = logoUploads.values().toArray().find(
      func(logo) {
        logo.teamName.toLower().trim(#char ' ') == normalizedTeamName;
      }
    );

    switch (existingLogo) {
      case (?_) {
        Runtime.trap("A logo for this team already exists. Please use a different team name or update your existing logo.");
      };
      case (null) {};
    };

    let newUpload : LogoUpload = {
      teamName;
      logo;
      uploadTime = Time.now();
      fileSize;
    };

    logoUploads.add(normalizedTeamName, newUpload);
  };

  // Query function to check if a team logo exists
  public query ({ caller = _ }) func checkTeamLogoExists(teamName : Text) : async Bool {
    let normalizedTeamName = teamName.trim(#char ' ').toLower();
    logoUploads.values().toArray().find(
      func(logo) {
        logo.teamName.toLower().trim(#char ' ') == normalizedTeamName;
      },
    ) != null;
  };

  // Separate query to get logos by original case-insensitive team name
  public query ({ caller = _ }) func getLogoByTeamName(teamName : Text) : async LogoUpload {
    switch (logoUploads.get(teamName)) {
      case (?logo) { logo };
      case (null) {
        let normalized = teamName.trim(#char ' ').toLower();
        let matchingLogo = logoUploads.values().toArray().find(
          func(logo) {
            logo.teamName.toLower().trim(#char ' ') == normalized
          }
        );
        switch (matchingLogo) {
          case (?logo) { logo };
          case (null) {
            Runtime.trap("Logo not found for this team name. Please check the spelling and try again.");
          };
        };
      };
    };
  };
};

