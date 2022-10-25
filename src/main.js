const jsdom = require("jsdom");
const axios = require("axios");
const iconv = require("iconv-lite");
const url = require("url");
const dateFns = require("date-fns");
const json2md = require("json2md");
const fs = require("fs");
const path = require("path");
const fetchers = require("./fetchers");

const { JSDOM } = jsdom;

json2md.converters.details = function (input, json2md) {
  return `<details>
<summary>${input.title}</summary>

${json2md(input.content)}

</details>`;
};

const getDomByHtml = (html) => {
  return new JSDOM(html);
};

const getHtmlByUrl = async (url, options) => {
  return (await axios.get(url, options)).data;
};

const getDomByUrl = async (url, axiosOptions) => {
  return getDomByHtml(await getHtmlByUrl(url, axiosOptions));
};

const convEncoding = (data, from = "win1251", to = "utf8") => {
  const encMap = {
    utf8: "utf-8",
  };
  return iconv.encode(iconv.decode(data, from), to).toString(encMap[to]);
};

const cleanupTitle = (title) => {
  return title.replace(/\s\s+/g, " ");
};

const tools = {
  getDomByHtml,
  getHtmlByUrl,
  getDomByUrl,
  convEncoding,
  cleanupTitle,
  url,
  axios,
  dateFns,
};

module.exports = async () => {
  const fetcherKeys = Object.keys(fetchers);
  console.log(`Available fetchers: ${fetcherKeys.join(", ")}`);

  const result = [];

  for (let fetcherKey of fetcherKeys) {
    console.log(`Start fetcher: ${fetcherKey}`);
    try {
      const fetcherResult = await fetchers[fetcherKey](tools);
      console.log(`Result fetcher count: ${fetcherResult.length}`);

      const content = [];

      for (let { title, date, time, url } of fetcherResult) {
        content.push({
          link: {
            title: `(${date} ${time}) ${cleanupTitle(title)}`,
            source: url,
          },
        });
      }

      result.push({
        details: {
          title: `${fetcherKey} (${fetcherResult.length})`,
          content,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(`Error fetcher: ${error.message}`);
    }

    fs.writeFileSync(path.join(".", "build", "result.md"), json2md(result), {
      encoding: "utf-8",
    });

    console.log(`End fetcher: ${fetcherKey}`);
  }
};
