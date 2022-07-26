import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var GameSchema = new Schema({
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

// // Virtual for book's URL
// BookSchema
// .virtual('url')
// .get(function () {
//   return '/catalog/book/' + this._id;
// });

//Export model
module.exports = mongoose.model('Game', GameSchema);
