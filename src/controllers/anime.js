const axios = require("axios");
const cheerio = require("cheerio");
const baseUrl = require("../utils/constanta/url");
const extractData = require("../utils/helper/extract_data");
const getEpisodeList = require("../utils/helper/episode_data");
const fetchHtml = require("../utils/helper/fetch");

const getOngoingAnime = async (req, res) => {
  try {
    const order_by = req.query.order_by || "updated";
    const page = req.query.page || 1;

    const urlOngoing = `${baseUrl}/quick/ongoing?order_by=${order_by}&page=${page}`;
    const html = await fetchHtml(urlOngoing);

    const $ = cheerio.load(html);
    let ongoingAnime = [];

    $("#animeList > div > div").each((i, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const episode = $(element).find("a > div > div.ep > span").text().trim();
      const type = $(element)
        .find("div > ul > a")
        .map((i, el) => $(el).text().trim())
        .get();
      const href = $(element).find("a").attr("href") || "";
      const animeParts = href.split("/");

      const animeCode = animeParts[4];
      const animeId = animeParts[5];

      if (title && image && episode && type.length && animeCode && animeId) {
        ongoingAnime.push({ title, image, episode, type, animeCode, animeId });
      }
    });

    const nextPage = $("a.gray__color .fa-angle-right").length === 0;
    const prevPage = $("a.gray__color .fa-angle-left").length === 0;

    res.status(200).json({ ongoingAnime, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getFinisedAnime = async (req, res) => {
  try {
    const order_by = req.query.order_by || "updated";
    const page = req.query.page || 1;

    const urlFinished = `${baseUrl}/quick/finished?order_by=${order_by}&page=${page}`;
    const response = await fetchHtml(urlFinished);

    const $ = cheerio.load(response);
    let finishedAnime = [];

    $("#animeList > div > div").each((index, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const score = $(element).find("a > div > div.ep > span").text().trim();
      const type = $(element)
        .find("div > ul > a")
        .map((index, element) => $(element).text().trim())
        .get();
      const animeCode = $(element).find("a").attr("href")?.split("/")[4];
      const animeId = $(element).find("a").attr("href")?.split("/")[5];

      if (title && image && score && type && animeCode && animeId) {
        finishedAnime.push({
          title,
          image,
          score,
          type,
          animeCode,
          animeId,
        });
      }
    });

    // Tentukan apakah ada halaman berikutnya atau sebelumnya
    const nextPage = $("a.gray__color .fa-angle-right").length === 0;
    const prevPage = $("a.gray__color .fa-angle-left").length === 0;

    res.status(200).json({ finishedAnime, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const getMovieAnime = async (req, res) => {
  try {
    const order_by = req.query.order_by || "updated";
    const page = req.query.page || 1;

    const urlMovie = `${baseUrl}/quick/movie?order_by=${order_by}&page=${page}`;
    const response = await fetchHtml(urlMovie);

    const $ = cheerio.load(response);
    let movieAnime = [];

    $("#animeList > div > div").each((index, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const score = $(element).find("a > div > div.ep > span").text().trim();
      const type = $(element)
        .find("div > ul > a")
        .map((index, element) => $(element).text().trim())
        .get();
      const animeCode = $(element).find("a").attr("href")?.split("/")[4];
      const animeId = $(element).find("a").attr("href")?.split("/")[5];

      if (title && image && score && type && animeCode && animeId) {
        movieAnime.push({
          title,
          image,
          score,
          type,
          animeCode,
          animeId,
        });
      }
    });

    // Tentukan apakah ada halaman berikutnya atau sebelumnya
    const nextPage = $("a.gray__color .fa-angle-right").length === 0;
    const prevPage = $("a.gray__color .fa-angle-left").length === 0;

    res.status(200).json({ movieAnime, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const getAnimeDetails = async (req, res) => {
  try {
    const { animeCode, animeId } = req.params;

    const urlAnime = `${baseUrl}/anime/${animeCode}/${animeId}`;
    const response = await fetchHtml(urlAnime);

    const $ = cheerio.load(response);
    let animeDetails = {};

    const title = $(".anime__details__title > h3").text().trim();
    const alternativeTitles = $(".anime__details__title > span").text().trim();
    const image = $(".anime__details__pic").attr("data-setbg");
    const synopsis = $("#synopsisField").text().trim();
    const type = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(1) > div > div:nth-child(2) > a"
    )
      .text()
      .trim();
    const episode = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(2) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const status = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(3) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const released = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(4) > div > div:nth-child(2)"
    )
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const season = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(5) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const duration = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(6) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const quality = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(7) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const country = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(8) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const adaptation = $(
      ".anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(9) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const genres = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(1) > div > div:nth-child(2) > a"
    )
      .map((index, element) => $(element).text().trim())
      .get();
    const explicit = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(2) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const demographic = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(3) > div > div:nth-child(2) > a"
    )
      .map((index, element) => $(element).text().trim())
      .get();
    const theme = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(4) > div > div:nth-child(2) > a"
    )
      .map((index, element) => $(element).text().trim())
      .get();
    const studio = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(5) > div > div:nth-child(2) > a"
    )
      .map((index, element) => $(element).text().trim())
      .get();
    const score = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(6) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const enthusiast = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(7) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const ratings = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(8) > div > div:nth-child(2)"
    )
      .text()
      .trim();
    const credit = $(
      ".anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(9) > div > div:nth-child(2) > a"
    )
      .map((index, element) => $(element).text().trim())
      .get();

    const allEpisodes = await getEpisodeList(urlAnime);

    const batchElement = $("#episodeBatchLists");
    let batchId = "?";

    if (batchElement.length) {
      const batchContent = batchElement.attr("data-content");

      if (batchContent) {
        const $batchContent = cheerio.load(batchContent);
        const batchLink = $batchContent("a").attr("href");

        if (batchLink) {
          const parts = batchLink.split("/");
          batchId = parts[parts.length - 1] || "?";
        }
      }
    }

    console.log(batchId);

    animeDetails = {
      title: title,
      alternativeTitles: alternativeTitles,
      image: image,
      synopsis: synopsis,
      type: type,
      episode: episode,
      status: status,
      released: released,
      season: season,
      duration: duration,
      quality: quality,
      country: country,
      adaptation: adaptation,
      genres: genres,
      explicit: explicit,
      demographic: demographic,
      theme: theme,
      studio: studio,
      score: score,
      enthusiast: enthusiast,
      ratings: ratings,
      credit: credit,
      batchId: batchId,
      episodeList: allEpisodes,
    };

    res.status(200).json({ animeDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const searchAnime = async (req, res) => {
  try {
    const query = req.query.query;
    const order_by = req.query.order_by || "oldest";
    const page = req.query.page || 1;

    const urlSearch = `${baseUrl}/anime?order_by=${order_by}&search=${query}&page=${page}`;
    const response = await fetchHtml(urlSearch);

    const $ = cheerio.load(response);
    let searchResult = [];

    $("#animeList > div > div").each((index, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const type = $(element)
        .find("div > ul > a")
        .map((index, element) => $(element).text().trim())
        .get();
      const animeCode = $(element).find("a").attr("href")?.split("/")[4];
      const animeId = $(element).find("a").attr("href")?.split("/")[5];

      if (title && image && type && animeCode && animeId) {
        searchResult.push({
          title,
          image,
          type,
          animeCode,
          animeId,
        });
      }
    });

    const hasPagination = $(".product__pagination").length > 0;
    const prevPage =
      hasPagination && $("a.gray__color .fa-angle-left").length === 0;
    const nextPage =
      hasPagination && $("a.gray__color .fa-angle-right").length === 0;

    res.status(200).json({ searchResult, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const getEpisodeAnime = async (req, res) => {
  try {
    const { animeCode, animeId, episodeId } = req.params;
    const server = req.query.server ?? "kuramadrive";
    const url = `${baseUrl}/anime/${animeCode}/${animeId}/episode/${episodeId}?u5TMI8pGCYyhAIi=VSey4XRtK8&X08dP5p9kKerYp9=${server}&page=1`;

    const response = await fetchHtml(url);
    if (!response.ok) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to fetch episode." });
    }
    const $ = cheerio.load(response);
    const episodeElement = $(".breadcrumb-option");
    const episodeDetailElement = $(".anime-details");

    let videoUrl = [];
    const fullText = episodeElement
      .find(".breadcrumb__links__v2 > span")
      .text()
      .trim();

    // Cari tanggal rilis episode
    const dateMatch = fullText.match(
      /(?:Minggu|Senin|Selasa|Rabu|Kamis|Jumat|Sabtu), \d{2} [A-Za-z]{3} \d{4}, \d{2}:\d{2}:\d{2} WIB/
    );

    // Video link
    if (
      [
        "mega",
        "streamtape",
        "filemoon",
        "filelions",
        "streamwish",
        "vidguard",
        "rpmshare"
      ].includes(server)
    ) {
      const iframeUrl = episodeDetailElement
        .find("#animeVideoPlayer .iframe-container iframe")
        .attr("src");
      if (iframeUrl) videoUrl.push(iframeUrl);
    } else {
      episodeDetailElement
        .find("#animeVideoPlayer > .mb-3 > .video-content > #player > source")
        .each((i, el) => {
          const src = $(el).attr("src");
          if (src) videoUrl.push(src);
        });
    }

    // Download per episode
    const downloadLinks = $("#animeDownloadLink h6")
      .map((i, elem) => {
        const quality = $(elem).text().trim();
        const links = $(elem)
          .nextUntil("h6", "a")
          .map((j, link) => ({
            title: $(link).text().trim(),
            url: $(link).attr("href"),
          }))
          .get();
        return { quality, links };
      })
      .get();

    // Download batch (jika ada)
    const batchLinks = $("#animeDownloadBatch h6")
      .map((i, elem) => {
        const quality = $(elem).text().trim();
        const links = $(elem)
          .nextUntil("h6", "a")
          .map((j, link) => ({
            title: $(link).text().trim(),
            url: $(link).attr("href"),
          }))
          .get();
        return { quality, links };
      })
      .get();

    return res.status(200).json({
      status: true,
      message: "Success",
      data: {
        title: $("#episodeTitle").text().trim(),
        animeId,
        episodeId,
        server,
        date: dateMatch ? dateMatch[0] : "Date not found",
        videoUrl,
        downloadLinks, // download per episode
        batchLinks, // download batch (semua episode)
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getBatchAnime = async (req, res) => {
  try {
    const { animeCode, animeId, batchId } = req.params;

    const urlBatch = `${baseUrl}/anime/${animeCode}/${animeId}/batch/${batchId}`;
    const response = await fetchHtml(urlBatch);

    const $ = cheerio.load(response);

    // Check for kps data
    const kps = $("div.mt-3:nth-of-type(2)").attr("data-kps");
    if (!kps) {
      return res.status(500).json({
        status: false,
        message: "KPS not found.",
      });
    }

    const kpsResponse = await fetchHtml(`${baseUrl}/assets/js/${kps}.js`);

    const extractedData = extractData(kpsResponse);

    if (!extractedData) {
      return res.status(500).json({
        status: false,
        message: "Failed to extract necessary data.",
      });
    }

    const auth = await fetchHtml(
      `${baseUrl}/assets/${extractedData.MIX_AUTH_ROUTE_PARAM}`
    );

    const servers = ["kuramadrive", "archive", "archive-v2"];
    const downloadLinksMap = new Map();

    await Promise.all(
      servers.map(async (server) => {
        const videoResponse = await fetchHtml(
          `${baseUrl}/anime/${animeCode}/${animeId}/batch/${batchId}?${extractedData.MIX_PAGE_TOKEN_KEY}=${auth}&${extractedData.MIX_STREAM_SERVER_KEY}=${server}`
        );
        const $ = cheerio.load(videoResponse);

        $("#animeDownloadLink h6").each((i, elem) => {
          const quality = $(elem).text().trim();
          const links = [];

          $(elem)
            .nextUntil("h6")
            .filter("a")
            .each((j, sibling) => {
              links.push({
                title: $(sibling).text().trim(),
                url: $(sibling).attr("href"),
              });
            });

          if (
            ["MKV 480p", "MKV 720p", "MP4 360p", "MP4 480p", "MP4 720p"].some(
              (q) => quality.includes(q)
            )
          ) {
            // Use quality as key to avoid duplication
            if (!downloadLinksMap.has(quality)) {
              downloadLinksMap.set(quality, links);
            } else {
              // Merge links if quality already exists
              const existingLinks = downloadLinksMap.get(quality);
              links.forEach((link) => {
                if (
                  !existingLinks.some(
                    (existingLink) => existingLink.url === link.url
                  )
                ) {
                  existingLinks.push(link);
                }
              });
            }
          }
        });
      })
    );

    const combinedDownloadLinks = Array.from(
      downloadLinksMap,
      ([quality, links]) => ({ quality, links })
    );

    res.status(200).json({ downloadLinks: combinedDownloadLinks });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAnimeList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const order = req.query.order_by || "text";

    const url = `${baseUrl}/anime?order_by=${order}&page=${page}`;
    const response = await fetchHtml(url);

    const $ = cheerio.load(response);
    let listAnime = [];

    if (order === "text") {
      // Struktur untuk order_by=text
      $("#animeList .anime__text").each((index, element) => {
        const title = $(element).find("a.anime__list__link").text().trim();
        const animeCode = $(element)
          .find("a.anime__list__link")
          .attr("href")
          ?.split("/")[4];
        const animeId = $(element)
          .find("a.anime__list__link")
          .attr("href")
          ?.split("/")[5];

        if (title && animeCode && animeId) {
          listAnime.push({ title, animeCode, animeId });
        }
      });
    } else {
      // Struktur untuk order_by=oldest / updated / dll
      $("#animeList > div > div").each((index, element) => {
        const title = $(element).find("div > h5").text().trim();
        const image = $(element).find("a > div").attr("data-setbg");
        const episode = $(element)
          .find("a > div > div.ep > span")
          .text()
          .replace(/\s+/g, " ")
          .trim();
        const type = $(element)
          .find("div > ul > a")
          .map((i, el) => $(el).text().trim())
          .get();
        const animeCode = $(element).find("a").attr("href")?.split("/")[4];
        const animeId = $(element).find("a").attr("href")?.split("/")[5];

        if (title && animeCode && animeId) {
          listAnime.push({
            title,
            image,
            episode,
            type,
            animeCode,
            animeId,
          });
        }
      });
    }

    const nextPage = $("a.gray__color .fa-angle-right").length === 0;
    const prevPage = $("a.gray__color .fa-angle-left").length === 0;

    res.status(200).json({ listAnime, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const getScheduleAnime = async (req, res) => {
  try {
    const scheduled_day = req.query.scheduled_day || "all";
    const page = req.query.page || 1;

    const urlOngoing = `${baseUrl}/schedule?scheduled_day=${scheduled_day}&page=${page}`;
    const response = await fetchHtml(urlOngoing);

    const $ = cheerio.load(response);
    let scheduleAnime = [];

    $("#animeList > div > div").each((index, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const schedule = $(element)
        .find("a > div > div.ep > span:nth-child(1)")
        .text()
        .trim();
      const actualSchedule = $(element)
        .find("a > div > div.ep > span:nth-child(2)")
        .text()
        .replace(/\s+/g, " ")
        .trim();
      const day = $(element)
        .find("a > div > div.view-end > ul > li:nth-child(1) > span")
        .text()
        .trim();
      const time = $(element)
        .find("a > div > div.view-end > ul > li:nth-child(2) > span")
        .text()
        .trim();
      const type = $(element)
        .find("div > ul > a")
        .map((index, element) => $(element).text().trim())
        .get();
      const animeCode = $(element).find("a").attr("href")?.split("/")[4];
      const animeId = $(element).find("a").attr("href")?.split("/")[5];

      if (
        title &&
        image &&
        schedule &&
        actualSchedule &&
        day &&
        time &&
        type &&
        animeCode &&
        animeId
      ) {
        scheduleAnime.push({
          title,
          image,
          schedule,
          actualSchedule,
          day,
          time,
          type,
          animeCode,
          animeId,
        });
      }
    });

    const nextPage = $("a.gray__color .fa-angle-right").length === 0;
    const prevPage = $("a.gray__color .fa-angle-left").length === 0;

    console.log(scheduleAnime);
    res.status(200).json({ scheduleAnime, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getSummerAnime = async (req, res) => {
  try {
    const order_by = req.query.order_by || "popular";
    const page = req.query.page || 1;

    const urlOngoing = `${baseUrl}/properties/season/summer-2025?order_by=${order_by}&page=${page}`;
    const response = await fetchHtml(urlOngoing);

    const $ = cheerio.load(response);
    let summerAnime = [];

    $("#animeList > div > div").each((index, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const ratings = $(element).find("a > div > div.ep > span").text().trim();
      const type = $(element)
        .find("div > ul > a")
        .map((index, element) => $(element).text().trim())
        .get();
      const animeCode = $(element).find("a").attr("href")?.split("/")[4];
      const animeId = $(element).find("a").attr("href")?.split("/")[5];

      if (title && image && ratings && type && animeCode && animeId) {
        summerAnime.push({
          title,
          image,
          ratings,
          type,
          animeCode,
          animeId,
        });
      }
    });

    const nextPage = $("a.gray__color .fa-angle-right").length === 0;
    const prevPage = $("a.gray__color .fa-angle-left").length === 0;

    res.status(200).json({ summerAnime, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getListPropertiesAnime = async (req, res) => {
  try {
    const { type } = req.params;

    const urlProperties = `${baseUrl}/properties/${type}`;
    const response = await fetchHtml(urlProperties);

    const $ = cheerio.load(response);
    let propertiesAnime = [];

    $(".kuramanime__genres > ul > li").each((index, element) => {
      const name = $(element).find("a").text().trim();
      const propertiesId = $(element)
        .find("a")
        .attr("href")
        .split("/")[5]
        .split("?")[0];

      if (name && propertiesId) {
        propertiesAnime.push({
          name,
          propertiesId,
        });
      }
    });
    console.log(propertiesAnime);
    res.status(200).json({ propertiesAnime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getPropertiesAnimeDetails = async (req, res) => {
  try {
    const { type, id } = req.params;
    const order_by = req.query.order_by || "updated";
    const page = req.query.page || 1;

    const urlProperties = `${baseUrl}/properties/${type}/${id}?order_by=${order_by}&page=${page}`;
    const response = await fetchHtml(urlProperties);

    const $ = cheerio.load(response);
    let propertiesDetails = [];

    $("#animeList > div > div").each((index, element) => {
      const title = $(element).find("div > h5").text().trim();
      const image = $(element).find("a > div").attr("data-setbg");
      const ratings = $(element).find("a > div > div.ep > span").text().trim();
      const type = $(element)
        .find("div > ul > a")
        .map((index, element) => $(element).text().trim())
        .get();
      const animeCode = $(element).find("a").attr("href")?.split("/")[4];
      const animeId = $(element).find("a").attr("href")?.split("/")[5];

      if (title && image && ratings && type && animeCode && animeId) {
        propertiesDetails.push({
          title,
          image,
          ratings,
          type,
          animeCode,
          animeId,
        });
      }
    });

    const hasPagination = $(".product__pagination").length > 0;
    const prevPage =
      hasPagination && $("a.gray__color .fa-angle-left").length === 0;
    const nextPage =
      hasPagination && $("a.gray__color .fa-angle-right").length === 0;

    res.status(200).json({ propertiesDetails, nextPage, prevPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
