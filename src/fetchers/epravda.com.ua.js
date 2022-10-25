module.exports = async ({ getDomByHtml, getHtmlByUrl, convEncoding, url }) => {
  const targetUrl = "https://www.epravda.com.ua";

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

  Array.from(window.document.querySelectorAll(".news > *")).forEach((child) => {
    if (child.classList.contains("article")) {
      const important = child.classList.contains("article_bold");
      const item = child.querySelector("a");
      const [, , year, month, day] = item.href.split("/");

      result.push({
        title: (
          item.querySelector("[data-vr-headline]") || item
        ).textContent.trim(),
        url: `${baseUrl}${item.href}`,
        time: child.querySelector(".article__time")?.textContent.trim() || null,
        date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        important,
      });
    }
  });

  return result;
};
