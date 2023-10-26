import AgencySchema from '@/server/models/Agency';
import { Agency } from '@/utils/types';
import * as MongoDriver from '@/server/actions/MongoDriver';

export async function getAgencies(): Promise<Agency[]> {
  const aggregatePipeline = [
    {
      $lookup: {
        from: 'services',
        localField: 'services',
        foreignField: '_id',
        as: 'services',
      },
    },
    {
      $addFields: {
        currentStatus: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$updatedAt', null] },
                then: 'Expired',
              },
              {
                case: {
                  $lt: [
                    { $subtract: [new Date(), '$updatedAt'] },
                    {
                      $multiply: ['$updateScheduleInDays', 24 * 60 * 60 * 1000],
                    },
                  ],
                },
                then: 'Completed',
              },
              {
                case: {
                  $lt: [
                    { $subtract: [new Date(), '$updatedAt'] },
                    {
                      $multiply: ['$updateScheduleInDays', 24 * 60 * 60 * 1000],
                    },
                  ],
                },
                then: 'NeedsReview',
              },
            ],
            default: 'Expired',
          },
        },
      },
    },
    {
      $addFields: {
        daysSinceEmailSent: {
          $cond: {
            if: { $eq: ['$emailSentTimestamp', null] }, // Handle cases where emailSentTimestamp is not set
            then: null,
            else: {
              $trunc: {
                $divide: [
                  {
                    $subtract: [new Date(), '$emailSentTimestamp'],
                  },
                  1000 * 60 * 60 * 24, // Convert milliseconds to days
                ],
              },
            },
          },
        },
      },
    },
  ];
  return await MongoDriver.getEntities<Agency>(AgencySchema, aggregatePipeline);
}
