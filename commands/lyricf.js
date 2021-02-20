import axios from 'axios';
import cheerio from 'cheerio';
import message_send from '../functions/messagecreate.js';
import message_send_embed from '../functions/messagecreateembed.js'
 
const getLyric = async (location, account, spec) => {
    if (account === undefined) await message_send(location, "Error: Specify a Last.fm account to run a command");
    else {
    try {
        var { data } = await axios.get('https://www.last.fm/user/' + account);
        var $ = cheerio.load(data);
        const recentsongName = $('section > table.chartlist tr:nth-child(1) > td.chartlist-name > a').text();
        const recentsongArtist = $('section > table.chartlist tr:nth-child(1) > td.chartlist-artist > a').text();
        const link = 'https://www.lyricfinder.org/lyrics/1357574/' + recentsongArtist + '?track=' + recentsongName;
        var { data } = await axios.get(link);
        var $ = cheerio.load(data);
        const lyriclink = $('div.col-lg-6').text();
        const lyriclength = $('div.col-lg-6').contents().length;
        const randomlyricline = Math.floor((Math.random() * lyriclength) + 0);
        const lyricsarray = $(`div.col-lg-6`).text().split("\n");
        const randomlyric = lyricsarray[Math.floor(Math.random() * lyricsarray.length)];
        switch (spec) {
            case "full":
                await message_send_embed(location, recentsongName, lyriclink.substring(0, 2048));
                break;
            case undefined:
                if (!randomlyric.length) await message_send(location, 'Error: Encountered a blank line, try again');
                else await message_send(location, randomlyric);
                break;
            default:
                await message_send(location, `Error: Unknown argument '${spec}'`);
                break;
        } 
    } catch (error) {
        console.log(error);
        if (error.response.status === 404 && error.request.host === "www.last.fm") message_send(location, `Error: Could not find user '${account}'`);
        else if (error.response.status === 404 && error.request.host === "www.lyricfinder.org") message_send(location, "Error: Could not find lyrics to song currently being played by " + account);
    }
}
}
export default getLyric;
