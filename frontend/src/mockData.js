const mockPatients = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      age: 30,
      sex: true,
      cancer_samples: [
        {
          id: 1,
          organ_type: 'Lung',
          patient_cohort: 'Cohort 1',
          sample_origin: 'Origin 1',
          markers_JSON: '{}',
        },
        {
          id: 2,
          organ_type: 'Breast',
          patient_cohort: 'Cohort 2',
          sample_origin: 'Origin 2',
          markers_JSON: '{}',
        },
      ],
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Doe',
      age: 32,
      sex: false,
      cancer_samples: [
        {
          id: 3,
          organ_type: 'Liver',
          patient_cohort: 'Cohort 3',
          sample_origin: 'Origin 3',
          markers_JSON: '{}',
        },
        {
          id: 4,
          organ_type: 'Pancreas',
          patient_cohort: 'Cohort 4',
          sample_origin: 'Origin 4',
          markers_JSON: '{}',
        },
      ],
    },
    {
      id: 3,
      name: 'Alice',
      surname: 'Smith',
      age: 28,
      sex: false,
      cancer_samples: [
        {
          id: 5,
          organ_type: 'Lung',
          patient_cohort: 'Cohort 5',
          sample_origin: 'Origin 5',
          markers_JSON: '{}',
        },
        {
          id: 6,
          organ_type: 'Colon',
          patient_cohort: 'Cohort 6',
          sample_origin: 'Origin 6',
          markers_JSON: '{}',
        },
      ],
    },
    {
      id: 4,
      name: 'Bob',
      surname: 'Johnson',
      age: 35,
      sex: true,
      cancer_samples: [
        {
          id: 7,
          organ_type: 'Lung',
          patient_cohort: 'Cohort 7',
          sample_origin: 'Origin 7',
          markers_JSON: '{}',
        },
        {
          id: 8,
          organ_type: 'Kidney',
          patient_cohort: 'Cohort 8',
          sample_origin: 'Origin 8',
          markers_JSON: '{}',
        },
      ],
    },
    {
        id: 5,
        name: 'Charlie',
        surname: 'Brown',
        age: 40,
        sex: true,
        cancer_samples: [
            {
            id: 9,
            organ_type: 'Stomach',
            patient_cohort: 'Cohort 9',
            sample_origin: 'Origin 9',
            markers_JSON: '{}',
            },
            {
            id: 10,
            organ_type: 'Esophagus',
            patient_cohort: 'Cohort 10',
            sample_origin: 'Origin 10',
            markers_JSON: '{}',
            },
        ],
    },
    {
        id: 6,
        name: 'Lucy',
        surname: 'Van Pelt',
        age: 38,
        sex: false,
        cancer_samples: [
            {
            id: 11,
            organ_type: 'Breast',
            patient_cohort: 'Cohort 11',
            sample_origin: 'Origin 11',
            markers_JSON: '{}',
            },
            {
            id: 12,
            organ_type: 'Ovary',
            patient_cohort: 'Cohort 12',
            sample_origin: 'Origin 12',
            markers_JSON: '{}',
            },
        ],
    },
    {
        id: 7,
        name: 'Linus',
        surname: 'Van Pelt',
        age: 35,
        sex: true,
        cancer_samples: [
            {
            id: 13,
            organ_type: 'Prostate',
            patient_cohort: 'Cohort 13',
            sample_origin: 'Origin 13',
            markers_JSON: '{}',
            },
            {
            id: 14,
            organ_type: 'Testicle',
            patient_cohort: 'Cohort 14',
            sample_origin: 'Origin 14',
            markers_JSON: '{}',
            },
        ],
    },
    {
        id: 8,
        name: 'Sally',
        surname: 'Brown',
        age: 30,
        sex: false,
        cancer_samples: [
            {
            id: 15,
            organ_type: 'Cervix',
            patient_cohort: 'Cohort 15',
            sample_origin: 'Origin 15',
            markers_JSON: '{}',
            },
            {
            id: 16,
            organ_type: 'Uterus',
            patient_cohort: 'Cohort 16',
            sample_origin: 'Origin 16',
            markers_JSON: '{}',
            },
    ],
    },
    {
        id: 9,
        name: 'Schroeder',
        surname: 'Unknown',
        age: 33,
        sex: true,
        cancer_samples: [
            {
            id: 17,
            organ_type: 'Pancreas',
            patient_cohort: 'Cohort 17',
            sample_origin: 'Origin 17',
            markers_JSON: '{}',
            },
            {
            id: 18,
            organ_type: 'Liver',
            patient_cohort: 'Cohort 18',
            sample_origin: 'Origin 18',
            markers_JSON: '{}',
            },
    ],
    },


  ];

//   console.log(mockPatients);  - printuje wszystko na raz
// przykładowy kod, żeby przejsc po wszytkich pacjentach i ich próbkach i wypisać ich wartości

/*for (let patient of mockPatients) {
    for (let key in patient) {
      if (patient.hasOwnProperty(key)) {
        console.log(key + ": " + patient[key]);
      }
      if (key === 'cancer_samples') {
        for (let sample of patient[key]) {
          for (let sampleKey in sample) {
            if (sample.hasOwnProperty(sampleKey)) {
              console.log(sampleKey + ": " + sample[sampleKey]);
            }
          }
        }
      }
    }
  }*/
export default mockPatients