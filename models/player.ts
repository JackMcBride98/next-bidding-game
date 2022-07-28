import mongoose, { Schema } from 'mongoose';
import { GameType } from './game';

export interface PlayerType {
  name: string;
  gameCount: number;
  totalScore: number;
  score?: number;
  totalHands: number;
  games: GameType[];
  wins: number;
  pph?: number;
  _id: string;
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
