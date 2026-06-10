import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

export const userRoles = ["buyer", "seller", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userRoles,
      default: "buyer",
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: {
    toString(): string;
  };
};

export const User =
  (models.User as Model<UserDocument> | undefined) ??
  model<UserDocument>("User", userSchema);
