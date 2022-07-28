import mongoose, { Schema } from 'mongoose';

const CountSchema = new Schema({
  count: Number,
});

export default mongoose.models.Count || mongoose.model('Count', CountSchema);
