import mongoose from 'mongoose';
import { Agency } from '@/utils/types/';
import { agencyStatus } from '@/utils/constants';

const AgencySchema = new mongoose.Schema<Agency>(
  {
    legalAgencyName: {
      type: String,
      required: true,
    },
    alsoKnownAs: {
      type: [String],
    },
    legalOrganizationalStatus: {
      type: [String],
      required: true,
    },
    briefAgencyDescription: {
      type: String,
      required: true,
    },
    directorNameOrTitle: {
      type: String,
      required: true,
    },
    serviceAreaCityState: {
      type: String,
    },
    serviceAreaZipCodes: {
      type: [String],
    },
    serviceAreaCounties: {
      type: [String],
    },
    serviceAreaStatewide: {
      type: Boolean,
    },
    serviceAreaNationwide: {
      type: Boolean,
    },
    serviceAreaOther: {
      type: String,
    },
    fundingSources: {
      type: String,
      enum: [
        'Federal',
        'State',
        'County',
        'City',
        'Donations',
        'Foundations/Private Org.',
        'Fees/Dues',
        'United Way',
        'Other',
      ],
      required: true,
    },
    fundingSourcesOther: {
      type: String,
    },
    mailingAddress: {
      type: String, // Only list if different from physical address
    },
    physicalAddressConfidential: {
      type: Boolean,
      required: true,
    },
    physicalAddressStreet: {
      type: String,
      required: true,
    },
    physicalAddressCounty: {
      type: String,
      required: true,
    },
    physicalAddressCity: {
      type: String,
      required: true,
    },
    physicalAddressState: {
      type: String,
      required: true,
    },
    physicalAddressZipCode: {
      type: String,
      required: true,
    },
    contactMainPhoneNumber: {
      type: String,
      required: true,
    },
    contactFaxNumber: {
      type: String,
    },
    contactTollFreeNumber: {
      type: String,
    },
    contactTDDTTYNumber: {
      type: String,
    },
    contactAdditionalNumbers: {
      type: [String],
    },
    contactEmail: {
      type: String,
      required: true,
    },
    websiteURL: {
      type: String,
    },
    languageASL: {
      type: Boolean,
    },
    languageSpanish: {
      type: Boolean,
    },
    languageTeleInterpreterService: {
      type: Boolean,
    },
    languageOthers: {
      type: [String],
    },
    languageWithoutPriorNotice: {
      type: [String],
    },
    accessibilityADA: {
      type: Boolean,
    },
    regularHoursOpening: {
      type: String,
    },
    regularHoursClosing: {
      type: String,
    },
    regularDaysOpen: {
      type: [String], // Consider better way to represent this
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
    contactForAnnualUpdateName: {
      type: String,
      required: true,
    },
    contactForAnunualUpdateTitle: {
      type: String,
      required: true,
    },
    contactForAnunualUpdatePhoneNumber: {
      type: String,
      required: true,
    },
    contactForAnunualUpdateEmail: {
      type: String,
      required: true,
    },
    contactForAnnualUpdateHidden: {
      type: Boolean,
    },
    services: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    },
    volunteerOpportunities: {
      type: Boolean,
    },
    volunteerOpportunitiesEligibility: {
      type: String,
    },
    volunteerCoordinarorName: {
      type: String,
    },
    volunteerCoordinatorPhoneNumber: {
      type: String,
    },
    donationRequirements: {
      type: String,
    },
    donationPickup: {
      type: Boolean,
    },
    donationPickupServiceArea: {
      type: String,
    },
    donationCoordinatorName: {
      type: String,
    },
    donationCoordinatorPhoneNumber: {
      type: String,
    },
    updateScheduleInDays: {
      type: Number,
      required: true,
    },
    emailSentTimestamp: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

AgencySchema.virtual('currentStatus').get(function (this: Agency) {
  console.log('here');
  const currentTime: Date = new Date();
  if (!this.updatedAt) {
    return agencyStatus.Expired;
  }
  const differenceInMilliseconds: number =
    currentTime.getTime() - this.updatedAt.getTime();
  const differenceInDays: number = Math.floor(
    differenceInMilliseconds / (1000 * 3600 * 24)
  );
  if (differenceInDays < this.updateScheduleInDays - 14) {
    return agencyStatus.Completed;
  } else if (differenceInDays < this.updateScheduleInDays) {
    return agencyStatus.NeedsReview;
  } else if (differenceInDays >= this.updateScheduleInDays) {
    return agencyStatus.Expired;
  }
});

export default mongoose.models.Agency ||
  mongoose.model<Agency>('Agency', AgencySchema);
