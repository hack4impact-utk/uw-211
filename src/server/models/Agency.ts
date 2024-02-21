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

AgencySchema.virtual('currentStatus').get(function (this: Agency) {
  const currentTime: Date = new Date();
  if (!this.updatedAt) {
    return agencyUpdateStatus.Expired;
  }
  const differenceInMilliseconds: number =
    currentTime.getTime() - this.updatedAt.getTime();
  const differenceInDays: number = Math.floor(
    differenceInMilliseconds / (1000 * 3600 * 24)
  );
  if (differenceInDays < this.updateScheduleInDays - 14) {
    return agencyUpdateStatus.Completed;
  } else if (differenceInDays < this.updateScheduleInDays) {
    return agencyUpdateStatus.NeedsReview;
  } else if (differenceInDays >= this.updateScheduleInDays) {
    return agencyUpdateStatus.Expired;
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
