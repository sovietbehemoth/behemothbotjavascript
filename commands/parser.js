import message_send from "../../functions/messagecreate.js";
import axios from "axios";
import fetch from 'node-fetch';
import cheerio from "cheerio";

function headerForm(header) {
    return {  }
}

const reqHandlerParser = async (location, args) => {
    try {
    if (!args[1].startsWith('https://') && !args[1].startsWith('http://')) message_send(location, "BehemothBotParser: Invalid URL");
    else {
    const { data } = await axios.get(args[1]);
    if (data === undefined) message_send(location, "BehemothBotParser: Error, site does not include any information.");
    const $ = cheerio.load(data);
    const indexing = args[2].substring(args[2].indexOf(`(`) + 1, args[2].indexOf(`)`));
    function discordformat(arg) {
        if ($(arg).text().length <= 2000 && $(arg).text().length > 0) message_send(location, 'BehemothBotParser: Unnecessary discord formatting');
        if (args.indexOf('<limit:') > -1) message_send(location, 'BehemothBotParser: Error, <limit> cannot be used with <formatfordiscord> as they conflict')
        else return $(arg).text().substring(0, 2000);						
    }
    function charlimit(arg) {
        if (args.indexOf('<formatfordiscordF>') > -1) message_send(location, 'BehemothBotParser: Error, <limit> cannot be used with <formatfordiscord> as they conflict')
        const position = args.indexOf('<limit:') + 1;
        const limitedvalue = args[position].replace(">", "");
        return $(arg).text().substring(0, limitedvalue);
    }
    switch (indexing) {
        case "text":
            if (args.indexOf("<limit:") > -1) {
            const pos = args.indexOf('<limit:') + 1;
			const limit = args[pos].replace(">", "");
            message_send(location, $('p').text().substring(0, limit))
            } else if (args.indexOf("<formatfordiscordF>") > -1) {
                await message_send(location, discordformat('p'));
            }
            if (args.indexOf("<class:") > -1) {
                const pos = args.indexOf('<limit:') + 1;
				const classval = args[pos].replace(">", "");
				if (args.includes('<formatfordiscordF>')) message_send(location, discordformat(`p.${classval}`));
				else message_send(location, $(`p.${classval}`).text());
            }
            if (args.indexOf("<id") > -1) {
                const pos = args.indexOf('<id:') + 1;
				const idval = args[pos].replace(">", "");
			    if (args.includes('<formatfordiscordF>')) message_send(location, discordformat(`div#${idval}`));
				if (args.includes('<limit:')) message_send(location, charlimit(`div#${idval}`));
				else if (!args.includes('<formatfordiscordF>') && !args.includes('<limit:')) message_send(location, discordformat(`div#${idval}`));
            }
            break;
        case "POST:FETCH":
            //<headers;; Content-Type: application/json> structure
            console.log(args.indexOf("<headers;;"));
            console.log(args.indexOf(args.find(element => element.endsWith("/>"))));
            if (args.indexOf("<headers;;") > -1 && args.indexOf("<content;;")) {
                if (args.indexOf("<headers;;") > -1 && args.indexOf(args.find(element => element.endsWith("/>")) > -1) && args.indexOf("<content;;")) {
                    const headers = args.slice(args.indexOf("<headers;;") + 1, args.indexOf(args.find(element => element.endsWith("/>")))).join("");
                    const content = args.slice(args.indexOf("<content;;") + 1, args.indexOf(args.find(element => element.endsWith("/>")))).join("");
                    const fetchPOSTrequest = await fetch(args[1], {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(content)
                    })
                    const response = await fetchPOSTrequest.json();
                   await message_send(location, response);        
                }
            }
            break;
        default:
            await message_send(location, "Error: This argument does not exist, keep in mind BehemotBot is case sensitive.");
            if (indexing != "@everyone") await message_send(location, `Incorrect Argument: ${indexing}`);
        break;
    }
}
    } catch (error) {
        console.log(error);
        if (error.isAxiosError === true) {
        if (args.indexOf("<rawerror>") > -1) {
           message_send(location, error.toString());
        } 
        else {
            if (error.response === undefined) message_send(location, "BehemothBotParser: Error, website does not exist.");
            switch (error.response.status) {
                case 403:
                    message_send(location, "BehemothBotParser: Error, Forbidden (403)");
                    break;
                case 404:
                    message_send(location, "BehemothBotParser: Error, Not found (404)");
                    break;
                case 500:
                    message_send(location, "BehemothBotParser: Error, Internal server error (500)");
                    break;
                case 401:
                    message_send(location, "BehemothBotParser: Error, Unauthorized (401)");
            }
        }
    }
    }
}
export default reqHandlerParser;
