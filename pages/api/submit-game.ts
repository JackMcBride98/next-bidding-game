// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import async from 'async';
import Player, { PlayerType } from '../../models/player';
import Game from '../../models/game';
// @ts-nocheck

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
      const newGame = new Game(game);
      let highestScore = Math.max(...newGame.totalScores);
      if (game.addToLeaderboard) {
        game.players.forEach(async (player: PlayerType, i: number) => {
          if (highestScore === newGame.totalScores[i]) {
            player.wins = player.wins + 1;
          }
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
