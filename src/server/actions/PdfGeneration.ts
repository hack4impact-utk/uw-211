'use server';

import { PDFDocument, PDFForm } from 'pdf-lib';
import { getAgencyById } from './Agencies';
import fs from 'fs';
import path from 'path';
import { Service } from '@/utils/types';

export async function generatePdf(agencyId: string): Promise<Uint8Array> {
  const agency = await getAgencyById(agencyId);
  // https://vercel.com/guides/how-can-i-use-files-in-serverless-functions
  // ALERT: DO NOT TRY TO USE SERVER ACTION DIRECTLY FROM CLIENT
  // UNRESOLVED ISSUE WITH HOW VERCEL HANDLES BUNDLING IN PRODUCTION
  // https://github.com/vercel/next.js/discussions/58512
  const pdfPath = path.join(process.cwd(), 'public', 'base_form.pdf');
  const data = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(data);
  const form = pdfDoc.getForm();

  const legalAgencyName = form.getTextField('Legal Agency Name');
  legalAgencyName.setText(agency.info[agency.info.length - 1].legalAgencyName);

  if (agency.info[agency.info.length - 1].alsoKnownAs) {
    const akas = form.getTextField('AKA s');
    akas.setText(agency.info[agency.info.length - 1].alsoKnownAs?.join(' '));
  }

  agency.info[agency.info.length - 1].legalOrganizationalStatus.forEach(
    (status) => {
      switch (status) {
        case 'Federal':
          const federal = form.getTextField(
            '1 Legal Organizational Status Federal'
          );
          federal.setText('X');
          break;
        case 'State':
          const state = form.getTextField('State');
          state.setText('X');
          break;
        case 'County':
          const county = form.getTextField('County');
          county.setText('X');
          break;
        case 'City':
          const city = form.getTextField('City');
          city.setText('X');
          break;
        case 'Non-profit':
          const nonProfit = form.getTextField('NonProfit');
          nonProfit.setText('X');
          break;
        case '501(c)3':
          const c3 = form.getTextField('501c3');
          c3.setText('X');
          break;
        case 'Faith-based':
          const faithBased = form.getTextField('Faithbased');
          faithBased.setText('X');
          break;
        case 'For profit':
          const forProfit = form.getTextField('For profit');
          forProfit.setText('X');
          break;
        default:
          const other = form.getTextField('Other');
          other.setText('X');
          break;
      }
    }
  );

  const briefAgencyDescription = form.getTextField(
    'what your agency does specific services will be listed later in the form 1'
  );
  briefAgencyDescription.setText(
    agency.info[agency.info.length - 1].briefAgencyDescription
  );

  const directorNameOrTitle = form.getTextField('3 Director NameTitle');
  directorNameOrTitle.setText(
    agency.info[agency.info.length - 1].directorNameOrTitle
  );

  let townCity: string = '';
  let zipCodes: string[] = [];
  let countyCities: string[] = [];

  townCity = agency.info[agency.info.length - 1].serviceArea.townCity!;
  zipCodes = agency.info[agency.info.length - 1].serviceArea.zipCodes!;
  countyCities = agency.info[agency.info.length - 1].serviceArea.counties!;
  // if (agency.info[agency.info.length - 1].serviceArea.locations) {
  // agency.info[agency.info.length - 1].serviceArea.locations?.forEach(
  //   (location) => {
  //     if (location.zipCode) {
  //       zipCodes.push(location.zipCode);
  //     }
  //     if (location.city) {
  //       townCity.push(location.city);
  //     }
  //     if (location.county) {
  //       countyCities.push(location.county);
  //     }
  //   }
  // );
  // }

  const townCityField = form.getTextField('Specific TownCity');
  const zipCodeField = form.getTextField('Specific Zip Codes 1');
  const countyField = form.getTextField('Specific CountyCounties 1');

  // townCityField.setText(townCity.join(', '));
  townCityField.setText(townCity);
  zipCodeField.setText(zipCodes.join(', '));
  countyField.setText(countyCities.join(', '));

  if (agency.info[agency.info.length - 1].serviceArea.statewide) {
    const statewide = form.getTextField('Statewide');
    statewide.setText('Yes');
  }
  if (agency.info[agency.info.length - 1].serviceArea.nationwide) {
    const nationwide = form.getTextField('Nationwide');
    nationwide.setText('Yes');
  }
  if (agency.info[agency.info.length - 1].serviceArea.other) {
    const other = form.getTextField('Other_2');
    other.setText(agency.info[agency.info.length - 1].serviceArea.other);
  }

  agency.info[agency.info.length - 1].fundingSources.forEach((source) => {
    switch (source) {
      case 'Federal':
        const federal = form.getTextField('5 Funding Sources Federal');
        federal.setText('X');
        break;
      case 'State':
        const state = form.getTextField('State_2');
        state.setText('X');
        break;
      case 'County':
        const county = form.getTextField('County_2');
        county.setText('X');
        break;
      case 'City':
        const City = form.getTextField('City_2');
        City.setText('X');
        break;
      case 'Donations':
        const donations = form.getTextField('Donations');
        donations.setText('X');
        break;
      case 'Foundations/Private Org.':
        const foundations = form.getTextField('FoundationsPrivate Org');
        foundations.setText('X');
        break;
      case 'Fees/Dues':
        const fees = form.getTextField('FeesDues');
        fees.setText('X');
        break;
      case 'United Way':
        const unitedWay = form.getTextField('United Way');
        unitedWay.setText('X');
        break;
      default:
        const other = form.getTextField('Other_3');
        other.setText('X');
        break;
    }
  });

  if (
    // agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.confidential
    agency.info[agency.info.length - 1].location.confidential
  ) {
    const confidential = form.getTextField(
      'Is the physical address confidential Yes'
    );
    confidential.setText('X');
  } else {
    const confidential = form.getTextField('No');
    confidential.setText('X');
  }

  const physicalAddress = form.getTextField('Physical Address');
  physicalAddress.setText(
    agency.info[agency.info.length - 1].location.physicalAddress
  );
  // agency.info[agency.info.length - 1].serviceArea.locations?.[0]
  //   ?.physicalAddress

  if (
    // agency.info[agency.info.length - 1].serviceArea.locations?.[0]
    //   ?.mailingAddress
    agency.info[agency.info.length - 1].location.mailingAddress
  ) {
    const mailingAddress = form.getTextField(
      'Mailing Address Only list if different from Physical'
    );
    mailingAddress.setText(
      // agency.info[agency.info.length - 1].serviceArea.locations
      agency.info[agency.info.length - 1].location.mailingAddress
    );
  }

  // if (agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.county) {
  if (agency.info[agency.info.length - 1].location.county) {
    const locationCounty = form.getTextField('County_3');
    locationCounty.setText(
      // agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.county
      agency.info[agency.info.length - 1].location.county
    );
  }

  // if (agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.city) {
  if (agency.info[agency.info.length - 1].location.city) {
    const locationCity = form.getTextField('City_3');
    locationCity.setText(
      // agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.city
      agency.info[agency.info.length - 1].location.city
    );
  }

  // if (agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.state) {
  if (agency.info[agency.info.length - 1].location.state) {
    const locationState = form.getTextField('State_3');
    locationState.setText(
      // agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.state
      agency.info[agency.info.length - 1].location.state
    );
  }

  // if (agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.zipCode) {
  if (agency.info[agency.info.length - 1].location.zipCode) {
    const locationZip = form.getTextField('Zip Code');
    locationZip.setText(
      // agency.info[agency.info.length - 1].serviceArea.locations?.[0]?.zipCode
      agency.info[agency.info.length - 1].location.zipCode
    );
  }

  if (agency.info[agency.info.length - 1].contactInfo.phoneNumber) {
    const areaCode = form.getTextField('Main Phone Number');
    areaCode.setText(
      agency.info[agency.info.length - 1].contactInfo.phoneNumber?.substring(
        0,
        3
      )
    );
    const phoneNumber = form.getTextField('undefined');
    phoneNumber.setText(
      agency.info[agency.info.length - 1].contactInfo.phoneNumber?.substring(3)
    );
  }

  if (agency.info[agency.info.length - 1].contactInfo.faxNumber) {
    const areaCode = form.getTextField('Fax');
    areaCode.setText(
      agency.info[agency.info.length - 1].contactInfo.faxNumber?.substring(0, 3)
    );
    const phoneNumber = form.getTextField('undefined_2');
    phoneNumber.setText(
      agency.info[agency.info.length - 1].contactInfo.faxNumber?.substring(3)
    );
  }

  if (agency.info[agency.info.length - 1].contactInfo.tollFreeNumber) {
    const tollFree = form.getTextField('Toll Free');
    tollFree.setText(
      agency.info[agency.info.length - 1].contactInfo.tollFreeNumber
    );
  }

  if (agency.info[agency.info.length - 1].contactInfo.TDDTTYNumber) {
    const tdd = form.getTextField('TDDTTY');
    tdd.setText(agency.info[agency.info.length - 1].contactInfo.TDDTTYNumber);
  }

  if (agency.info[agency.info.length - 1].contactInfo.additionalNumbers) {
    const additionalNumbers = form.getTextField('Alternate Numbers');
    const additional_numbers = [];
    const num_obj =
      agency.info[agency.info.length - 1].contactInfo.additionalNumbers!;
    for (let i = 0; i < num_obj.length; i++) {
      additional_numbers.push(`${num_obj[i].label}: ${num_obj[i].number}`);
    }

    additionalNumbers.setText(additional_numbers.join(', '));
  }

  if (agency.info[agency.info.length - 1].contactInfo.email) {
    const email = form.getTextField('Email Address');
    email.setText(agency.info[agency.info.length - 1].contactInfo.email);
  }

  if (agency.info[agency.info.length - 1].contactInfo.website) {
    const website = form.getTextField('Website');
    website.setText(agency.info[agency.info.length - 1].contactInfo.website);
  }

  if (agency.info[agency.info.length - 1].languages.includes('ASL')) {
    const asl = form.getTextField('parttime staff American Sign');
    asl.setText('X');
  }

  if (agency.info[agency.info.length - 1].languages.includes('Spanish')) {
    const spanish = form.getTextField('Spanish');
    spanish.setText('X');
  }

  if (agency.info[agency.info.length - 1].languageTeleInterpreterService) {
    const tele = form.getTextField('Teleinterpreter Service');
    tele.setText('X');
  }

  const otherLanguages: string[] = [];
  agency.info[agency.info.length - 1].languages.forEach((language) => {
    if (language === 'ASL' || language === 'Spanish') {
      return;
    }
    otherLanguages.push(language);
  });

  const other = form.getTextField('Other_4');
  other.setText(otherLanguages.join(', '));

  if (agency.info[agency.info.length - 1].languagesWithoutPriorNotice) {
    const withoutNoticeLanguages: string[] = [];
    agency.info[agency.info.length - 1].languagesWithoutPriorNotice?.forEach(
      (language) => {
        withoutNoticeLanguages.push(language);
      }
    );

    const withoutNotice = form.getTextField(
      'Can any languages be provided with prior notice If so list'
    );
    withoutNotice.setText(withoutNoticeLanguages.join(', '));
  }

  if (agency.info[agency.info.length - 1].accessibilityADA) {
    const ada = form.getTextField('Americans with Disabilities Act ADA Yes');
    ada.setText('X');
  } else {
    const ada = form.getTextField('No_3');
    ada.setText('X');
  }

  // FIX THIS ---------------------------------------------------------------------
  // if (agency.info[agency.info.length - 1].regularHoursOpening) {
  //   const hours = form.getTextField('Regular Office Hours');
  //   hours.setText(agency.info[agency.info.length - 1].regularHoursOpening);
  // }

  // if (agency.info[agency.info.length - 1].regularHoursClosing) {
  //   const hours = form.getTextField('am  pm to');
  //   hours.setText(agency.info[agency.info.length - 1].regularHoursClosing);
  // }

  // const regularDaysOpen: string[] = [];
  // agency.info[agency.info.length - 1].regularDaysOpen.forEach((day) => {
  //   regularDaysOpen.push(day);
  // });
  // const daysOpen = form.getTextField('am  pm Days Mon Tue Wed Thu Fri Sat Sun');
  // daysOpen.setText(regularDaysOpen.join(', '));
  // FIX THIS ----------------------------------------------------------------^^^^^

  let hoursText: string = '';
  const hours = form.getTextField('am  pm Days Mon Tue Wed Thu Fri Sat Sun');
  for (let i = 0; i < agency.info[agency.info.length - 1].hours.length; i++) {
    const hoursOfOperation = agency.info[agency.info.length - 1].hours[i];
    hoursText +=
      hoursOfOperation.day +
      ': ' +
      hoursOfOperation.openTime +
      '-' +
      hoursOfOperation.closeTime +
      ', ';
  }
  hours.setText(hoursText);

  if (agency.info[agency.info.length - 1].updaterContactInfo.name) {
    const updaterName = form.getTextField(
      '11 Person to contact for annual agency update'
    );
    updaterName.setText(
      agency.info[agency.info.length - 1].updaterContactInfo.name
    );
  }

  if (agency.info[agency.info.length - 1].updaterContactInfo.email) {
    const updaterTitle = form.getTextField('Email');
    updaterTitle.setText(
      agency.info[agency.info.length - 1].updaterContactInfo.email
    );
  }

  if (agency.info[agency.info.length - 1].updaterContactInfo.hideFromWebsite) {
    const hide = form.getTextField(
      'Would you like this informationto be hidden from the website'
    );
    hide.setText('X');
  }

  // Adding Services
  if (agency.info[agency.info.length - 1].services) {
    agency.info[agency.info.length - 1].services?.forEach((element, index) => {
      fillService(element, form, index);
    });
  }

  if (
    agency.info[agency.info.length - 1].volunteerOpportunities &&
    agency.info[agency.info.length - 1].volunteerOpportunities === true
  ) {
    const volunteers = form.getTextField(
      'does your organiztion accept volunteers Yes'
    );
    volunteers.setText('X');
  } else {
    const volunteers = form.getTextField('No_4');
    volunteers.setText('X');
  }

  if (agency.info[agency.info.length - 1].volunteerOpportunitiesEligibility) {
    const eligibilityRequirements = form.getTextField(
      'checks other requirements for your volunteers 1'
    );
    eligibilityRequirements.setText(
      agency.info[agency.info.length - 1].volunteerOpportunitiesEligibility
    );
  }

  if (agency.info[agency.info.length - 1].volunteerCoordinatorContactInfo) {
    const contactName = form.getTextField('Volunteer Coordinator');
    contactName.setText(
      agency.info[agency.info.length - 1].volunteerCoordinatorContactInfo?.name
    );

    const contactPhone = form.getTextField('Phone');
    contactPhone.setText(
      agency.info[agency.info.length - 1].volunteerCoordinatorContactInfo
        ?.phoneNumber
    );
  }

  if (agency.info[agency.info.length - 1].donations) {
    const donations = form.getTextField('If yes please list');
    donations.setText(
      agency.info[agency.info.length - 1].donations?.join(', ')
    );
  }

  if (agency.info[agency.info.length - 1].donationCoordinatorContactInfo) {
    const contactName = form.getTextField('Donation Coordinator');
    contactName.setText(
      agency.info[agency.info.length - 1].donationCoordinatorContactInfo?.name
    );

    const contactPhone = form.getTextField('Phone_2');
    contactPhone.setText(
      agency.info[agency.info.length - 1].donationCoordinatorContactInfo
        ?.phoneNumber
    );
  }

  if (agency.info[agency.info.length - 1].recommendedAgencies) {
    const recommendedAgencies = form.getTextField('agneciesservices 1');
    recommendedAgencies.setText(
      agency.info[agency.info.length - 1].recommendedAgencies
    );
  }

  return pdfDoc.save();
}

