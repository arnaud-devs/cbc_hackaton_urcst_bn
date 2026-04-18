import Joi from "joi";

// Schedule validation for each day
const dayScheduleSchema = Joi.object({
  open: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(), // HH:MM format
  close: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(), // HH:MM format
});

// Full schedule validation for all days of the week
const scheduleSchema = Joi.object({
  monday: dayScheduleSchema.allow(null),
  tuesday: dayScheduleSchema.allow(null),
  wednesday: dayScheduleSchema.allow(null),
  thursday: dayScheduleSchema.allow(null),
  friday: dayScheduleSchema.allow(null),
  saturday: dayScheduleSchema.allow(null),
  sunday: dayScheduleSchema.allow(null),
}).required();

// Service validation
const serviceSchema = Joi.object({
  name: Joi.string().required(),
  fee: Joi.string().required(),
});

export const postClinicSchema = Joi.object({
  name: Joi.string().required(),
  schedule: scheduleSchema,
  address: Joi.string().required(),
  phone: Joi.string().required(),
  description: Joi.string().required(),
  services: Joi.array().items(serviceSchema).min(1).required(),
}).required();

export const patchClinicSchema = Joi.object({
  name: Joi.string().optional(),
  schedule: scheduleSchema.optional(),
  address: Joi.string().optional(),
  phone: Joi.string().optional(),
  description: Joi.string().optional(),
  services: Joi.array().items(serviceSchema).min(1).optional(),
}).optional();
