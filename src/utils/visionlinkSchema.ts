import { z } from 'zod';

export const visionlinkSchema = z.object({
  Agency_Id: z.string().optional(),
  Agency_CreateAccountId: z.string().optional(),
  Agency_CreatePortalId: z.string().optional(),
  Agency_CreateFormsetDeploymentId: z.string().optional(),
  Agency_EditAccountId: z.string().optional(),
  Agency_EditPortalId: z.string().optional(),
  Agency_EditFormsetDeploymentId: z.string().optional(),
  Agency_CreateStamp: z.string().optional(),
  Agency_EditStamp: z.string().optional(),
  Agency_AuditStamp: z.string().optional(),
  Agency_Status: z.enum(['active', 'deleted', 'disabled']).optional(),
  AgencyCustom_ContactPhoneNumbers: z.string().optional(),
  AgencyAddressus_AgencyAddressus: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  AgencyAddressus_ConfidentialPhysicalAddress: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  AgencyAddressus_MailingAddress: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  AgencyAddressus_ConfidentialMailingAddress: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  AgencyAccount_AgencyAccount: z
    .array(
      z.union([
        z.object({ account_id: z.number() }),
        z.object({ account_email: z.string() }),
      ])
    )
    .optional(),
  AgencySystem_PhoneMain: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  AgencySystem_DataSourceCode: z.string().optional(),
  AgencySystem_EmailAddress: z.string().optional(),
  AgencySystem_Fax: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  AgencySystem_TddPhone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  AgencySystem_LastEditDate: z.string().optional(),
  AgencySystem_YearOfIncorporation: z.string().optional(),
  AgencySystem_LicensesOrAccreditations: z.string().optional(),
  AgencySystem_EditNotes: z.string().optional(),
  AgencySystem_FederalEmployerIdentificationNumber: z.number().optional(),
  AgencySystem_DateOfLastCompleteUpdate: z.string().optional(),
  AgencySystem_Aka: z.string().optional(),
  AgencySystem_Websiteurl: z.string().optional(),
  AgencySystem_StaffNotes: z.string().optional(),
  AgencySystem_Name: z.string().optional(),
  AgencySystem_Description: z.string().optional(),
  AgencySystem_PhysicalAddressConfidential: z.boolean().optional(),
  AgencySystem_MailingAddressConfidential: z.boolean().optional(),
  AgencySystem_HoursOfOperation: z.string().optional(),
  AgencySystem_DirectoryPositiontitle: z.string().optional(),
  AgencySystem_DirectoryName: z.string().optional(),
  AgencySystem_DirectoryPhoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  AgencySystem_DirectorPhoneNumberExt: z.string().optional(),
  AgencySystem_DirectorEmail: z.string().optional(),
  AgencySystem_ConfidentialDirectorName: z.string().optional(),
  AgencySystem_ConfidentialDirectorTitle: z.string().optional(),
  AgencySystem_ConfidentialDirectorPhoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  AgencySystem_ConfidentialDirectorPhoneNumberExt: z.string().optional(),
  AgencySystem_ConfidentialDirectorEmail: z.string().optional(),
  AgencyHoursofoperation_ModuleHoursofoperation: z.string().optional(),
  AgencyOption_LegalStatus: z
    .array(z.object({ id: z.number(), label: z.string() }))
    .optional(),
  AgencyOption_IrsStatus: z
    .array(z.object({ id: z.number(), label: z.string() }))
    .optional(),
  AgencyOption_Status: z
    .array(z.object({ id: z.number(), label: z.string() }))
    .optional(),
  AgencyOption_RecordOwner: z
    .array(z.object({ id: z.number(), label: z.string() }))
    .optional(),
  AgencyContact_AgencyContact: z
    .array(z.object({ account_id: z.number(), account_email: z.string() }))
    .optional(),
  Service_Id: z.string().optional(),
  Service_AgencyId: z.string().optional(),
  Service_CreateAccountId: z.string().optional(),
  Service_CreatePortalId: z.string().optional(),
  Service_CreateFormsetDeploymentId: z.string().optional(),
  Service_EditAccountId: z.string().optional(),
  Service_EditPortalId: z.string().optional(),
  Service_EditFormsetDeploymentId: z.string().optional(),
  Service_CreateStamp: z.string().optional(),
  Service_EditStamp: z.string().optional(),
  Service_AuditStamp: z.string().optional(),
  Service_Status: z.enum(['active', 'deleted', 'disabled']).optional(),
  ServiceAccount_ServiceAccount: z
    .array(
      z.union([
        z.object({ account_id: z.number() }),
        z.object({ account_email: z.string() }),
      ])
    )
    .optional(),
  ServiceAccount_ServiceContact: z
    .array(z.object({ account_id: z.number(), account_email: z.string() }))
    .optional(),
  ServiceHoursofoperation_ModuleHoursofoperation: z.string().optional(),
  ServiceCustom_PhoneNumbers: z.string().optional(),
  ServiceOption_LanguagesOtherThanEnglish: z
    .array(z.object({ id: z.number(), label: z.string() }))
    .optional(),
  ServiceOption_Status: z
    .array(
      z.union([z.object({ id: z.number() }), z.object({ label: z.string() })])
    )
    .optional(),
  ServiceOption_RecordOwner: z
    .array(
      z.union([z.object({ id: z.number() }), z.object({ label: z.string() })])
    )
    .optional(),
  ServiceTaxonomy_ModuleServicepost: z
    .array(
      z.union([
        z.object({ taxonomy_id: z.number() }),
        z.object({ taxonomy_code: z.string() }),
      ])
    )
    .optional(),
  ServiceGeotagus_ServiceGeotagus: z
    .array(
      z.object({
        scope: z.string(),
        state: z.string().optional(),
        county: z.string().optional(),
        zip: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .optional(),
  ServiceSite_ServiceSite: z
    .array(
      z.union([
        z.string(),
        z.object({ id: z.number() }),
        z.object({ name: z.string() }),
      ])
    )
    .optional(),
  ServiceSystem_DocumentsRequired: z.string().optional(),
  ServiceSystem_EmailAddress: z.string().optional(),
  ServiceSystem_FeeStructure: z.string().optional(),
  ServiceSystem_PhoneMain: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  ServiceSystem_Description: z.string().optional(),
  ServiceSystem_CostPerUnit: z.string().optional(),
  ServiceSystem_UnitOfService: z.string().optional(),
  ServiceSystem_DateOfLastCompleteUpdate: z.string().optional(),
  ServiceSystem_Aka: z.string().optional(),
  ServiceSystem_Websiteurl: z.string().optional(),
  ServiceSystem_Name: z.string().optional(),
  ServiceSystem_Fax: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  ServiceSystem_TddPhone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  ServiceSystem_ApplicationintakeProcess: z.string().optional(),
  ServiceSystem_ServiceCapacityAndType: z.string().optional(),
  ServiceSystem_MethodOfPaymentAccepted: z.string().optional(),
  ServiceSystem_LastEditDate: z.string().optional(),
  ServiceSystem_EditNotes: z.string().optional(),
  ServiceSystem_StaffNotes: z.string().optional(),
  ServiceSystem_DataSourceCode: z.string().optional(),
  ServiceSystem_HoursOfOperation: z.string().optional(),
  ServiceSystem_Eligibility: z.string().optional(),
  ServiceContact_ServiceContact: z
    .array(z.object({ account_id: z.number(), account_email: z.string() }))
    .optional(),
  Site_Id: z.string().optional(),
  Site_AgencyId: z.string().optional(),
  Site_CreateAccountId: z.string().optional(),
  Site_CreatePortalId: z.string().optional(),
  Site_CreateFormsetDeploymentId: z.string().optional(),
  Site_EditAccountId: z.string().optional(),
  Site_EditPortalId: z.string().optional(),
  Site_EditFormsetDeploymentId: z.string().optional(),
  Site_CreateStamp: z.string().optional(),
  Site_EditStamp: z.string().optional(),
  Site_AuditStamp: z.string().optional(),
  Site_Status: z.enum(['active', 'deleted', 'disabled']).optional(),
  SiteHoursofoperation_ModuleHoursofoperation: z.string().optional(),
  SiteOption_Status: z
    .array(
      z.union([z.object({ id: z.number() }), z.object({ label: z.string() })])
    )
    .optional(),
  SiteOption_RecordOwner: z
    .array(
      z.union([z.object({ id: z.number() }), z.object({ label: z.string() })])
    )
    .optional(),
  SiteAddressus_MailingAddress: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  SiteAddressus_SiteAddressus: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  SiteAddressus_ConfidentialPhysicalAddress: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  SiteAddressus_ConfidentialMailingAddress: z
    .object({
      address_1: z.string().optional(),
      address_2: z.string().optional(),
      city: z.string().optional(),
      county: z.string().optional(),
      state: z.string().length(2).optional(),
      zip: z.string().optional(),
      notes: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  SiteAccount_SiteAccount: z
    .array(
      z.union([
        z.object({ account_id: z.number() }),
        z.object({ account_email: z.string() }),
      ])
    )
    .optional(),
  SiteSystem_EditNotes: z.string().optional(),
  SiteSystem_StaffNotes: z.string().optional(),
  SiteSystem_DateOfLastCompleteUpdate: z.string().optional(),
  SiteSystem_Name: z.string().optional(),
  SiteSystem_PhoneMain: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  SiteSystem_EmailAddress: z.string().optional(),
  SiteSystem_Aka: z.string().optional(),
  SiteSystem_Fax: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .optional(),
  SiteSystem_Websiteurl: z.string().optional(),
  SiteSystem_LastEditDate: z.string().optional(),
  SiteSystem_DataSourceCode: z.string().optional(),
  SiteSystem_HoursOfOperation: z.string().optional(),
  SiteSystem_PhysicalAddressConfidential: z.boolean().optional(),
  SiteSystem_MailingAddressConfidential: z.boolean().optional(),
  SiteContact_SiteContact: z
    .array(
      z.union([
        z.object({ account_id: z.number() }),
        z.object({ account_email: z.string() }),
      ])
    )
    .optional(),
});

export default visionlinkSchema;
