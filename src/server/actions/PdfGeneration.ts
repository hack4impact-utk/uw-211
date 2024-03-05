import { PDFDocument } from 'pdf-lib';
import { getAgencyById } from './Agencies';

export async function generatePdf(agencyId: string): Promise<Uint8Array> {
  const agency = await getAgencyById(agencyId);
  const data = await fetch('http://localhost:3000/211_form.pdf');
  const arrayBuffer = await data.arrayBuffer();

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();

  const legalAgencyName = form.getTextField('Legal Agency Name');
  legalAgencyName.setText(agency.info[0].legalAgencyName);

  if (agency.info[0].alsoKnownAs) {
    const akas = form.getTextField('AKA s');
    akas.setText(agency.info[0].alsoKnownAs.join(' '));
  }

  agency.info[0].legalOrganizationalStatus.forEach((status) => {
    switch (status) {
      case 'Federal':
        const federal = form.getRadioGroup('Federal');
        federal.select('Yes');
        break;
      case 'State':
        const state = form.getRadioGroup('State');
        state.select('Yes');
        break;
      case 'County':
        const county = form.getRadioGroup('County');
        county.select('Yes');
        break;
      case 'City':
        const City = form.getRadioGroup('City');
        City.select('Yes');
        break;
      case 'Non-Profit':
        const nonProfit = form.getRadioGroup('NonProfit');
        nonProfit.select('Yes');
        break;
      case '501(c)3':
        const c3 = form.getRadioGroup('501c3');
        c3.select('Yes');
        break;
      case 'Faith-based':
        const faithBased = form.getRadioGroup('Faithbased');
        faithBased.select('Yes');
        break;
      case 'For profit':
        const forProfit = form.getRadioGroup('For profit');
        forProfit.select('Yes');
        break;
      default:
        const other = form.getTextField('Other');
        other.setText('X');
        break;
    }
  });

  const briefAgencyDescription = form.getTextField(
    'what your agency does specific services will be listed later in the form 1'
  );
  briefAgencyDescription.setText(agency.info[0].briefAgencyDescription);

  const directorNameOrTitle = form.getTextField('3 Director NameTitle');
  directorNameOrTitle.setText(agency.info[0].directorNameOrTitle);

  const townCity: string[] = [];
  const zipCodes: string[] = [];
  const countyCities: string[] = [];
  if (agency.info[0].serviceArea.locations) {
    agency.info[0].serviceArea.locations.forEach((location) => {
      if (location.zipCode) {
        zipCodes.push(location.zipCode);
      }
      if (location.city) {
        townCity.push(location.city);
      }
      if (location.county) {
        countyCities.push(location.county);
      }
    });
  }

  const townCityField = form.getTextField('Specific TownCity');
  const zipCodeField = form.getTextField('Specific Zip Codes 1');
  const countyField = form.getTextField('Specific CountyCounties 1');

  townCityField.setText(townCity.join(', '));
  zipCodeField.setText(zipCodes.join(', '));
  countyField.setText(countyCities.join(', '));

  if (agency.info[0].serviceArea.statewide) {
    const statewide = form.getTextField('Statewide');
    statewide.setText('Yes');
  }
  if (agency.info[0].serviceArea.nationwide) {
    const nationwide = form.getTextField('Nationwide');
    nationwide.setText('Yes');
  }
  if (agency.info[0].serviceArea.other) {
    const other = form.getTextField('Other_2');
    other.setText(agency.info[0].serviceArea.other);
  }

  agency.info[0].fundingSources.forEach((source) => {
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

  if (agency.info[0].serviceArea.locations?.[0]?.confidential) {
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
    agency.info[0].serviceArea.locations?.[0]?.physicalAddress
  );

  if (agency.info[0].serviceArea.locations?.[0]?.mailingAddress) {
    const mailingAddress = form.getTextField('Mailing Address');
    mailingAddress.setText(
      agency.info[0].serviceArea.locations?.[0]?.mailingAddress
    );
  }

  if (agency.info[0].serviceArea.locations?.[0]?.county) {
    const locationCounty = form.getTextField('County_3');
    locationCounty.setText(agency.info[0].serviceArea.locations?.[0]?.county);
  }

  if (agency.info[0].serviceArea.locations?.[0]?.city) {
    const locationCity = form.getTextField('City_3');
    locationCity.setText(agency.info[0].serviceArea.locations?.[0]?.city);
  }

  if (agency.info[0].serviceArea.locations?.[0]?.state) {
    const locationState = form.getTextField('State_3');
    locationState.setText(agency.info[0].serviceArea.locations?.[0]?.state);
  }

  if (agency.info[0].serviceArea.locations?.[0]?.zipCode) {
    const locationZip = form.getTextField('Zip Code');
    locationZip.setText(agency.info[0].serviceArea.locations?.[0]?.zipCode);
  }

  if (agency.info[0].contactInfo.phoneNumber) {
    const areaCode = form.getTextField('Main Phone Number');
    areaCode.setText(agency.info[0].contactInfo.phoneNumber.substring(0, 3));
    const phoneNumber = form.getTextField('undefined');
    phoneNumber.setText(agency.info[0].contactInfo.phoneNumber.substring(3));
  }

  if (agency.info[0].contactInfo.faxNumber) {
    const areaCode = form.getTextField('Fax');
    areaCode.setText(agency.info[0].contactInfo.faxNumber.substring(0, 3));
    const phoneNumber = form.getTextField('undefined_2');
    phoneNumber.setText(agency.info[0].contactInfo.faxNumber.substring(3));
  }

  if (agency.info[0].contactInfo.tollFreeNumber) {
    const tollFree = form.getTextField('Toll Free');
    tollFree.setText(agency.info[0].contactInfo.tollFreeNumber);
  }

  if (agency.info[0].contactInfo.TDDTTYNumber) {
    const tdd = form.getTextField('TDDTTY');
    tdd.setText(agency.info[0].contactInfo.TDDTTYNumber);
  }

  if (agency.info[0].contactInfo.additionalNumbers) {
    const additionalNumbers = form.getTextField('Alternate Numbers');
    additionalNumbers.setText(
      agency.info[0].contactInfo.additionalNumbers.join(', ')
    );
  }

  if (agency.info[0].languages.includes('ASL')) {
    const asl = form.getTextField('parttime staff American Sign');
    asl.setText('X');
  }

  if (agency.info[0].languages.includes('Spanish')) {
    const spanish = form.getTextField('Spanish');
    spanish.setText('X');
  }

  if (agency.info[0].languageTeleInterpreterService) {
    const tele = form.getTextField('Teleinterpreter Service');
    tele.setText('X');
  }

  const otherLanguages: string[] = [];
  agency.info[0].languages.forEach((language) => {
    if (language === 'ASL' || language === 'Spanish') {
      return;
    }
    otherLanguages.push(language);
  });

  const other = form.getTextField('Other_4');
  other.setText(otherLanguages.join(', '));

  if (agency.info[0].languagesWithoutPriorNotice) {
    const withoutNoticeLanguages: string[] = [];
    agency.info[0].languagesWithoutPriorNotice.forEach((language) => {
      withoutNoticeLanguages.push(language);
    });

    const withoutNotice = form.getTextField(
      'Can any languages be provided with prior notice If so list'
    );
    withoutNotice.setText(withoutNoticeLanguages.join(', '));
  }

  if (agency.info[0].accessibilityADA) {
    const ada = form.getTextField('Americans with Disabilities Act ADA Yes');
    ada.setText('X');
  } else {
    const ada = form.getTextField('No_3');
    ada.setText('X');
  }

  if (agency.info[0].regularHoursOpening) {
    const hours = form.getTextField('Regular Office Hours');
    hours.setText(agency.info[0].regularHoursOpening);
  }

  if (agency.info[0].regularHoursClosing) {
    const hours = form.getTextField('am  pm to');
    hours.setText(agency.info[0].regularHoursClosing);
  }

  const regularDaysOpen: string[] = [];
  agency.info[0].regularDaysOpen.forEach((day) => {
    regularDaysOpen.push(day);
  });
  const daysOpen = form.getTextField('am  pm Days Mon Tue Wed Thu Fri Sat Sun');
  daysOpen.setText(regularDaysOpen.join(', '));

  if (agency.info[0].updaterContactInfo.name) {
    const updaterName = form.getTextField(
      '11 Person to contact for annual agency update'
    );
    updaterName.setText(agency.info[0].updaterContactInfo.name);
  }

  if (agency.info[0].updaterContactInfo.email) {
    const updaterTitle = form.getTextField('Email');
    updaterTitle.setText(agency.info[0].updaterContactInfo.email);
  }

  if (agency.info[0].updaterContactInfo.hideFromWebsite) {
    const hide = form.getTextField(
      'Would you like this informationto be hidden from the website'
    );
    hide.setText('X');
  }

  // Adding Services
  if (agency.info[0].services && agency.info[0].services[0]) {
    const fullDescription = form.getTextField('Full Description 1');
    fullDescription.setText(agency.info[0].services[0].fullDescription);

    const contactPerson = form.getTextField(
      'question 3 or if contact persons differ by service'
    );
    contactPerson.setText(agency.info[0].services[0].contactPersonName);

    const eligibilityRequirements = form.getTextField(
      'Eligibility Requirements 1'
    );
    eligibilityRequirements.setText(
      agency.info[0].services[0].eligibilityRequirements
    );

    if (agency.info[0].services[0].applicationProcess.includes('Walkin')) {
      const walkin = form.getTextField('Walkin');
      walkin.setText('X');
    }

    if (agency.info[0].services[0].applicationProcess.includes('Telephone')) {
      const telephone = form.getTextField('Telephone');
      telephone.setText('X');
    }

    if (
      agency.info[0].services[0].applicationProcess.includes(
        'Call to Schedule Appointment'
      )
    ) {
      const call = form.getTextField('Call to Schedule Appointment');
      call.setText('X');
    }

    if (
      agency.info[0].services[0].applicationProcess.includes('Apply Online')
    ) {
      const online = form.getTextField('Apply Online');
      online.setText('X');
    }

    const applicationOthers: string[] = [];
    agency.info[0].services[0].applicationProcess.forEach((process) => {
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

    const applicationOthersField = form.getTextField('Other_5');
    applicationOthersField.setText(applicationOthers.join(', '));

    if (agency.info[0].services[0].applicationProcessReferralRequiredByWhom) {
      const referral = form.getTextField('Referral Required By Whom');
      referral.setText(
        agency.info[0].services[0].applicationProcessReferralRequiredByWhom
      );
    }

    switch (agency.info[0].services[0].feeCategory) {
      case 'No Fee':
        const noFee = form.getTextField('No Fee');
        noFee.setText('X');
        break;
      case 'Sliding Scale':
        const sliding = form.getTextField('Sliding Scale Fee');
        sliding.setText('X');
        break;
      case 'Income Based':
        break;
      case 'Fee':
        const fee = form.getTextField('Straight Free please specify');
        fee.setText(agency.info[0].services[0].feeStraightFeeAmount);
        break;
      case 'Insurance: Medicaid/TennCare':
        const medicaid = form.getTextField('Insurance MedicaidTennCare');
        medicaid.setText('X');
        break;
      case 'Insurance: Medicare':
        const medicare = form.getTextField('Medicare');
        medicare.setText('X');
        break;
      case 'Insurance: Private':
        const _private = form.getTextField('Private');
        _private.setText('X');
        break;
    }

    const documents: string[] = [];

    agency.info[0].services[0].requiredDocuments.forEach((document) => {
      switch (document) {
        case 'State Issued I.D.':
          const stateId = form.getTextField('State Issued ID');
          stateId.setText('X');
          break;
        case 'Social Security Card':
          const socialSecurity = form.getTextField('Social Security Card');
          socialSecurity.setText('X');
          break;
        case 'Proof of Residence':
          const proofOfResidence = form.getTextField('Residence');
          proofOfResidence.setText('X');
          break;
        case 'Proof of Income':
          const proofOfIncome = form.getTextField('Proof of Income');
          proofOfIncome.setText('X');
          break;
        case 'Birth Certificate':
          const birthCertificate = form.getTextField('Birth Certificate');
          birthCertificate.setText('X');
          break;
        case 'Medical Records':
          const medicalRecords = form.getTextField('Medical Records');
          medicalRecords.setText('X');
          break;
        case 'Psych Records':
          const psychRecords = form.getTextField('Records');
          psychRecords.setText('X');
          break;
        case 'Proof of Need':
          const proofOfNeed = form.getTextField('Proof of Need');
          proofOfNeed.setText('X');
          break;
        case 'Utility Bill':
          const utilityBill = form.getTextField('Utility Bill');
          utilityBill.setText('X');
          break;
        case 'Utility Bill Cutoff Notice':
          const utilityBillCutoffNotice = form.getTextField(
            'Utility Bill Cutoff Notice'
          );
          utilityBillCutoffNotice.setText('X');
          break;
        case 'Proof of Citizenship':
          const proofOfCitizenship = form.getTextField('Proof of Citizenship');
          proofOfCitizenship.setText('X');
          break;
        case 'Proof of Public Assistance':
          const proofOfPublicAssistance = form.getTextField(
            'Proof of Public Assistance'
          );
          proofOfPublicAssistance.setText('X');
          break;
        case 'Drivers License':
          const driversLicense = form.getTextField('Drivers License_2');
          driversLicense.setText('X');
        default:
          documents.push(document);
          break;
      }
    });

    const otherDocuments = form.getTextField('Other Specify');
    otherDocuments.setText(documents.join(', '));
  }

  // Service 2
  if (agency.info[0].services && agency.info[0].services[1]) {
    const fullDescription = form.getTextField('Full Description 1_2');
    fullDescription.setText(agency.info[0].services[1].fullDescription);

    const contactPerson = form.getTextField(
      'question 3 or if contacts differ by service'
    );
    contactPerson.setText(agency.info[0].services[1].contactPersonName);

    const eligibilityRequirements = form.getTextField(
      'Eligibility Requirements 1_2'
    );
    eligibilityRequirements.setText(
      agency.info[0].services[1].eligibilityRequirements
    );

    if (agency.info[0].services[1].applicationProcess.includes('Walkin')) {
      const walkin = form.getTextField('Walkin_2');
      walkin.setText('X');
    }

    if (agency.info[0].services[1].applicationProcess.includes('Telephone')) {
      const telephone = form.getTextField('Telephone_2');
      telephone.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes(
        'Call to Schedule Appointment'
      )
    ) {
      const call = form.getTextField('Call to Schedule Appointment_2');
      call.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes('Apply Online')
    ) {
      const online = form.getTextField('Apply Online_2');
      online.setText('X');
    }

    const applicationOthers: string[] = [];
    agency.info[0].services[1].applicationProcess.forEach((process) => {
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

    const applicationOthersField = form.getTextField('Other_6');
    applicationOthersField.setText(applicationOthers.join(', '));

    if (agency.info[0].services[1].applicationProcessReferralRequiredByWhom) {
      const referral = form.getTextField('Referral Required By Whom_2');
      referral.setText(
        agency.info[0].services[1].applicationProcessReferralRequiredByWhom
      );
    }

    switch (agency.info[0].services[1].feeCategory) {
      case 'No Fee':
        const noFee = form.getTextField('No Fee_2');
        noFee.setText('X');
        break;
      case 'Sliding Scale':
        const sliding = form.getTextField('Sliding Scale Fee_2');
        sliding.setText('X');
        break;
      case 'Income Based':
        break;
      case 'Fee':
        const fee = form.getTextField('Straight Free please specify_2');
        fee.setText(agency.info[0].services[1].feeStraightFeeAmount);
        break;
      case 'Insurance: Medicaid/TennCare':
        const medicaid = form.getTextField('Insurance MedicaidTennCare_2');
        medicaid.setText('X');
        break;
      case 'Insurance: Medicare':
        const medicare = form.getTextField('Medicare_2');
        medicare.setText('X');
        break;
      case 'Insurance: Private':
        const _private = form.getTextField('Private_2');
        _private.setText('X');
        break;
    }

    const documents: string[] = [];

    agency.info[0].services[1].requiredDocuments.forEach((document) => {
      switch (document) {
        case 'State Issued I.D.':
          const stateId = form.getTextField('State Issued ID_2');
          stateId.setText('X');
          break;
        case 'Social Security Card':
          const socialSecurity = form.getTextField('Social Security Card_2');
          socialSecurity.setText('X');
          break;
        case 'Proof of Residence':
          const proofOfResidence = form.getTextField('Residence_2');
          proofOfResidence.setText('X');
          break;
        case 'Proof of Income':
          const proofOfIncome = form.getTextField('Proof of Income_2');
          proofOfIncome.setText('X');
          break;
        case 'Birth Certificate':
          const birthCertificate = form.getTextField('Birth Certificate_2');
          birthCertificate.setText('X');
          break;
        case 'Medical Records':
          const medicalRecords = form.getTextField('Medical Records_2');
          medicalRecords.setText('X');
          break;
        case 'Psych Records':
          const psychRecords = form.getTextField('Records_2');
          psychRecords.setText('X');
          break;
        case 'Proof of Need':
          const proofOfNeed = form.getTextField('Proof of Need_2');
          proofOfNeed.setText('X');
          break;
        case 'Utility Bill':
          const utilityBill = form.getTextField('Utility Bill_2');
          utilityBill.setText('X');
          break;
        case 'Utility Bill Cutoff Notice':
          const utilityBillCutoffNotice = form.getTextField(
            'Utility Bill Cutoff Notice_2'
          );
          utilityBillCutoffNotice.setText('X');
          break;
        case 'Proof of Citizenship':
          const proofOfCitizenship = form.getTextField(
            'Proof of Citizenship_2'
          );
          proofOfCitizenship.setText('X');
          break;
        case 'Proof of Public Assistance':
          const proofOfPublicAssistance = form.getTextField(
            'Proof of Public Assistance_2'
          );
          proofOfPublicAssistance.setText('X');
          break;
        case 'Drivers License':
          const driversLicense = form.getTextField('Drivers License_2');
          driversLicense.setText('X');
        default:
          documents.push(document);
          break;
      }
    });

    const otherDocuments = form.getTextField('Other Specify_2');
    otherDocuments.setText(documents.join(', '));
  }

  // Service 3
  if (agency.info[0].services && agency.info[0].services[1]) {
    const fullDescription = form.getTextField('Full Description 1_3');
    fullDescription.setText(agency.info[0].services[1].fullDescription);

    const contactPerson = form.getTextField(
      'question 3 or if contacts differ by service_2'
    );
    contactPerson.setText(agency.info[0].services[1].contactPersonName);

    const eligibilityRequirements = form.getTextField(
      'Eligibility Requirements 1_3'
    );
    eligibilityRequirements.setText(
      agency.info[0].services[1].eligibilityRequirements
    );

    if (agency.info[0].services[1].applicationProcess.includes('Walkin')) {
      const walkin = form.getTextField('Walkin_3');
      walkin.setText('X');
    }

    if (agency.info[0].services[1].applicationProcess.includes('Telephone')) {
      const telephone = form.getTextField('Telephone_3');
      telephone.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes(
        'Call to Schedule Appointment'
      )
    ) {
      const call = form.getTextField('Call to Schedule Appointment_3');
      call.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes('Apply Online')
    ) {
      const online = form.getTextField('Apply Online_3');
      online.setText('X');
    }

    const applicationOthers: string[] = [];
    agency.info[0].services[1].applicationProcess.forEach((process) => {
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

    const applicationOthersField = form.getTextField('Other_6');
    applicationOthersField.setText(applicationOthers.join(', '));

    if (agency.info[0].services[1].applicationProcessReferralRequiredByWhom) {
      const referral = form.getTextField('Referral Required By Whom_3');
      referral.setText(
        agency.info[0].services[1].applicationProcessReferralRequiredByWhom
      );
    }

    switch (agency.info[0].services[1].feeCategory) {
      case 'No Fee':
        const noFee = form.getTextField('No Fee_3');
        noFee.setText('X');
        break;
      case 'Sliding Scale':
        const sliding = form.getTextField('Sliding Scale Fee_3');
        sliding.setText('X');
        break;
      case 'Income Based':
        break;
      case 'Fee':
        const fee = form.getTextField('Straight Free please specify_3');
        fee.setText(agency.info[0].services[1].feeStraightFeeAmount);
        break;
      case 'Insurance: Medicaid/TennCare':
        const medicaid = form.getTextField('Insurance MedicaidTennCare_3');
        medicaid.setText('X');
        break;
      case 'Insurance: Medicare':
        const medicare = form.getTextField('Medicare_3');
        medicare.setText('X');
        break;
      case 'Insurance: Private':
        const _private = form.getTextField('Private_3');
        _private.setText('X');
        break;
    }

    const documents: string[] = [];

    agency.info[0].services[1].requiredDocuments.forEach((document) => {
      switch (document) {
        case 'State Issued I.D.':
          const stateId = form.getTextField('State Issued ID_3');
          stateId.setText('X');
          break;
        case 'Social Security Card':
          const socialSecurity = form.getTextField('Social Security Card_3');
          socialSecurity.setText('X');
          break;
        case 'Proof of Residence':
          const proofOfResidence = form.getTextField('Residence_3');
          proofOfResidence.setText('X');
          break;
        case 'Proof of Income':
          const proofOfIncome = form.getTextField('Proof of Income_3');
          proofOfIncome.setText('X');
          break;
        case 'Birth Certificate':
          const birthCertificate = form.getTextField('Birth Certificate_3');
          birthCertificate.setText('X');
          break;
        case 'Medical Records':
          const medicalRecords = form.getTextField('Medical Records_3');
          medicalRecords.setText('X');
          break;
        case 'Psych Records':
          const psychRecords = form.getTextField('Records_3');
          psychRecords.setText('X');
          break;
        case 'Proof of Need':
          const proofOfNeed = form.getTextField('Proof of Need_3');
          proofOfNeed.setText('X');
          break;
        case 'Utility Bill':
          const utilityBill = form.getTextField('Utility Bill_3');
          utilityBill.setText('X');
          break;
        case 'Utility Bill Cutoff Notice':
          const utilityBillCutoffNotice = form.getTextField(
            'Utility Bill Cutoff Notice_3'
          );
          utilityBillCutoffNotice.setText('X');
          break;
        case 'Proof of Citizenship':
          const proofOfCitizenship = form.getTextField(
            'Proof of Citizenship_3'
          );
          proofOfCitizenship.setText('X');
          break;
        case 'Proof of Public Assistance':
          const proofOfPublicAssistance = form.getTextField(
            'Proof of Public Assistance_3'
          );
          proofOfPublicAssistance.setText('X');
          break;
        case 'Drivers License':
          const driversLicense = form.getTextField('Drivers License_3');
          driversLicense.setText('X');
        default:
          documents.push(document);
          break;
      }
    });

    const otherDocuments = form.getTextField('Other Specify_3');
    otherDocuments.setText(documents.join(', '));
  }

  // Service 4
  if (agency.info[0].services && agency.info[0].services[1]) {
    const fullDescription = form.getTextField('Full Description 1_4');
    fullDescription.setText(agency.info[0].services[1].fullDescription);

    const contactPerson = form.getTextField(
      'question 3 or if contacts differ by service_3'
    );
    contactPerson.setText(agency.info[0].services[1].contactPersonName);

    const eligibilityRequirements = form.getTextField(
      'Eligibility Requirements 1_4'
    );
    eligibilityRequirements.setText(
      agency.info[0].services[1].eligibilityRequirements
    );

    if (agency.info[0].services[1].applicationProcess.includes('Walkin')) {
      const walkin = form.getTextField('Walkin_4');
      walkin.setText('X');
    }

    if (agency.info[0].services[1].applicationProcess.includes('Telephone')) {
      const telephone = form.getTextField('Telephone_4');
      telephone.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes(
        'Call to Schedule Appointment'
      )
    ) {
      const call = form.getTextField('Call to Schedule Appointment_4');
      call.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes('Apply Online')
    ) {
      const online = form.getTextField('Apply Online_4');
      online.setText('X');
    }

    const applicationOthers: string[] = [];
    agency.info[0].services[1].applicationProcess.forEach((process) => {
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

    const applicationOthersField = form.getTextField('Other_6');
    applicationOthersField.setText(applicationOthers.join(', '));

    if (agency.info[0].services[1].applicationProcessReferralRequiredByWhom) {
      const referral = form.getTextField('Referral Required By Whom_4');
      referral.setText(
        agency.info[0].services[1].applicationProcessReferralRequiredByWhom
      );
    }

    switch (agency.info[0].services[1].feeCategory) {
      case 'No Fee':
        const noFee = form.getTextField('No Fee_4');
        noFee.setText('X');
        break;
      case 'Sliding Scale':
        const sliding = form.getTextField('Sliding Scale Fee_4');
        sliding.setText('X');
        break;
      case 'Income Based':
        break;
      case 'Fee':
        const fee = form.getTextField('Straight Free please specify_4');
        fee.setText(agency.info[0].services[1].feeStraightFeeAmount);
        break;
      case 'Insurance: Medicaid/TennCare':
        const medicaid = form.getTextField('Insurance MedicaidTennCare_4');
        medicaid.setText('X');
        break;
      case 'Insurance: Medicare':
        const medicare = form.getTextField('Medicare_4');
        medicare.setText('X');
        break;
      case 'Insurance: Private':
        const _private = form.getTextField('Private_4');
        _private.setText('X');
        break;
    }

    const documents: string[] = [];

    agency.info[0].services[1].requiredDocuments.forEach((document) => {
      switch (document) {
        case 'State Issued I.D.':
          const stateId = form.getTextField('State Issued ID_4');
          stateId.setText('X');
          break;
        case 'Social Security Card':
          const socialSecurity = form.getTextField('Social Security Card_4');
          socialSecurity.setText('X');
          break;
        case 'Proof of Residence':
          const proofOfResidence = form.getTextField('Residence_4');
          proofOfResidence.setText('X');
          break;
        case 'Proof of Income':
          const proofOfIncome = form.getTextField('Proof of Income_4');
          proofOfIncome.setText('X');
          break;
        case 'Birth Certificate':
          const birthCertificate = form.getTextField('Birth Certificate_4');
          birthCertificate.setText('X');
          break;
        case 'Medical Records':
          const medicalRecords = form.getTextField('Medical Records_4');
          medicalRecords.setText('X');
          break;
        case 'Psych Records':
          const psychRecords = form.getTextField('Records_4');
          psychRecords.setText('X');
          break;
        case 'Proof of Need':
          const proofOfNeed = form.getTextField('Proof of Need_4');
          proofOfNeed.setText('X');
          break;
        case 'Utility Bill':
          const utilityBill = form.getTextField('Utility Bill_4');
          utilityBill.setText('X');
          break;
        case 'Utility Bill Cutoff Notice':
          const utilityBillCutoffNotice = form.getTextField(
            'Utility Bill Cutoff Notice_4'
          );
          utilityBillCutoffNotice.setText('X');
          break;
        case 'Proof of Citizenship':
          const proofOfCitizenship = form.getTextField(
            'Proof of Citizenship_4'
          );
          proofOfCitizenship.setText('X');
          break;
        case 'Proof of Public Assistance':
          const proofOfPublicAssistance = form.getTextField(
            'Proof of Public Assistance_4'
          );
          proofOfPublicAssistance.setText('X');
          break;
        case 'Drivers License':
          const driversLicense = form.getTextField('Drivers License_4');
          driversLicense.setText('X');
        default:
          documents.push(document);
          break;
      }
    });

    const otherDocuments = form.getTextField('Other Specify_4');
    otherDocuments.setText(documents.join(', '));
  }

  // Service 5
  if (agency.info[0].services && agency.info[0].services[1]) {
    const fullDescription = form.getTextField('Full Description 1_5');
    fullDescription.setText(agency.info[0].services[1].fullDescription);

    const contactPerson = form.getTextField(
      'question 3 or if contacts differ by service_4'
    );
    contactPerson.setText(agency.info[0].services[1].contactPersonName);

    const eligibilityRequirements = form.getTextField(
      'Eligibility Requirements 1_5'
    );
    eligibilityRequirements.setText(
      agency.info[0].services[1].eligibilityRequirements
    );

    if (agency.info[0].services[1].applicationProcess.includes('Walkin')) {
      const walkin = form.getTextField('Walkin_5');
      walkin.setText('X');
    }

    if (agency.info[0].services[1].applicationProcess.includes('Telephone')) {
      const telephone = form.getTextField('Telephone_5');
      telephone.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes(
        'Call to Schedule Appointment'
      )
    ) {
      const call = form.getTextField('Call to Schedule Appointment_5');
      call.setText('X');
    }

    if (
      agency.info[0].services[1].applicationProcess.includes('Apply Online')
    ) {
      const online = form.getTextField('Apply Online_5');
      online.setText('X');
    }

    const applicationOthers: string[] = [];
    agency.info[0].services[1].applicationProcess.forEach((process) => {
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

    const applicationOthersField = form.getTextField('Other_6');
    applicationOthersField.setText(applicationOthers.join(', '));

    if (agency.info[0].services[1].applicationProcessReferralRequiredByWhom) {
      const referral = form.getTextField('Referral Required By Whom_5');
      referral.setText(
        agency.info[0].services[1].applicationProcessReferralRequiredByWhom
      );
    }

    switch (agency.info[0].services[1].feeCategory) {
      case 'No Fee':
        const noFee = form.getTextField('No Fee_5');
        noFee.setText('X');
        break;
      case 'Sliding Scale':
        const sliding = form.getTextField('Sliding Scale Fee_5');
        sliding.setText('X');
        break;
      case 'Income Based':
        break;
      case 'Fee':
        const fee = form.getTextField('Straight Free please specify_5');
        fee.setText(agency.info[0].services[1].feeStraightFeeAmount);
        break;
      case 'Insurance: Medicaid/TennCare':
        const medicaid = form.getTextField('Insurance MedicaidTennCare_5');
        medicaid.setText('X');
        break;
      case 'Insurance: Medicare':
        const medicare = form.getTextField('Medicare_5');
        medicare.setText('X');
        break;
      case 'Insurance: Private':
        const _private = form.getTextField('Private_5');
        _private.setText('X');
        break;
    }

    const documents: string[] = [];

    agency.info[0].services[1].requiredDocuments.forEach((document) => {
      switch (document) {
        case 'State Issued I.D.':
          const stateId = form.getTextField('State Issued ID_5');
          stateId.setText('X');
          break;
        case 'Social Security Card':
          const socialSecurity = form.getTextField('Social Security Card_5');
          socialSecurity.setText('X');
          break;
        case 'Proof of Residence':
          const proofOfResidence = form.getTextField('Residence_5');
          proofOfResidence.setText('X');
          break;
        case 'Proof of Income':
          const proofOfIncome = form.getTextField('Proof of Income_5');
          proofOfIncome.setText('X');
          break;
        case 'Birth Certificate':
          const birthCertificate = form.getTextField('Birth Certificate_5');
          birthCertificate.setText('X');
          break;
        case 'Medical Records':
          const medicalRecords = form.getTextField('Medical Records_5');
          medicalRecords.setText('X');
          break;
        case 'Psych Records':
          const psychRecords = form.getTextField('Records_5');
          psychRecords.setText('X');
          break;
        case 'Proof of Need':
          const proofOfNeed = form.getTextField('Proof of Need_5');
          proofOfNeed.setText('X');
          break;
        case 'Utility Bill':
          const utilityBill = form.getTextField('Utility Bill_5');
          utilityBill.setText('X');
          break;
        case 'Utility Bill Cutoff Notice':
          const utilityBillCutoffNotice = form.getTextField(
            'Utility Bill Cutoff Notice_5'
          );
          utilityBillCutoffNotice.setText('X');
          break;
        case 'Proof of Citizenship':
          const proofOfCitizenship = form.getTextField(
            'Proof of Citizenship_5'
          );
          proofOfCitizenship.setText('X');
          break;
        case 'Proof of Public Assistance':
          const proofOfPublicAssistance = form.getTextField(
            'Proof of Public Assistance_5'
          );
          proofOfPublicAssistance.setText('X');
          break;
        case 'Drivers License':
          const driversLicense = form.getTextField('Drivers License_5');
          driversLicense.setText('X');
        default:
          documents.push(document);
          break;
      }
    });

    const otherDocuments = form.getTextField('Other Specify_5');
    otherDocuments.setText(documents.join(', '));
  }

  if (
    agency.info[0].volunteerOpportunities &&
    agency.info[0].volunteerOpportunities === true
  ) {
    const volunteers = form.getTextField(
      'does your organiztion accept volunteers Yes'
    );
    volunteers.setText('X');
  } else {
    const volunteers = form.getTextField('No_4');
    volunteers.setText('X');
  }

  if (agency.info[0].volunteerOpportunitiesEligibility) {
    const eligibilityRequirements = form.getTextField(
      'checks other requirements for your volunteers 1'
    );
    eligibilityRequirements.setText(
      agency.info[0].volunteerOpportunitiesEligibility
    );
  }

  if (agency.info[0].volunteerCoordinatorContactInfo) {
    const contactName = form.getTextField('Volunteer Coordinator');
    contactName.setText(agency.info[0].volunteerCoordinatorContactInfo.name);

    const contactPhone = form.getTextField('Phone');
    contactPhone.setText(
      agency.info[0].volunteerCoordinatorContactInfo.phoneNumber
    );
  }

  if (agency.info[0].donations) {
    const donations = form.getTextField('If yes please list');
    donations.setText(agency.info[0].donations.join(', '));
  }

  if (agency.info[0].donationCoordinatorContactInfo) {
    const contactName = form.getTextField('Donation Coordinator');
    contactName.setText(agency.info[0].donationCoordinatorContactInfo.name);

    const contactPhone = form.getTextField('Phone_2');
    contactPhone.setText(
      agency.info[0].donationCoordinatorContactInfo.phoneNumber
    );
  }

  if (agency.info[0].recommendedAgencies) {
    const recommendedAgencies = form.getTextField('agneciesservices 1');
    recommendedAgencies.setText(agency.info[0].recommendedAgencies);
  }

  return pdfDoc.save();
}
