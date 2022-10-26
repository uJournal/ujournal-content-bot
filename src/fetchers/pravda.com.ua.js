module.exports = async ({ getDomByHtml, getHtmlByUrl, convEncoding, url }) => {
  const targetUrl = "https://www.pravda.com.ua";

  const { window } = getDomByHtml(
    convEncoding(
      await getHtmlByUrl(targetUrl, {
        responseEncoding: "binary",
      })
    )
  );

  const targetUrlParsed = url.parse(targetUrl);
  const baseUrl = `${targetUrlParsed.protocol}//${targetUrlParsed.host}`;

  const result = [];

  Array.from(
    window.document.querySelectorAll(
      ".container_sub_news_wrapper .article_news"
    )
  ).forEach((child) => {
    if (child.querySelector(".article_time")) {
      const important = child.classList.contains("article_bold");
      const anchor = child.querySelector("a");
      const [, , year, month, day] = anchor.href
        .replace(baseUrl, "")
        .replace("https://www.epravda.com.ua", "")
        .split("/");

      result.push({
        title: (
          anchor.querySelector("[data-vr-headline]") || anchor
        ).textContent.trim(),
        url: anchor.href.startsWith("http")
          ? anchor.href
          : `${baseUrl}${anchor.href}`,
        time: child.querySelector(".article_time")?.textContent.trim() || null,
        date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        important,
      });
    }
  });

  return result;
};
