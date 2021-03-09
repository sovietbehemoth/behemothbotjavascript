import message_send from "../functions/messagecreate.js";
import axios from "axios";
import cheerio from "cheerio";

async function git_line(args, location) {
    if (args[1] === undefined) message_send(location, "Error: Specify a github account to continue");
    else;
    var { data } = await axios.get("https://github.com/" + args[1] + "?tab=repositories");
    var $ = cheerio.load(data);
    if (args.indexOf("rl")) {
    const repocounter = $('nav.UnderlineNav-body > a.UnderlineNav-item.selected > span.Counter').text()
    var repocount;
    if (repocounter.length === 2) repocount = repocounter.substring(0, 1);
    else if (repocounter.length === 4) repocount = repocounter.substring(0, 2);
    else if (repocounter.length === 8) repocount = repocounter.substring(0, 4);
    const rng = Math.floor((Math.random() * repocount) + 1);
    const randomrepo = $(`div#user-repositories-list > ul li:nth-child(${rng})`).text().trim().split(" ")[0].trim();
    var url = "https://github.com/" + args[1] + "/" + randomrepo;
    var { data } = await axios.get(url)
    var $ = cheerio.load(data);
    var path;
    var randomline;
    while ($(`div.repository-content > div > div.Box.mt-3.position-relative`).text() === "") {
    var filelist = $(`div.Details-content--hidden-not-important.js-navigation-container.js-active-navigation-container.d-md-block > div`).contents().length;
    var filecount;
    if (filelist.toString().length === 2) filecount = filelist.toString().substring(0, 1);
    else if (filelist.toString().length === 4) filecount = filelist.toString().substring(0, 2);
    else if (filelist.toString().length === 8) filecount = filelist.toString().substring(0, 4);
    var rng2 = Math.floor((Math.random() * filecount) + 2);
    var randomfilearr = $(`div.Details-content--hidden-not-important.js-navigation-container.js-active-navigation-container.d-md-block div:nth-child(${rng2})`).text().trim().split(" ");
    var randomfile = randomfilearr[randomfilearr.indexOf(randomfilearr.find(element => element.indexOf(".") > -1))];
    path = $(`a.js-navigation-open.Link--primary`).attr("href");
    message_send(location, path);
    var { data } = await axios.get("https://github.com/" + path);
    var $ = cheerio.load(data);
    var filelength = $(`div.repository-content > div > div.Box.mt-3.position-relative`).text().split("lines")[0].trim();
    var rng3  = Math.floor((Math.random() * filelength) + 1);
    randomline = $(`table.highlight.tab-size.js-file-line-container > tbody tr:nth-child(${rng3}) > td.blob-code.blob-code-inner.js-file-line`).text();
    }
    console.log(randomline)
    message_send(location, randomline)
    }
}

export default git_line;
