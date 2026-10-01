import { z } from "zod";

// Rules intentionally mirror the backend Zod schemas (auth/shipment/hub/user validation).
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    phone: z.string().optional(),
    role: z.enum(["CUSTOMER", "COURIER"]),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const shipmentSchema = z.object({
  pickupAddress: z.string().min(3, "Pickup address must be at least 3 characters"),
  deliveryAddress: z.string().min(3, "Delivery address must be at least 3 characters"),
  originHubId: z.string().optional(),
  destinationHubId: z.string().optional(),
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z.string().min(6, "Phone number must be at least 6 characters"),
  packageWeightKg: z
    .number({ invalid_type_error: "Enter the weight in kg" })
    .positive("Weight must be greater than 0")
    .max(500, "Maximum supported weight is 500 kg"),
  isFragile: z.boolean(),
  packageDesc: z.string().max(300, "Keep the description under 300 characters").optional(),
});
export type ShipmentValues = z.infer<typeof shipmentSchema>;

export const shipmentEditSchema = z.object({
  pickupAddress: z.string().min(3, "Pickup address must be at least 3 characters"),
  deliveryAddress: z.string().min(3, "Delivery address must be at least 3 characters"),
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z.string().min(6, "Phone number must be at least 6 characters"),
  packageDesc: z.string().max(300, "Keep the description under 300 characters").optional(),
});
export type ShipmentEditValues = z.infer<typeof shipmentEditSchema>;

export const hubSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  address: z.string().min(3, "Address must be at least 3 characters"),
});
export type HubValues = z.infer<typeof hubSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const statusUpdateSchema = z.object({
  status: z.string().min(1, "Choose the next status"),
  note: z.string().max(200, "Keep the note under 200 characters").optional(),
});
export type StatusUpdateValues = z.infer<typeof statusUpdateSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell us your name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const priceSchema = z.object({
  weight: z.number({ invalid_type_error: "Enter the weight in kg" }).positive("Weight must be greater than 0").max(500, "Maximum 500 kg"),
  fragile: z.boolean(),
});
export type PriceValues = z.infer<typeof priceSchema>;
