import * as mongoose from 'mongoose';
import { IDay } from '@/types/IDay';
export interface IService extends mongoose.Document {
  fullDescription: string;
  contactPersonName: string;
  daysOpen: IDay[]; // Assuming you have a separate schema/interface for 'daySchema'
  eligibilityRequirements: string;
  applicationProcess:
    | 'Walk-in'
    | 'Telephone'
    | 'Call to Schedule Appointment'
    | 'Apply Online';
  applicationProcessOther?: string;
  applicationProcessReferralRequiredByWhom?: string;
  feeCategory:
    | 'No Fee'
    | 'Sliding Scale'
    | 'Income Based'
    | 'Fee'
    | 'Insurance: Medicaid/TennCare'
    | 'Insurance: Medicare'
    | 'Insurance: Private';
  feeStraightFeeAmount?: string;
  requiredDocuments:
    | 'No Documents'
    | 'State Issued I.D.'
    | 'Social Security Card'
    | 'Proof of Residence'
    | 'Proof of Income'
    | 'Birth Certificate'
    | 'Medical Records'
    | 'Psych Records'
    | 'Proof of Need'
    | 'Utility Bill'
    | 'Utility Bill Cutoff Notice'
    | 'Proof of Citizenship'
    | 'Proof of Public Assistance'
    | 'Drivers License';
  requiredDocumentsOther?: string;
}
