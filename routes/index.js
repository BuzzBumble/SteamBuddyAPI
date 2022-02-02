import { Router } from 'express';
import fetch from 'node-fetch';
import SteamAPI from 'steamapi';

const key = process.env.STEAM_KEY;
const steam = new SteamAPI(key);

const router = Router();

router.get('/GetPlayerSummary', function(req, res, next) {
  steam.resolve(req.query.profileURL).then((result) => {
    steam.getUserSummary(result).then((data) => {
      return res.json({
        success: true,
        data: data
      })
    });
  }).catch(() => {
    return res.json({
      success: false,
      message: "Could not retrieve steamID"
    });
  });
});

router.get('/GetUserStats', function(req, res, next) {
  steam.getUserOwnedGames(req.query.steamid).then((result) => {
    if (result.length > 0) {
      let totalPlaytime = 0;
      result.forEach((game) => {
        totalPlaytime += game.playTime;
      });

      result.sort((gameA, gameB) => {
        return gameB.playTime - gameA.playTime;
      });

      return res.json({
        success: true,
        totalPlaytime: totalPlaytime,
        games: result
      })
    } else {
      return res.json({
        success: false,
        message: "Could not get owned games"
      })
    }
  }).catch((err) => {
    return res.status(404).json({
      success: false,
      message: err.message
    })
  })
});

router.get('/GetUserStatsForGame', function(req, res, next) {
  steam.getUserAchievements(req.query.steamid, req.query.appid).then((result) => {
    if (result.gameName !== undefined) {
      return res.json({
        success: true,
        data: result.achievements
      })
    } else {
      return res.json(result)
    }
  });
});

router.get('/GetGameAchievements', function(req, res, next) {
  steam.getGameAchievements(req.query.appid).then((result) => {
    if (result.game !== undefined) {
      return res.json({
        success: true,
        data: result.stats
      })
    } else {
      return res.json(result)
    }
  })
});

export default router;
