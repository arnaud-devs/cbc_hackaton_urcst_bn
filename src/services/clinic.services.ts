import { prisma } from "../database/client";
import { validate as isUuid } from "uuid";
import { CustomError } from "../utils/CustomError";

interface IClinicPayload {
  name: string;
  schedule: Record<string, { open: string; close: string } | null>;
  address: string;
  phone: string;
  description: string;
  services: Array<{ name: string; fee: string }>;
}

export const createClinic = async ({ data }: { data: IClinicPayload }) => {
  try {
    const { name, schedule, address, phone, description, services } = data;

    const newClinic = await prisma.clinic.create({
      data: {
        name,
        schedule,
        address,
        phone,
        description,
        services,
      },
    });

    return newClinic;
  } catch (error) {
    throw error;
  }
};

export const fetchClinics = async () => {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { createdAt: "desc" },
    });

    return clinics;
  } catch (error) {
    throw error;
  }
};

export const fetchClinic = async ({ id }: { id: string }) => {
  try {
    if (!isUuid(id)) {
      throw new CustomError(
        "Invalid uuid format",
        400,
        `id:${id} must be valid uuid`,
      );
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id },
    });

    if (!clinic) {
      throw new CustomError(
        "Clinic not found",
        404,
        `Clinic with id:${id} not found`,
      );
    }

    return clinic;
  } catch (error) {
    throw error;
  }
};

export const updateClinic = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<IClinicPayload>;
}) => {
  try {
    if (!isUuid(id)) {
      throw new CustomError(
        "Invalid uuid format",
        400,
        `id:${id} must be valid uuid`,
      );
    }

    // Check if clinic exists first
    const existingClinic = await prisma.clinic.findUnique({
      where: { id },
    });

    if (!existingClinic) {
      throw new CustomError(
        "Clinic not found",
        404,
        `Clinic with id:${id} not found`,
      );
    }

    const updatedClinic = await prisma.clinic.update({
      where: { id },
      data,
    });

    return updatedClinic;
  } catch (error) {
    throw error;
  }
};

export const deleteClinic = async ({ id }: { id: string }) => {
  try {
    if (!isUuid(id)) {
      throw new CustomError(
        "Invalid uuid format",
        400,
        `id:${id} must be valid uuid`,
      );
    }

    // Check if clinic exists first
    const existingClinic = await prisma.clinic.findUnique({
      where: { id },
    });

    if (!existingClinic) {
      throw new CustomError(
        "Clinic not found",
        404,
        `Clinic with id:${id} not found`,
      );
    }

    await prisma.clinic.delete({
      where: { id },
    });

    return { message: "Clinic deleted successfully" };
  } catch (error) {
    throw error;
  }
};
