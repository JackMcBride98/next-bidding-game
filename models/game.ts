import mongoose, { Schema } from 'mongoose';
import { PlayerType } from './player';

export interface Round {
  hands: number;
  suit: string;
}
export interface GameType {
  _id: string;
  number: number;
  location: string;
  date: Date;
  players: PlayerType[];
  rounds: Round[];
  upAndDown: boolean;
  bonusRound: boolean;
  bids: number[][];
  gets: number[][];
  scores: number[][];
  totalScores: number[];
}

const GameSchema = new Schema<GameType>({
  number: Number,
  location: { type: String, required: true },
  date: { type: Date, required: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  rounds: Schema.Types.Mixed,
  upAndDown: { type: Boolean, required: true },
  bonusRound: { type: Boolean, required: true },
  bids: { type: [[Number]], required: true },
  gets: { type: [[Number]], required: true },
  scores: { type: [[Number]], required: true },
  totalScores: { type: [Number], required: true },
});

//Export model
export default mongoose.models.Game ||
  mongoose.model<GameType>('Game', GameSchema);
