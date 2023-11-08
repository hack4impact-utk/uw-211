import mongoose from 'mongoose';
import { Agency, ServiceArea, Location, ContactInfo } from '@/utils/types/';
import { agencyStatus } from '@/utils/constants';

const LocationSchema = new mongoose.Schema<Location>({
  confidential: {
    type: Boolean,
    required: true,
  },
  physicalAddress: {
    type: String,
    required: true,
  },
  mailingAddress: String,
  county: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
});

const ServiceAreaSchema = new mongoose.Schema<ServiceArea>({
  locations: {
    type: [LocationSchema],
  },
  statewide: {
    type: Boolean,
  },
  nationwide: {
    type: Boolean,
  },
  other: {
    type: String,
  },
});

const ContactInfoSchema = new mongoose.Schema<ContactInfo>({
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  faxNumber: {
    type: String,
  },
  tollFreeNumber: {
    type: String,
  },
  TDDTTYNumber: {
    type: String,
  },
  additionalNumbers: {
    type: [String],
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
});

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
    serviceArea: {
      type: ServiceAreaSchema,
    },
    fundingSources: {
      type: [String],
      required: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    contactInfo: {
      type: ContactInfoSchema,
      required: true,
    },
    languageTeleInterpreterService: {
      type: Boolean,
    },
    languages: {
      type: [String],
      required: true,
    },
    languagesWithoutPriorNotice: {
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
    updaterContactInfo: {
      type: ContactInfoSchema,
      required: true,
    },
    services: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
        },
      ],
    },
    volunteerOpportunities: {
      type: Boolean,
    },
    volunteerOpportunitiesEligibility: {
      type: String,
    },
    volunteerCoordinatorContactInfo: {
      type: ContactInfoSchema,
    },
    donations: {
      type: [String],
    },
    donationPickUpLocation: {
      type: LocationSchema,
    },
    donationCoordinatorContactInfo: {
      type: ContactInfoSchema,
    },
    recommendedAgencies: {
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
    strict: 'throw',
  }
);

AgencySchema.virtual('currentStatus').get(function (this: Agency) {
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

AgencySchema.virtual('daysSinceEmailSent').get(function () {
  if (!this.emailSentTimestamp) {
    return null;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const currentTime = new Date();
  const timeDiff = currentTime.getTime() - this.emailSentTimestamp.getTime();
  const daysSinceEmailSent = Math.floor(timeDiff / millisecondsPerDay);

  return daysSinceEmailSent;
});

export default mongoose.models.Agency ||
  mongoose.model<Agency>('Agency', AgencySchema);