function fillService(service: Service, form: PDFForm, num: number) {
  const prefixes = ['', '_2', '_3', '_4', '_5'];
  const question3 = [
    'question 3 or if contact persons differ by service',
    'question 3 or if contacts differ by service',
  ];

  const fullDescription = form.getTextField(
    `Full Description 1${prefixes[num]}`
  );
  fullDescription.setText(service.fullDescription);

  const contactPerson = form.getTextField(
    num == 0 ? question3[0] : question3[1]
  );
  contactPerson.setText(service.contactPersonName);

  const eligibilityRequirements = form.getTextField(
    `Eligibility Requirements 1${prefixes[num]}`
  );
  eligibilityRequirements.setText(service.eligibilityRequirements);

  if (service.applicationProcess.includes('Walk-in')) {
    const walkin = form.getTextField(`Walkin${prefixes[num]}`);
    walkin.setText('X');
  }

  if (service.applicationProcess.includes('Telephone')) {
    const telephone = form.getTextField(`Telephone${prefixes[num]}`);
    telephone.setText('X');
  }

  if (service.applicationProcess.includes('Call to Schedule Appointment')) {
    const call = form.getTextField(
      `Call to Schedule Appointment${prefixes[num]}`
    );
    call.setText('X');
  }

  if (service.applicationProcess.includes('Apply Online')) {
    const online = form.getTextField(`Apply Online${prefixes[num]}`);
    online.setText('X');
  }

  const applicationOthers: string[] = [];
  service.applicationProcess.forEach((process) => {
    if (
      process === 'Walkin' ||
      process === 'Telephone' ||
      process === 'Call to Schedule Appointment' ||
      process === 'Apply Online'
    ) {
      return;
    }
    applicationOthers.push(process);
  });

  const applicationOthersField = form.getTextField(`Other_${num + 5}`);
  applicationOthersField.setText(applicationOthers.join(', '));

  if (service.applicationProcessReferralRequiredByWhom) {
    const referral = form.getTextField(
      `Referral Required By Whom${prefixes[num]}`
    );
    referral.setText(service.applicationProcessReferralRequiredByWhom);
  }

  switch (service.feeCategory) {
    case 'No Fee':
      const noFee = form.getTextField(`No Fee${prefixes[num]}`);
      noFee.setText('X');
      break;
    case 'Sliding Scale':
      const sliding = form.getTextField(`Sliding Scale Fee${prefixes[num]}`);
      sliding.setText('X');
      break;
    case 'Income Based':
      break;
    case 'Fee':
      const fee = form.getTextField(
        `Straight Free please specify${prefixes[num]}`
      );
      fee.setText(service.feeStraightFeeAmount);
      break;
    case 'Insurance: Medicaid/TennCare':
      const medicaid = form.getTextField(
        `Insurance MedicaidTennCare${prefixes[num]}`
      );
      medicaid.setText('X');
      break;
    case 'Insurance: Medicare':
      const medicare = form.getTextField(`Medicare${prefixes[num]}`);
      medicare.setText('X');
      break;
    case 'Insurance: Private':
      const _private = form.getTextField(`Prvate${prefixes[num]}`);
      _private.setText('X');
      break;
  }

  const documents: string[] = [];

  service.requiredDocuments.forEach((document) => {
    switch (document) {
      case 'No Documents':
        const noDocuments = form.getTextField(`No Documents${prefixes[num]}`);
        noDocuments.setText('X');
        break;
      case 'State Issued I.D.':
        const stateId = form.getTextField(`State Issued ID${prefixes[num]}`);
        stateId.setText('X');
        break;
      case 'Social Security Card':
        const socialSecurity = form.getTextField(
          `Social Security Card${prefixes[num]}`
        );
        socialSecurity.setText('X');
        break;
      case 'Proof of Residence':
        const proofOfResidence = form.getTextField(`Residence${prefixes[num]}`);
        proofOfResidence.setText('X');
        break;
      case 'Proof of Income':
        const proofOfIncome = form.getTextField(
          `Proof of Income${prefixes[num]}`
        );
        proofOfIncome.setText('X');
        break;
      case 'Birth Certificate':
        const birthCertificate = form.getTextField(
          `Birth Certificate${prefixes[num]}`
        );
        birthCertificate.setText('X');
        break;
      case 'Medical Records':
        const medicalRecords = form.getTextField(
          `Medical Records${prefixes[num]}`
        );
        medicalRecords.setText('X');
        break;
      case 'Psych Records':
        const psychRecords = form.getTextField(`Records${prefixes[num]}`);
        psychRecords.setText('X');
        break;
      case 'Proof of Need':
        const proofOfNeed = form.getTextField(`Proof of Need${prefixes[num]}`);
        proofOfNeed.setText('X');
        break;
      case 'Utility Bill':
        const utilityBill = form.getTextField(`Utility Bill${prefixes[num]}`);
        utilityBill.setText('X');
        break;
      case 'Utility Bill Cutoff Notice':
        const utilityBillCutoffNotice = form.getTextField(
          `Utility Bill Cutoff Notice${prefixes[num]}`
        );
        utilityBillCutoffNotice.setText('X');
        break;
      case 'Proof of Citizenship':
        const proofOfCitizenship = form.getTextField(
          `Proof of Citizenship${prefixes[num]}`
        );
        proofOfCitizenship.setText('X');
        break;
      case 'Proof of Public Assistance':
        const proofOfPublicAssistance = form.getTextField(
          `Proof of Public Assistance${prefixes[num]}`
        );
        proofOfPublicAssistance.setText('X');
        break;
      case 'Drivers License':
        const driversLicense = form.getTextField(
          `Drivers License${prefixes[num]}`
        );
        driversLicense.setText('X');
      default:
        documents.push(document);
        break;
    }
  });

  const otherDocuments = form.getTextField(`Other Specify${prefixes[num]}`);
  otherDocuments.setText(documents.join(', '));
}
