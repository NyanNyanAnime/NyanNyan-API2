const express = require("express");
const {
  getOngoingAnime,
  getFinisedAnime,
  getMovieAnime,
  getAnimeDetails,
  searchAnime,
  getEpisodeAnime,
  getBatchAnime,
  getAnimeList,
  getScheduleAnime,
  getSummerAnime,
  getListPropertiesAnime,
  getPropertiesAnimeDetails,
} = require("../controllers/anime");

const router = express.Router();

router.get("/ongoing", getOngoingAnime);
router.get("/finished", getFinisedAnime);
router.get("/movie", getMovieAnime);
router.get("/search", searchAnime);
router.get("/list", getAnimeList);
router.get("/schedule", getScheduleAnime);
router.get("/summer", getSummerAnime);
router.get("/properties/:type", getListPropertiesAnime);
router.get("/properties/:type/:id", getPropertiesAnimeDetails);
router.get("/:animeCode/:animeId", getAnimeDetails);
router.get("/:animeCode/:animeId/:episodeId", getEpisodeAnime);
router.get("/:animeCode/:animeId/batch/:batchId", getBatchAnime);

module.exports = router;
