module.exports = async ({ getDomByUrl, dateFns, url }) => {
  const targetUrl = "https://zn.ua";
  const { window } = await getDomByUrl(targetUrl);

  const targetUrlParsed = url.parse(targetUrl);
  const baseUrl = `${targetUrlParsed.protocol}//${targetUrlParsed.host}`;

  const result = [];

  const articles = window.document.querySelectorAll(
    ".news_list .news_block_item"
  );

  articles.forEach((article) => {
    const anchor = article.querySelector("a");
    const time = article.dataset.type;
    const title = anchor.textContent.trim();

    if (time) {
      result.push({
        title,
        url: `${baseUrl}${anchor.href}`,
        date: dateFns.format(new Date(), "yyyy-MM-dd"),
        time: time.trim(),
        important: anchor.classList.contains("bold"),
      });
    }
  });

  return result;
};
