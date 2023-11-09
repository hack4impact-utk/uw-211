import mongoose from 'mongoose';
import {
  Location,
  ServiceArea,
  ContactInfo,
  AgencyInfoForm,
} from '@/utils/types/';

const LocationSchema = new mongoose.Schema<Location>({
  confidential: {
    type: Boolean,
  },
  physicalAddress: {
    type: String,
  },
  mailingAddress: String,
  county: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
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

// TODO: Since ContactInfoSchema does not require any fields, we will need to implement some custom validator for each of the contact info sections of the survey form.
// e.g., Section "7. Contact Info" might require email and website, but Section "11. Person to contact for annual agency update" needs requires the person's name. These need to be enforced somehow.
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

// TODO: Some fields of the survey form allow more than one option (e.g. legal organizational status), so they are represented by a string array. For required fields, we need to add a validator that ensures that the array is not empty.

const AgencyInfoFormSchema = new mongoose.Schema<AgencyInfoForm>(
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
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    strict: 'throw',
  }
);

export default mongoose.models.AgencyInfoForm ||
  mongoose.model<AgencyInfoForm>('AgencyInfoForm', AgencyInfoFormSchema);
