import CLIENT_START from "./websocket.js";
import message_send from "./functions/messagecreate.js";
import ban_member from "./functions/ban.js";
import getLyric from "./commands/lyric.js";

CLIENT_START();
async function main(command, location, args) {
    switch (command) {
        case "ping":
            await message_send(location, "pong");
            break;
        case "ban":
            await message_send(location, `Server: ${args[1]}\nMember: ${args[2]}`);
            await ban_member(location, args[1], args[2], "TEST");
            break;
        case "lyricf":
              getLyric(location, args[1], args[2])
            break;
    }
}
export { main }
