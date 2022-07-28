import mongoose, { Schema, model } from 'mongoose';

interface Game {
  name?: string;
}

export interface PlayerType {
  name: string;
  gameCount: number;
  totalScore: number;
  totalHands: number;
  games: Game[];
  wins: number;
  pph?: number;
}

const PlayerSchema = new Schema<PlayerType>({
  name: { type: String, required: true },
  gameCount: Number,
  totalScore: Number,
  totalHands: Number,
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  wins: Number,
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);
