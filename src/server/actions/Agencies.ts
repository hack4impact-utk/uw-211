// import AgencyInfoFormModel from '@/server/models/AgencyInfoForm';
// import AgencyModel from '@/server/models/Agency';
// import ServiceModel from '@/server/models/Service';
import { Service, Agency, MongoError, AgencyInfoForm } from '@/utils/types';
import dbConnect from '@/utils/db-connect';
import { JSendResponse } from '@/utils/types';
import { errors } from '@/utils/constants';
import {
  AgencyInfoFormModel,
  AgencyModel,
  ServiceModel,
} from '@/server/models';

/**
 * @brief Gets all agencies
 * @returns An array of all agencies in the "agencies" collection with fields populated
 */
export async function getAgencies(): Promise<Agency[]> {
  try {
    await dbConnect();
    const agencies = await AgencyModel.find({})
      .populate({
        path: 'info',
        populate: { path: 'services' },
      })
      .exec();
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
  if (page < 1) {
    throw new JSendResponse({
      status: 'fail',
      data: { paginationError: 'Bad Page: ' + page },
    });
  } else if (pageSize < 1) {
    throw new JSendResponse({
      status: 'fail',
      data: { paginationError: 'Bad Page Size: ' + pageSize },
    });
  }

  try {
    await dbConnect();
    const agencies = await AgencyModel.find({})
      .populate({
        path: 'info',
        populate: { path: 'services' },
      })
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
 * Retrieves an agency by its ID
 * @param id The ID of the agency to retrieve
 * @returns The agency with the specified ID, or null if no agency is found
 * @throws 404 if an agency with the specifiec id is not found
 */
export async function getAgencyById(id: string): Promise<Agency> {
  try {
    await dbConnect();
    const agency = await AgencyModel.findById(id)
      .populate({
        path: 'info',
        populate: { path: 'services' },
      })
      .exec();
    if (!agency) {
      throw new JSendResponse({
        status: 'fail',
        data: { message: 'Agency not found with id: ' + id },
      });
    }
    return agency;
  } catch (error) {
    // rethrow custom error to be handled by calling function
    if (error instanceof JSendResponse) {
      throw error;
    }
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
  const newService = await ServiceModel.create(service).catch((err) => {
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

  const newAgency = await AgencyModel.create(agency).catch((error) => {
    mongoErrorHandler(error);
  });
  return newAgency as Agency;
}

/**
 *
 * @param agencyInfo The agency form data to be created, with services array of _ids for each service
 * @returns New AgencyInfoForm object with attached mongo _id
 * @throws See mongoErrorHandler for common insertion errors
 */
export async function createAgencyInfo(
  agencyInfo: AgencyInfoForm
): Promise<AgencyInfoForm> {
  await dbConnect();

  const newAgencyInfo = await AgencyInfoFormModel.create(agencyInfo).catch(
    (error) => {
      mongoErrorHandler(error);
    }
  );
  return newAgencyInfo as AgencyInfoForm;
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
  const updatedAgency = await AgencyModel.updateOne({ _id: id }, updates).catch(
    (error) => {
      mongoErrorHandler(error.code);
    }
  );
  if (updatedAgency!.modifiedCount === 0) {
    throw new JSendResponse({
      status: 'fail',
      data: { message: 'Agency not found' },
    });
  }
  const agency = await AgencyModel.findById(id)
    .populate({
      path: 'info',
      populate: { path: 'services' },
    })
    .exec();
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
  const updatedService = await ServiceModel.updateOne(
    { _id: id },
    updates
  ).catch((error) => {
    mongoErrorHandler(error.code);
  });
  if (updatedService!.modifiedCount === 0) {
    throw new JSendResponse({
      status: 'fail',
      data: { message: 'Service not found' },
    });
  }
  const service = await ServiceModel.findById(id).exec();
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
  const deletedAgency = await AgencyModel.findByIdAndDelete(id).catch(
    (error) => {
      mongoErrorHandler(error);
    }
  );
  if (!deletedAgency) {
    throw new JSendResponse({
      status: 'fail',
      data: { message: 'Agency not found' },
    });
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
  const deletedService = await ServiceModel.findByIdAndDelete(id).catch(
    (error) => {
      mongoErrorHandler(error);
    }
  );
  if (!deletedService) {
    throw new JSendResponse({
      status: 'fail',
      data: { message: 'Service not found' },
    });
  }
  return deletedService as Service;
}

/**
 *
 * @param id The ID of the agency to approve
 * @param newInfo A new `AgencyInfoForm` object to be created and attached to the agency
 * @param newApprovalStatus `Approved` or `Pending`
 * @returns The updated agency
 * @throws 404 if no agency is found with the ID
 */
export async function approveAgency(
  id: string,
  newInfo: AgencyInfoForm,
  newApprovalStatus: 'Pending' | 'Approved'
): Promise<Agency | null> {
  await dbConnect();

  const { services, ...infoWithoutServices } = newInfo;

  const serviceIds = [];
  if (services !== undefined) {
    for (const service of services) {
      const newService = await createService(service);
      serviceIds.push(newService._id);
    }
  }
  const updatedInfo = {
    ...infoWithoutServices,
    services: serviceIds,
  } as unknown as AgencyInfoForm;

  const newAgencyInfo = await createAgencyInfo(updatedInfo);

  const updatedAgency = await AgencyModel.updateOne(
    { _id: id },
    {
      $push: { info: newAgencyInfo._id },
      $set: { approvalStatus: newApprovalStatus },
    }
  ).catch((error) => {
    mongoErrorHandler(error);
  });

  if (updatedAgency!.modifiedCount === 0) {
    throw new JSendResponse({
      status: 'fail',
      data: { message: 'Agency not found' },
    });
  }

  const agency = await AgencyModel.findById(id).exec();
  return agency as Agency;
}
/**
 * Handles common MongoDB insertion errors and throws an appropriate ApiError.
 * @param error - The error object returned by MongoDB.
 * @throws {JSendResponse} - An error object with a 400|500 status code and a message describing the error.
 */
function mongoErrorHandler(error: MongoError) {
  switch (error.name) {
    case 'CastError':
      // Handle the cast error

      throw new JSendResponse({
        status: 'fail',
        data: { castError: errors.castError },
      });
      break;
    case 'ValidationError':
      // Handle the document validation error
      // Grab out which field was wrong, and expected type
      const errorsList = error.errors;
      const validationErrors = Object.keys(errorsList).reduce(
        (acc, key) => {
          acc[errorsList[key].path] =
            'Should be of type: ' + errorsList[key].kind;
          return acc;
        },
        {} as Record<string, string>
      );

      throw new JSendResponse({ status: 'fail', data: validationErrors });
      break;
    case 'ObjectExpectedError':
      throw new JSendResponse({
        status: 'fail',
        data: { objectExpected: errors.objectExpected },
      });
      break;
    case 'StrictModeError':
      // Returns the path of the offending field
      const path = error.path;
      throw new JSendResponse({
        status: 'fail',
        data: { [path]: path + ' is not in schema' },
      });
      break;
    default:
      // Catch non-mongoose errors
      throw new JSendResponse({ status: 'error', message: errors.serverError });
      break;
  }
}
