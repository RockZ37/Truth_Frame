import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  description: string;
  momentum: number;
  biasVariance: number;
  dominantLeaning: string;
  sourceCount: number;
  articles: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  momentum: { type: Number, required: true },
  biasVariance: { type: Number, required: true },
  dominantLeaning: { type: String, required: true },
  sourceCount: { type: Number, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
}, {
  timestamps: true,
  index: [
    { name: 1 },
    { momentum: -1 },
    { biasVariance: 1 },
    { dominantLeaning: 1 },
  ],
});

export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);