import { Request, Response } from "express";
import {
  createClinic,
  fetchClinic,
  fetchClinics,
  updateClinic,
  deleteClinic,
} from "../services";

// Create new clinic
export const postClinic = async (req: Request, res: Response) => {
  try {
    const data = req.body ?? {};

    const newClinic = await createClinic({ data });

    res.status(201).json({
      status: "success",
      message: "Clinic created successfully",
      data: newClinic,
    });
    return;
  } catch (error) {
    throw error;
  }
};

// Fetch all clinics
export const getClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await fetchClinics();

    res.status(200).json({
      status: "success",
      message: "Clinics retrieved successfully",
      data: clinics,
    });
  } catch (error) {
    throw error;
  }
};

// Fetch a clinic
export const getClinic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const clinic = await fetchClinic({ id });

    res.status(200).json({
      status: "success",
      message: "Clinic retrieved successfully",
      data: clinic,
    });
    return;
  } catch (error) {
    throw error;
  }
};

// Update a clinic
export const patchClinic = async (req: Request, res: Response) => {
  try {
    const data = req.body ?? {};
    const { id } = req.params;

    const updatedClinic = await updateClinic({ id, data });

    res.status(200).json({
      status: "success",
      message: "Clinic updated successfully",
      data: updatedClinic,
    });

    return;
  } catch (error) {
    throw error;
  }
};

// Delete a clinic
export const removeClinic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await deleteClinic({ id });

    res.status(200).json({
      status: "success",
      message: "Clinic deleted successfully",
      data: result,
    });

    return;
  } catch (error) {
    throw error;
  }
};
