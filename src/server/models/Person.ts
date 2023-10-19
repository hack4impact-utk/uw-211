import mongoose from 'mongoose';
import { IPerson } from '@/types/IPerson';

const PersonSchema = new mongoose.Schema<IPerson>({
  name: {
    type: String,
    required: true,
  },
  nickname: String,
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Person ||
  mongoose.model<IPerson>('Person', PersonSchema);
