import AgencySchema from '@/server/models/Agency';
import ServiceSchema from '@/server/models/Agency';
import { Agency, Service } from '@/utils/types';
import dbConnect from '@/utils/db-connect';
import { ApiError } from '@/utils/types';
import { errors } from '@/utils/constants';

/**
 * Finds all agencies, and their services
 * @returns All agencies and their services
 */
export async function getAgencies(): Promise<Agency[]> {
  await dbConnect();
  try {
    const agencies = await AgencySchema.find({}).populate('services').exec();
    return agencies as Agency[];
  } catch (error) {
    return [];
  }
}

/**
 *
 * @param page Which page to get
 * @param pageSize Number of agencies per page
 * @returns A single page of agencies
 */
export async function getPaginatedAgencies(
  page: number,
  pageSize: number
): Promise<Agency[]> {
  await dbConnect();
  try {
    const agencies = await AgencySchema.find({})
      .populate('services')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return agencies as Agency[];
  } catch (error) {
    return [];
  }
}

/**
 *
 * @param status The status of the agencies to get (Completed, NeedsReview, Expired)
 * @returns All agencies matching a specific status
 * @throws ApiError if the status is not one of the three valid statuses
 */
export async function getAgenciesByStatus(status: string): Promise<Agency[]> {
  if (
    status !== 'Completed' &&
    status !== 'NeedsReview' &&
    status !== 'Expired'
  ) {
    throw new ApiError(400, errors.badRequest);
  }
  await dbConnect();
  try {
    const agencies = await AgencySchema.find({ currentStatus: status })
      .populate('services')
      .exec();
    return agencies as Agency[];
  } catch (error) {
    return [];
  }
}

/**
 *
 * @param service The full service object to be created
 * @returns New service object with attached mongo _id
 * @throws See mongoErrorHandler for common insertion errors
 */
export async function createService(service: Service): Promise<Service> {
  await dbConnect();

  const newService = await ServiceSchema.create(service).catch((error) => {
    console.log(error);
    mongoErrorHandler(error);
  });
  return newService as Service;
}

/**
 *
 * @param agency The full agency object to be created, must include service array with _ids for each service
 * @returns New agency object with attached mongo _id
 * @throws See mongoErrorHandler for common insertion errors
 */
export async function createAgency(agency: Agency): Promise<Agency> {
  await dbConnect();

  const newAgency = await AgencySchema.create(agency).catch((error) => {
    console.error(error);
    mongoErrorHandler(error);
  });
  return newAgency as Agency;
}

/**
 * Updates an agency by ID
 * @param id The ID of the agency to update
 * @param updates The updates to apply to the agency (partial)
 * @returns The updated agency
 * @throws ApiError (404) if the agency is not found
 */
export async function updateAgency(
  id: string,
  updates: Partial<Agency>
): Promise<Agency | null> {
  await dbConnect();
  const updatedAgency = await AgencySchema.updateOne(
    { _id: id },
    updates
  ).catch((error) => {
    mongoErrorHandler(error.code);
  });
  if (updatedAgency!.modifiedCount === 0) {
    throw new ApiError(404, errors.notFound);
  }
  const agency = await AgencySchema.findById(id).populate('services').exec();
  return agency as Agency;
}

/**
 * Updates a service by ID
 * @param id The ID of the service to update
 * @param updates The updates to apply to the service (partial)
 * @returns The updated service
 */
export async function updateService(
  id: string,
  updates: Partial<Service>
): Promise<Service | null> {
  await dbConnect();
  const updatedService = await ServiceSchema.updateOne(
    { _id: id },
    updates
  ).catch((error) => {
    mongoErrorHandler(error.code);
  });
  if (updatedService!.modifiedCount === 0) {
    throw new ApiError(404, errors.notFound);
  }
  const service = await ServiceSchema.findById(id).populate('agency').exec();
  return service as Service;
}

/**
 * Handles common MongoDB insertion errors and throws an appropriate ApiError.
 * @param error - The error code returned by MongoDB.
 * @throws {ApiError} - An error object with a 400|500 status code and a message describing the error.
 */
function mongoErrorHandler(error: number) {
  switch (error) {
    case 11000:
      // Handle the duplicate key error
      throw new ApiError(400, errors.duplicate);
      break;
    case 121:
      // Handle the document validation error
      throw new ApiError(400, errors.validationFailed);
      break;
    case 16545:
      // Handle the unique constraint error
      throw new ApiError(400, errors.duplicate);
      break;
    case 2:
    case 14:
      // Handle the query error
      throw new ApiError(400, errors.queryError);
      break;
    default:
      // Handle other errors or rethrow the error for generic handling
      throw new ApiError(500, errors.serverError);
      break;
  }
}
