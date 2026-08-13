import { z } from "zod";

export const createConversationSchema = z.object({
  receiverId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Receiver Id"),
});

export const getMessagesSchema = z.object({
  conversationId: z
    .string()
    .trim()
    .min(1, "Conversation Id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Conversation Id"),
});

export const sendMessageSchema = z.object({
  conversationId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Conversation Id"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message cannot exceed 1000 characters"),
});
