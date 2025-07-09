import mongoose from "mongoose";
import fieldEncryption from "mongoose-field-encryption";

const PendingUserSchema = new mongoose.Schema({
  childEmail: { type: String, required: true, lowercase: true, trim: true },
  childUsername: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, // Store hashed password only
  parentEmail: { type: String, required: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  consentToken: { type: String, required: true, unique: true }, // For secure consent link
  expiresAt: { type: Date, required: true }, // For auto-expiry
});

PendingUserSchema.plugin(fieldEncryption.fieldEncryption, {
  fields: ["childEmail", "childUsername", "parentEmail", "passwordHash"],
  secret: process.env.FIELD_ENCRYPTION_SECRET,
});

export default mongoose.model("PendingUser", PendingUserSchema);
