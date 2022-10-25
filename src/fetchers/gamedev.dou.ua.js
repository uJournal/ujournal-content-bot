const uk = require("date-fns/locale/uk");

module.exports = async ({ getDomByUrl, dateFns }) => {
  const targetUrl = "https://gamedev.dou.ua/news/?from=fpnews";
  const { window } = await getDomByUrl(targetUrl);

  const result = [];

  const articles = window.document.querySelectorAll(".b-lenta .b-postcard");

  articles.forEach((article) => {
    const anchor = article.querySelector(".title a");
    const date = article.querySelector(".date").textContent;
    const title = anchor.textContent.trim();
    const [day, month, time] = date.split(" ");
    const _date = dateFns.parse(
      `${day} ${month.slice(0, 4)}.`,
      "d LLL",
      new Date(),
      { locale: uk }
    );
    const _time = dateFns.parse(
      `${time.trim().padStart(5, "0")}`,
      "HH:mm",
      new Date(),
      {
        locale: uk,
      }
    );

    result.push({
      title,
      url: `${anchor.href}`,
      date: dateFns.format(_date, "yyyy-MM-dd"),
      time: dateFns.format(_time, "HH:mm"),
      important: anchor.classList.contains("bold"),
    });
  });

  return result;
};
