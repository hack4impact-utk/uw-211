import mongoose from 'mongoose';
import { Agency } from '@/utils/types/';
import { agencyUpdateStatus } from '@/utils/constants';

const AgencySchema = new mongoose.Schema<Agency>(
  {
    name: {
      type: String,
      required: true,
    },
    info: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgencyInfoForm',
      },
    ],
    updateScheduleInDays: {
      type: Number,
      required: true,
    },
    approvalStatus: {
      type: String,
      required: false,
      enum: ['Pending', 'Approved'],
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

AgencySchema.virtual('latestInfo').get(function (this: Agency) {
  if (this.info.length === 0) {
    return null;
  }
  return this.info[this.info.length - 1];
});

AgencySchema.virtual('currentStatus').get(function (this: Agency) {
  const currentTime: Date = new Date();
  if (!this.updatedAt) {
    return agencyUpdateStatus.Expired;
  }
  // Trigger expired status if any of the most current
  // agencyInfoForm services are seasonal,
  // and we're within a month of their seasonal start date
  if (
    this.latestInfo &&
    this.latestInfo.services?.some((service) => service.isSeasonal)
  ) {
    for (const service of this.latestInfo.services) {
      if (
        service.isSeasonal &&
        service.seasonalStartDate &&
        currentTime.getTime() >=
          service.seasonalStartDate.getTime() - 1000 * 60 * 60 * 24 * 30
      ) {
        return agencyUpdateStatus.Expired;
      }
    }
  }

  // Check latest form for approval
  if (this.info.length !== 0) {
    return this.info[this.info.length - 1].approved
      ? agencyUpdateStatus.Completed
      : agencyUpdateStatus.Expired;
  }

  // If there is no info associated with an agency look at the outer status
  if (this.approvalStatus) {
    return this.approvalStatus;
  }

  return agencyUpdateStatus.Expired;
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
