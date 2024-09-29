import mongoose from 'mongoose';

interface User {
  _id: String,
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string;
}

const providerSchema = new mongoose.Schema({
  name: String,
  id: String,
}, { _id: false });


const UserSchema = new mongoose.Schema<User>({
  _id: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  picture: String,
  emailVerified: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);