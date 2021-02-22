import message_send from "../../functions/messagecreate.js";
import axios from "axios";
import cheerio from "cheerio";

const reqHandlerParser = async (location, args) => {
    if (!args[1].startsWith('https://') && !args[1].startsWith('http://')) message_send(location, "BehemothBotParser: Invalid URL");
    else {
    const { data } = await axios.get(args[1]);
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
        default:
            await message_send(location, "Error: This argument does not exist, keep in mind BehemotBot is case sensitive.");
            if (indexing != "@everyone") await message_send(location, `Incorrect Argument: ${indexing}`);
        break;
    }
}
}
export default reqHandlerParser;
