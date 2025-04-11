
import mongoose, { Document, Schema } from 'mongoose';

// User interface
export interface IUser extends Document {
  larkId: string;
  email: string;
  name: string;
  avatar?: string;
  larkAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const UserSchema = new Schema({
  larkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  larkAccessToken: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Create and export User model if it doesn't exist
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Helper functions
export const createUser = async (userData: {
  larkId: string;
  email: string;
  name: string;
  avatar?: string;
  larkAccessToken?: string;
}) => {
  return await UserModel.create(userData);
};

export const findUserByLarkId = async (larkId: string) => {
  return await UserModel.findOne({ larkId });
};

export const findUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export default UserModel;
