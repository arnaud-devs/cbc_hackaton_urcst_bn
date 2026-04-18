import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Admin ───────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@2024", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@gencarehub.rw" },
    update: {},
    create: { email: "admin@gencarehub.rw", password: adminPassword, name: "GenCare Admin" },
  });
  console.log(`Admin: ${admin.email}`);

  // ─── Services ─────────────────────────────────────────────────────────────────
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "11111111-1111-1111-1111-111111111111" },
      update: {},
      create: {
        id: "11111111-1111-1111-1111-111111111111",
        name: "HIV/STI Testing & Counseling",
        description: "Confidential testing and counseling for HIV and sexually transmitted infections.",
        durationMinutes: 30,
      },
    }),
    prisma.service.upsert({
      where: { id: "22222222-2222-2222-2222-222222222222" },
      update: {},
      create: {
        id: "22222222-2222-2222-2222-222222222222",
        name: "Family Planning Consultation",
        description: "Expert guidance on contraception methods and reproductive health planning.",
        durationMinutes: 45,
      },
    }),
    prisma.service.upsert({
      where: { id: "33333333-3333-3333-3333-333333333333" },
      update: {},
      create: {
        id: "33333333-3333-3333-3333-333333333333",
        name: "Mental Health Support",
        description: "Private mental health consultations for stress, anxiety, and emotional wellbeing.",
        durationMinutes: 60,
      },
    }),
    prisma.service.upsert({
      where: { id: "44444444-4444-4444-4444-444444444444" },
      update: {},
      create: {
        id: "44444444-4444-4444-4444-444444444444",
        name: "General Health Check-up",
        description: "Comprehensive general health assessment and preventive care consultation.",
        durationMinutes: 30,
      },
    }),
  ]);
  console.log(`Services: ${services.map((s) => s.name).join(", ")}`);

  // ─── Doctors ──────────────────────────────────────────────────────────────────
  const doctorPassword = await bcrypt.hash("Doctor@2024", 10);

  const doctors = await Promise.all([
    prisma.doctor.upsert({
      where: { email: "alice.uwimana@gencarehub.rw" },
      update: {},
      create: {
        email: "alice.uwimana@gencarehub.rw",
        password: doctorPassword,
        name: "Dr. Alice Uwimana",
        specialty: "HIV/AIDS & Infectious Diseases",
        languages: ["English", "Kinyarwanda", "French"],
        phone: "+250788000001",
      },
    }),
    prisma.doctor.upsert({
      where: { email: "bob.niyonzima@gencarehub.rw" },
      update: {},
      create: {
        email: "bob.niyonzima@gencarehub.rw",
        password: doctorPassword,
        name: "Dr. Bob Niyonzima",
        specialty: "Psychiatry & Mental Health",
        languages: ["French", "Kinyarwanda"],
        phone: "+250788000002",
      },
    }),
    prisma.doctor.upsert({
      where: { email: "carol.gasana@gencarehub.rw" },
      update: {},
      create: {
        email: "carol.gasana@gencarehub.rw",
        password: doctorPassword,
        name: "Dr. Carol Gasana",
        specialty: "General Practice & Reproductive Health",
        languages: ["English", "French", "Kinyarwanda"],
        phone: "+250788000003",
      },
    }),
  ]);
  console.log(`Doctors: ${doctors.map((d) => d.name).join(", ")}`);

  console.log("Seeding complete.");
  console.log("\nAdmin credentials:  admin@gencarehub.rw / Admin@2024");
  console.log("Doctor credentials: <email above> / Doctor@2024");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
