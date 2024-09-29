import mongoose from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

interface Session {
    userId: string;
    expiresAt: Date;
}

export const SessionSchema = new mongoose.Schema<Session>({
    userId: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.models.Session ||
    mongoose.model<Session>('Session', SessionSchema);