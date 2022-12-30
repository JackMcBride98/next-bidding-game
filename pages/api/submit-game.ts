// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import async from 'async';
import Player, { PlayerType } from '../../models/player';
import Game from '../../models/game';
// @ts-nocheck

function getAllIndexes<T>(arr: T[], val: T): number[] {
  let indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
  return indexes;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const game = JSON.parse(req.body);
  game.players = game.players.map((player: string) =>
    player.trim().toUpperCase()
  );
  async.forEachOf(
    game.players,
    function iteratee(
      name: string,
      key: string | number,
      callback: () => void
    ) {
      Player.findOne(
        { name: name },
        function (err: unknown, player: PlayerType) {
          if (err) {
            console.log(err);
          }
          let newPlayer;
          if (!player) {
            newPlayer = new Player({
              name: name,
              wins: 0,
              gameCount: 0,
              totalScore: 0,
              totalHands: 0,
              games: [],
            });
            newPlayer.save(function (err: unknown) {
              if (err) {
                console.log(err);
              }
              return;
              //saved
            });
          }
          game.players[key] = player || newPlayer;
          callback();
        }
      );
    },
    function callback(err: unknown) {
      if (err) {
        console.log(err);
      }
      game.winner = '';
      game.randomWinner = false;
      const newGame = new Game(game);
      let highestScore = Math.max(...newGame.totalScores);
      let isTie = false;
      let winningPlayerName = '';
      if (
        newGame.totalScores.filter((score: number) => score === highestScore)
          .length > 1
      ) {
        isTie = true;
        //determine winner
        let indexes = getAllIndexes(newGame.totalScores, highestScore);
        // calculate bid percentages
        let bidPercentages: number[] = [];
        indexes.forEach((index: number) => {
          let gotBid = 0;
          for (let i = 0; i < newGame.rounds.length; i++) {
            if (newGame.bids[i][index] === newGame.gets[i][index]) {
              gotBid++;
            }
          }
          bidPercentages.push(gotBid / newGame.rounds.length);
        });
        let highestBidPercentage = Math.max(...bidPercentages);
        if (
          bidPercentages.filter(
            (bidPercentage) => bidPercentage === highestBidPercentage
          ).length < 2
        ) {
          let winningPlayerIndex =
            indexes[bidPercentages.indexOf(highestBidPercentage)];
          winningPlayerName = game.players[winningPlayerIndex].name;
        } else {
          // calculate total hands won
          let handsWon: number[] = [];
          indexes.forEach((index: number) => {
            let totalHandsWon = 0;
            for (let i = 0; i < newGame.rounds.length; i++) {
              totalHandsWon += newGame.gets[i][index];
            }
            handsWon.push(totalHandsWon);
          });
          let highestHandsWon = Math.max(...handsWon);
          if (
            handsWon.filter((handsWon) => handsWon === highestHandsWon).length <
            2
          ) {
            let winningPlayerIndex = indexes[handsWon.indexOf(highestHandsWon)];
            winningPlayerName = game.players[winningPlayerIndex].name;
          }
        }
      }
      if (game.addToLeaderboard) {
        game.players.forEach(async (player: PlayerType, i: number) => {
          if (!isTie && highestScore === newGame.totalScores[i]) {
            player.wins = player.wins + 1;
            winningPlayerName = player.name;
          }
          if (isTie && winningPlayerName && player.name === winningPlayerName) {
            player.wins = player.wins + 1;
          }
          if (isTie && !winningPlayerName) {
            player.wins = player.wins + 1;
          }
          newGame.winner = winningPlayerName;
          player.gameCount = player.gameCount + 1;
          player.totalScore = player.totalScore + newGame.totalScores[i];
          player.totalHands = player.totalHands + newGame.rounds.length;
          player.games.push(newGame._id);
          (player as any).save(function (err: unknown) {
            if (err) {
              console.log(err);
            }
            //saved
          });
        });
      }
      Game.countDocuments({}, function callback(err: unknown, count: number) {
        if (err) {
          console.log(err);
        }
        newGame.number = count + 1;
        newGame.save(function (err: unknown) {
          if (err) {
            console.log(err);
            res.send({ err });
          } else {
            res.send('Success');
          }
        });
      });
    }
  );
}
