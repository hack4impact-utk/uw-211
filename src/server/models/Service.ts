import mongoose from 'mongoose';
import { Service, Day } from '@/utils/types/';

const DaySchema = new mongoose.Schema<Day>({
  day: {
    type: String,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: true,
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
    required: true,
  },
});

const ServiceSchema = new mongoose.Schema<Service>(
  {
    fullDescription: {
      type: String,
      required: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    daysOpen: [DaySchema],
    eligibilityRequirements: {
      type: String,
      required: true,
    },
    applicationProcess: {
      type: [String],
      // enum: [
      //   'Walk-in',
      //   'Telephone',
      //   'Call to Schedule Appointment',
      //   'Apply Online',
      // ],
    },
    applicationProcessReferralRequiredByWhom: {
      type: String,
    },
    feeCategory: {
      type: String,
      enum: [
        'No Fee',
        'Sliding Scale',
        'Income Based',
        'Fee',
        'Insurance: Medicaid/TennCare',
        'Insurance: Medicare',
        'Insurance: Private',
      ],
    },
    feeStraightFeeAmount: {
      type: String,
    },
    requiredDocuments: {
      type: [String],
      // enum: [
      //   'No Documents',
      //   'State Issued I.D.',
      //   'Social Security Card',
      //   'Proof of Residence',
      //   'Proof of Income',
      //   'Birth Certificate',
      //   'Medical Records',
      //   'Psych Records',
      //   'Proof of Need',
      //   'Utility Bill',
      //   'Utility Bill Cutoff Notice',
      //   'Proof of Citizenship',
      //   'Proof of Public Assistance',
      //   'Drivers License',
      // ],
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    strict: 'throw',
  }
);

export default mongoose.models.Service ||
  mongoose.model<Service>('Service', ServiceSchema);
