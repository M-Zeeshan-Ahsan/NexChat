import express from "express";
import validate from "../middleware/validate.js";
import {
  getConversations,
  createConversation,
  sendMessages,
  getMessages,
} from "../controller/conversationController.js";
import verifyToken from "../middleware/verifyToken.js";
import {
  getMessagesSchema,
  sendMessageSchema,
  createConversationSchema,
} from "../validation/conversationValidation.js";

const router = express.Router();

router.post(
  "/conversations",
  verifyToken,
  validate(createConversationSchema),
  createConversation,
);
router.get("/conversations", verifyToken, getConversations);
router.post(
  "/messages",
  verifyToken,
  validate(sendMessageSchema),
  sendMessages,
);
router.get(
  "/messages/:conversationId",
  verifyToken,
  validate(getMessagesSchema, "params"),
  getMessages,
);

export default router;
