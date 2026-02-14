export const studentDetailsMock = {
  student: {
    fullName: "Mahfuz Rahman",
    roll: "2602001",
    certificateId: "ECITC-2026-001",
    status: "PAID" as "PAID" | "DUE",
    phone: "01812-123456",
    email: "mahfuz@example.com",
    gender: "MALE",
    dateOfBirth: "2004-06-12",
    nidOrBirthId: "19990123456789012",
    presentAddress: "Mirpur, Dhaka",
    photoUrl: "/ridoy-saha.png", // https://images.unsplash.com/photo-1520975958225-3f61d42b47d9?auto=format&fit=crop&w=400&q=80
    admission: {
      courseName: "Office Application",
      admissionDate: "2026-02-03",
      admissionFee: 3500,
    },
    guardian: {
      name: "Abdul Rahman",
      relation: "Father",
      phone: "01711-888777",
      occupation: "Business",
      address: "Mirpur, Dhaka",
    },
    academic: {
      qualification: "HSC",
      passingYear: "2024",
      instituteName: "Dhaka College",
    },
  },

  enrollments: [
    {
      id: "en_001",
      courseName: "Office Application",
      batch: "Batch A",
      startDate: "2026-02-03",
      status: "RUNNING" as "RUNNING" | "COMPLETED",
    },
    {
      id: "en_002",
      courseName: "Graphic Design",
      batch: "Batch C",
      startDate: "2026-05-01",
      status: "COMPLETED" as "RUNNING" | "COMPLETED",
    },
  ],
};
