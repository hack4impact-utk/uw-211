import AgencySchema from '@/server/models/Agency';
import ServiceSchema from '@/server/models/Service';
import { Agency, Service, MongoError } from '@/utils/types';
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
    mongoErrorHandler(error as MongoError);
    return [];
  }
}

/**
 *
 * @param page Which page to get
 * @param pageSize Number of agencies per page
 * @returns A single page of agencies
 * @throws ApiError if the page is less than 1
 * @throws ApiError if the pageSize is less than 1
 * @throws ApiError for bad mongoose request
 */
export async function getPaginatedAgencies(
  page: number,
  pageSize: number
): Promise<Agency[]> {
  if (page < 1 || pageSize < 1) {
    throw new ApiError(400, errors.badRequest);
  }

  await dbConnect();
  try {
    const agencies = await AgencySchema.find({})
      .populate('services')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return agencies as Agency[];
  } catch (error) {
    mongoErrorHandler(error as MongoError);
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
    mongoErrorHandler(error as MongoError);
    return [];
  }
}

/**
 * Retrieves an agency by its ID
 * @param id The ID of the agency to retrieve
 * @returns The agency with the specified ID, or null if no agency is found
 * @throws 404 if an agency with the specifiec id is not found
 */
export async function getAgencyById(id: string): Promise<Agency> {
  await dbConnect();
  try {
    const agency = await AgencySchema.findById(id).populate('services').exec();
    if (!agency) {
      throw new ApiError(404, errors.notFound);
    }
    return agency;
  } catch (error) {
    mongoErrorHandler(error as MongoError);
  }
  return {} as Agency;
}

/**
 *
 * @param service The full service object to be created
 * @returns New service object with attached mongo _id
 * @throws See mongoErrorHandler for common insertion errors
 */
export async function createService(service: Service): Promise<Service> {
  await dbConnect();
  const newService = await ServiceSchema.create(service).catch((err) => {
    mongoErrorHandler(err);
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
 * @throws ApiError (404) if the service is not found
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
 * Deletes an agency by ID
 * @param id The ID of the agency to delete
 * @returns The deleted agency
 * @throws 404 if no agency is found with the ID
 */
export async function deleteAgency(id: string): Promise<Agency | null> {
  await dbConnect();
  const deletedAgency = await AgencySchema.findByIdAndDelete(id).catch(
    (error) => {
      mongoErrorHandler(error);
    }
  );
  if (!deletedAgency) {
    throw new ApiError(404, errors.notFound);
  }
  return deletedAgency as Agency;
}

/**
 * Deletes a service by ID
 * @param id The ID of the service to delete
 * @returns The deleted service
 * @throws 404 if no service is found with the ID
 */
export async function deleteService(id: string): Promise<Service | null> {
  await dbConnect();
  const deletedService = await ServiceSchema.findByIdAndDelete(id).catch(
    (error) => {
      mongoErrorHandler(error);
    }
  );
  if (!deletedService) {
    throw new ApiError(404, errors.notFound);
  }
  return deletedService as Service;
}

/**
 * Handles common MongoDB insertion errors and throws an appropriate ApiError.
 * @param error - The error object returned by MongoDB.
 * @throws {ApiError} - An error object with a 400|500 status code and a message describing the error.
 */
function mongoErrorHandler(error: MongoError) {
  switch (error.name) {
    case 'CastError':
      // Handle the cast error
      throw new ApiError(400, errors.castError);
      break;
    case 'ValidationError':
      // Handle the document validation error
      // Grab out which field was wrong, and expected type
      const errorsList = error.errors;
      const validationErrors = Object.keys(errorsList).map((key) => ({
        path: errorsList[key].path,
        kind: errorsList[key].kind,
      }));

      throw new ApiError(
        400,
        errors.validationFailed +
          validationErrors
            .map((error) => `${error.path} (${error.kind})`)
            .join(', ')
      );
      break;
    case 'ObjectExpectedError':
      throw new ApiError(400, errors.objectExpected);
      break;
    case 'StrictModeError':
      // Returns the path of the offending field
      const path = error.path;
      throw new ApiError(400, errors.strictMode + path);
      break;
    default:
      // Catch non-mongoose errors
      throw new ApiError(500, errors.serverError);
      break;
  }
}
