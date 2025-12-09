export enum UserRole {
  // System Roles
  SystemAdmin = 'System.Admin',
  // Privileged Roles
  UserAccessAdmin = 'User.Admin',
  SupportAdmin = 'Support.Admin',
  OrganizationAdmin = 'Organization.Admin',
  ProviderAdmin = 'Provider.Admin',
  PathwayAdmin = 'Pathway.Admin',
  ReferralAdmin = 'Referral.Admin',
  // Non Privileged Roles
  UserReader = 'User.Read',
  UserWriter = 'User.ReadWrite',
  PatientReader = 'Patient.Read',
  PatientWriter = 'Patient.ReadWrite',
  PatientImport = 'Patient.Import',
  ProviderReader = 'Provider.Read',
  ProviderWriter = 'Provider.ReadWrite',
  OrganizationReader = 'Organization.Read',
  OrganizationWriter = 'Organization.ReadWrite',
  ReferralReader = 'Referral.Read',
  ReferralWriter = 'Referral.ReadWrite',
  PathwayReader = 'Pathway.Read',
  PathwayWriter = 'Pathway.ReadWrite',
  PathwayTemplateWriter = 'PathwayTemplate.ReadWrite',
  AssessmentAdmin = 'Assessment.Admin',
  AssessmentReader = 'Assessment.Read',
  AssessmentWriter = 'Assessment.ReadWrite',

  ///
  /// Consent
  ///
  ConsentReader = 'Consent.Read',
  ConsentWriter = 'Consent.ReadWrite',

  AdmissionReader = 'Admission.Read',

  NotificationWriter = 'Notification.ReadWrite',

  ///
  /// Authorization
  ///
  AuthorizationAdmin = 'Authorization.Administrator',
  AuthorizationWriter = 'Authorization.ReadWrite',
  AuthorizationReader = 'Authorization.Read',
  AuthorizationApprover = 'Authorization.Approver',
}
