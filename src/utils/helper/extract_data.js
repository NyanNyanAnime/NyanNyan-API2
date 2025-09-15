function extractData(jsBody) {
  const regex = /window\.process\s*=\s*({[\s\S]*?});/;
  const match = jsBody.match(regex);

  if (match && match[1]) {
    const rawData = match[1];

    try {
      // Convert the JavaScript object-like string to a proper JSON string
      const jsonString = rawData
        .replace(/(\w+):/g, '"$1":') // Convert object keys to strings
        .replace(/'/g, '"') // Convert single quotes to double quotes
        .replace(/,\s*}/g, "}"); // Remove trailing commas

      const processData = JSON.parse(jsonString);

      return {
        MIX_AUTH_ROUTE_PARAM: processData.env.MIX_AUTH_ROUTE_PARAM,
        MIX_PAGE_TOKEN_KEY: processData.env.MIX_PAGE_TOKEN_KEY,
        MIX_STREAM_SERVER_KEY: processData.env.MIX_STREAM_SERVER_KEY,
      };
    } catch (e) {
      console.error("Failed to parse the extracted data:", e);
      return null;
    }
  }

  return null;
}

module.exports = extractData

