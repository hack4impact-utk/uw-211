import { Agency, AgencyInfoForm, Service } from '@/utils/types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { testAgency } from './testData/testAgency';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;
let getAgencies: () => Promise<Agency[]>;
let createService: (service: Service) => Promise<Service>;
let createAgency: (agency: Agency) => Promise<Agency>;
let updateAgency: (
  id: string,
  updates: Partial<Agency>
) => Promise<Agency | null>;
let updateService: (
  id: string,
  updates: Partial<Service>
) => Promise<Service | null>;
let getAgencyById: (id: string) => Promise<Agency | null>;
let createAgencyInfo: (info: AgencyInfoForm) => Promise<AgencyInfoForm>;
let getPaginatedAgencies: (page: number, pageSize: number) => Promise<Agency[]>;
let deleteService: (id: string) => Promise<Service | null>;
let deleteAgency: (id: string) => Promise<Agency | null>;
let approveAgency: (
  id: string,
  newInfo: AgencyInfoForm,
  newApprovalStatus: 'Pending' | 'Approved'
) => Promise<Agency | null>;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;

  const dbConnect = (await import('@/utils/db-connect')).default;
  await dbConnect();
  const agenciesModule = await import('@/server/actions/Agencies');
  getAgencies = agenciesModule.getAgencies;
  createService = agenciesModule.createService;
  createAgency = agenciesModule.createAgency;
  updateAgency = agenciesModule.updateAgency;
  updateService = agenciesModule.updateService;
  getAgencyById = agenciesModule.getAgencyById;
  createAgencyInfo = agenciesModule.createAgencyInfo;
  getPaginatedAgencies = agenciesModule.getPaginatedAgencies;
  deleteService = agenciesModule.deleteService;
  deleteAgency = agenciesModule.deleteAgency;
  approveAgency = agenciesModule.approveAgency;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Agency', () => {
  it('should initially return an empty array', async () => {
    const agencies = await getAgencies();
    expect(agencies).toEqual([]);
  });

  it('should add an agency/service to the db, and confirm it is there', async () => {
    const agencyCopy = { ...testAgency };
    const { info, ...agencyWithoutInfo } = agencyCopy;
    const { services, ...infoWithoutServices } = info[0];

    const serviceIds = [];
    for (const service of services!) {
      const newService = await createService(service);
      serviceIds.push(newService._id);
    }
    const updatedInfo = {
      ...infoWithoutServices,
      services: serviceIds,
    };

    const agencyInfo = await createAgencyInfo(
      updatedInfo as unknown as AgencyInfoForm
    );

    const agency = { ...agencyWithoutInfo, info: agencyInfo._id };

    const createdAgency = await createAgency(agency as unknown as Agency);
    const getAgency = await getAgencyById(createdAgency._id as string);

    expect(getAgency!.name).toEqual(agencyCopy.name);
  });

  it('should update the legalAgencyName field of an agency', async () => {
    // Grab previously created agency
    const agencies = await getAgencies();
    const agency = agencies[0];

    // Update the legalAgencyName field
    const updatedAgencyName = 'Updated Legal Agency Name';
    await updateAgency(agency._id as string, {
      name: updatedAgencyName,
    });

    // Fetch the updated agency
    const updatedAgency = await getAgencyById(agency._id as string);

    // Check if the legalAgencyName field has been updated
    expect(updatedAgency?.name).toBe(updatedAgencyName);
  });

  it('should update the fullDescription of a service', async () => {
    // Grab previously created agency
    const agencies = await getAgencies();
    const agency = agencies[0];

    // Update the fullDescription field
    const updatedFullDescription = 'Updated Full Description';
    await updateService(agency.info[0].services![0]._id as string, {
      fullDescription: updatedFullDescription,
    });

    // Fetch the updated Agency
    const updatedAgency = await getAgencyById(agency._id as string);

    // Check if the legalAgencyName field has been updated
    expect(updatedAgency!.info[0].services![0].fullDescription).toBe(
      updatedFullDescription
    );
  });

  it('Create a new agency, then check to ensure virtual fields are set to currentStatus: complete and daysSinceEmailSent: 0', async () => {
    // Grab prevously created agency
    const agencies = await getAgencies();
    const agency = agencies[0];

    // Check if the currentStatus field is set to complete
    expect(agency.currentStatus).toBe('Completed');

    // Check if the daysSinceEmailSent field is set to 0
    expect(agency.daysSinceEmailSent).toBe(0);

    // Check if the latestInfo field is equal to the last info in the
    // original array
    expect(agency.latestInfo).toEqual(agency.info[agency.info.length - 1]);
  });

  it('Test page return size from getPagineatedAgencies', async () => {
    let agencies = await getPaginatedAgencies(1, 1);
    expect(agencies.length).toBe(1);
    agencies = await getPaginatedAgencies(1, 2);
    expect(agencies.length).toBe(1);
    agencies = await getPaginatedAgencies(2, 10);
    expect(agencies.length).toBe(0);

    // Insert 20 agencies
    for (let i = 0; i < 20; i++) {
      const agencyCopy = { ...testAgency };
      const { info, ...agencyWithoutInfo } = agencyCopy;
      const { services, ...infoWithoutServices } = info[0];

      const serviceIds = [];
      for (const service of services!) {
        const newService = await createService(service);
        serviceIds.push(newService._id);
      }
      const updatedInfo = {
        ...infoWithoutServices,
        services: serviceIds,
      };

      const agencyInfo = await createAgencyInfo(
        updatedInfo as unknown as AgencyInfoForm
      );

      const agency = { ...agencyWithoutInfo, info: agencyInfo._id };

      await createAgency(agency as unknown as Agency);
    }

    agencies = await getPaginatedAgencies(1, 10);
    expect(agencies.length).toBe(10);
  });

  it('should delete a service from an agency', async () => {
    // Grab previously created agency
    const agencies = await getAgencies();
    const agency = agencies[0];

    // Delete the service
    await deleteService(agency.info[0].services![0]._id!);

    // Grab service again
    const servicelessAgency = await getAgencyById(agency._id as string);
    expect(servicelessAgency!.info[0].services!.length).toBe(0);
  });

  it('should delete a agency from the db', async () => {
    // Grab previously created agencys
    const agencies = await getAgencies();
    const agency = agencies[0];
    const originalSize = agencies.length;

    // Delete the service
    await deleteAgency(agency._id!);

    // Grab agencies again
    const shorterAgencies = await getAgencies();
    expect(shorterAgencies.length).toBe(originalSize - 1);
  });

  it('should `approve` an agency and add latest form info', async () => {
    // Grab previously created agency
    const agencies = await getAgencies();
    const agency = agencies[0];

    // Update the approvalStatus field
    // Simply duplicates the previous `info` and sets the approval
    // status to approved
    await approveAgency(agency._id as string, testAgency.info[0], 'Approved');

    const updatedAgency = await getAgencyById(agency._id as string);
    expect(updatedAgency?.approvalStatus).toBe('Approved');
  });
});
