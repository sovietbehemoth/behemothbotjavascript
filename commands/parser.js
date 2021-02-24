import message_send from "../../functions/messagecreate.js";
import axios from "axios";
import fetch from 'node-fetch';
import cheerio from "cheerio";
import message_send_embed from "../../functions/messagecreateembed.js";

const reqHandlerParser = async (location, args) => {
    try {
    if (!args[1].startsWith('https://') && !args[1].startsWith('http://')) message_send(location, "BehemothBotParser: Invalid URL");
    else {
    const indexing = args[2].substring(args[2].indexOf(`(`) + 1, args[2].indexOf(`)`));
    function discordformat(arg, $) {
        if ($(arg).text().length <= 2000 && $(arg).text().length > 0) message_send(location, 'BehemothBotParser: Unnecessary discord formatting');
        if (args.indexOf('<limit:') > -1) message_send(location, 'BehemothBotParser: Error, <limit> cannot be used with <formatfordiscord> as they conflict')
        else return $(arg).text().substring(0, 2000);						
    }
    function charlimit(arg, $) {
        if (args.indexOf('<formatfordiscordF>') > -1) message_send(location, 'BehemothBotParser: Error, <limit> cannot be used with <formatfordiscord> as they conflict')
        else {
        const position = args.indexOf('<limit:') + 1;
        const limitedvalue = args[position].replace(">", "");
        if (limitedvalue > 2000) message_send(location, "BehemothBotParser: Unnecessary limit value, discord char limit is 2000");
            if (limitedvalue == 0) message_send(location, "BehemothBotParser: Unnecessary limit value assignment, Cannot send 0 characters");
            if (limitedvalue < 0) message_send(location, "BehemothBotParser: Error, illogical limit value"); else {
                    return $(arg).text().substring(0, limitedvalue);
            }
        }
    }
    switch (indexing) {
        case "POST":
            //<headers;; Content-Type: application/json/> structure
            if (args.indexOf("<headers;;") > -1 && args.indexOf("<content;;") > -1) {
                if (args.indexOf("<headers;;") > -1 && args.indexOf(args.find(element => element.endsWith("/>")) > -1) && args.indexOf("<content;;")) {
                    const masterheaderarray = args.slice(args.indexOf("<headers;;") + 1, args.indexOf(args.find(element => element.endsWith("/>"))) + 1).join('');
                    const headers1 = masterheaderarray.substring(0, masterheaderarray.length - 2).replace(/&&/g, " ");
                    const mastercontentarray = args.slice(args.indexOf("<content;;") + 1, args.indexOf(args.find(element => element.endsWith("//>"))) + 1).join('');
                    const content1 = mastercontentarray.substring(0, mastercontentarray.length - 3).replace(/&&/g, " ");
                    console.log(content1);
                    console.log(headers1);
                        var temp = headers1.split(","),
                        headers = {};
                    for (let i=0; i<temp.length; i+=2) {
                      headers[temp[i]] = temp[(i+1)];
                    }
                    var temp = content1.split(","),
                        content = {};
                    for (let i=0; i<temp.length; i+=2) {
                      content[temp[i]] = temp[(i+1)];
                    }
                
                    console.log(content);
                    console.log(headers);
                    const fetchPOSTrequest = await fetch(args[1], {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(content),          
                    });
                    const response = await fetchPOSTrequest.json();
                    if (args.indexOf("<rawresponse>") > -1) message_send(location, JSON.stringify(response));
                   await message_send(location, response);                 
                } else message_send(location, "Error: Malformed request, when forming a POST request make sure to include the headers and content");
            }
            break;
        case "GET":
            const response = await axios.get(args[1]);
            if (args.indexOf("<rawresponse>") > -1) { 
                if (args.indexOf("<formatfordiscordF>") > -1) {
                    if (response.data.length <= 2000 && response.data.length > 0) message_send(location, 'BehemothBotParser: Unnecessary discord formatting');
                    if (args.indexOf('<limit:') > -1) message_send(location, 'BehemothBotParser: Error, <limit> cannot be used with <formatfordiscord> as they conflict');
                    else message_send(location, response.data.substring(0, 2000)); 
                } else if (args.indexOf("<limit:") > -1) {
                    const position = args.indexOf('<limit:') + 1;
                    const limitedvalue = args[position].replace(">", "");
                    if (limitedvalue > 2000) message_send(location, "BehemothBotParser: Unnecessary limit value, discord char limit is 2000");
                    if (limitedvalue == 0) message_send(location, "BehemothBotParser: Unnecessary limit value assignment, Cannot send 0 characters");
                    if (limitedvalue < 0) message_send(location, "BehemothBotParser: Error, illogical limit value"); else {
                    message_send(location, response.data.substring(0, limitedvalue));
                    }
                } else if (!args.indexOf("<formatfordiscordF>") && !args.indexOf("<limit:")) message_send(location, response.data);
            } else if (args.indexOf("=>") > -1) {
                const parsing = args.slice(args.indexOf("=>") + 1, args.length);
                if (!parsing.length) message_send(location, "BehemothBotParser: Error, no parsing orders exist");
                const $ = cheerio.load(response.data);
                if (args.indexOf("<tag:") > -1) {
                    const sendorder = args[args.indexOf("<tag:") + 1].replace(">", "");
                    if (parsing.indexOf("<path:") > -1) {
                        const pointer = parsing[parsing.indexOf("<path:") + 1].replace("/>", "");
                        var temp = pointer.split("->"),
                        items = [];
                    for (let i=0; i<temp.length; i+=1) {
                        if (temp[i].startsWith("div")) {
                            if (temp[i].indexOf("&") > -1) {
                                items.push(`div.` + temp[i].split("&")[1].replace(/_/g, "."));
                            } else if (temp[i].indexOf("#") > -1) {
                                items.push(`div#` + temp[i].split("#")[1].replace(/_/g, "."))
                            }
                        } else if (temp[i].startsWith("p")) {
                            if (temp[i].indexOf("&") > -1) {
                                items.push(`p.` + temp[i].split("&")[1].replace(/_/g, "."));
                            } else if (temp[i].indexOf("#") > -1) {
                                items.push(`p#` + temp[i].split("#")[1].replace(/_/g, "."))
                            }
                        } else if (temp[i].startsWith("span")) {
                            if (temp[i].indexOf("&") > -1) {
                                items.push(`span.` + temp[i].split("&")[1].replace(/_/g, "."));
                            } else if (temp[i].indexOf("#") > -1) {
                                items.push(`span#` + temp[i].split("#")[1].replace(/_/g, "."))
                            }
                        } else if (temp[i].indexOf("header") > -1) {
                            if (temp[i].indexOf("&") > -1) {
                                items.push(`h1.` + temp[i].split("&")[1].replace(/_/g, "."));
                            } else if (temp[i].indexOf("#") > -1) {
                                items.push(`h1#` + temp[i].split("#")[1].replace(/_/g, "."))
                            }
                        }
                    }
                    if (parsing.indexOf("<class:") > -1) {
                        const pos = parsing.indexOf('<class:') + 1;
				        const classval = parsing[pos].replace(">", "");
                        items.push(sendorder + '.' + classval);
                    } else items.push(sendorder);
                    const newitems = items.join(" > ");
                    const newinfo = $(newitems).text();
                    console.log(newinfo);
                } else if (parsing.indexOf("<parent:") > -1) {
                    const pos = parsing.indexOf('<parent:') + 1;
				    const parentitem = parsing[pos].replace(">", "");
                    var parseparentitem;
                    var reqitem;
                    if (parentitem.startsWith("div")) {
                        if (parentitem.indexOf("&") > -1) {
                            parseparentitem = `div.` + parentitem.split("&")[1].replace(/_/g, ".");
                        } else if (parentitem.indexOf("#") > -1) {
                            parseparentitem = `div#` + parentitem.split("#")[1].replace(/_/g, ".");
                        }
                    } else if (parentitem.startsWith("p")) {
                        if (parentitem.indexOf("&") > -1) {
                            parseparentitem = `p.` + parentitem.split("&")[1].replace(/_/g, ".");
                        } else if (parentitem.indexOf("#") > -1) {
                            parseparentitem = `p#` + parentitem.split("#")[1].replace(/_/g, ".");
                        }
                    } else if (parentitem.startsWith("span")) {
                        if (parentitem.indexOf("&") > -1) {
                            parseparentitem = `span.` + parentitem.split("&")[1].replace(/_/g, ".");
                        } else if (parentitem.indexOf("#") > -1) {
                            parseparentitem = `span#` + parentitem.split("#")[1].replace(/_/g, ".");
                        }
                    } else if (parentitem.indexOf("header") > -1) {
                        if (parentitem.indexOf("&") > -1) {
                            parseparentitem = `h1.` + parentitem.split("&")[1].replace(/_/g, ".");
                        } else if (parentitem.indexOf("#") > -1) {
                            parseparentitem = `h1#` + parentitem.split("#")[1].replace(/_/g, ".");
                        }
                    }
                    if (parsing.indexOf("<class:") > -1) {
                        const pos2 = parsing.indexOf('<class:') + 1;
				        const classval2 = parsing[pos2].replace(">", "");
                        reqitem = sendorder + '.' + classval2;
                    } else reqitem = sendorder;
                    const buildrequest = `${parseparentitem} > ${reqitem}`;
                    if (parsing.indexOf("<child:") > -1) {
                        const pos3 = parsing.indexOf('<child:') + 1;
				        const childvalue = parsing[pos3].replace(">", "");
                        const buildchildrenrequest = `${parseparentitem} ${sendorder}:nth-child(${childvalue})`
                        console.log($(buildchildrenrequest).text());
                    } else console.log($(buildrequest).text());
                }
                break;  
            }              
                } else if (args.indexOf("<fulltag:")) {
                    const parsing = args.slice(args.indexOf("=>") + 1, args.length);
                    if (!parsing.length) message_send(location, "BehemothBotParser: Error, no parsing orders exist");
                    const $ = cheerio.load(response.data);
                    const pos = parsing.indexOf('<fulltag:') + 1;
				    const tagval = parsing[pos].replace(">", "");
                    var parseparentitem;
                    var reqitem;
                    if (tagval.startsWith("div")) {
                        if (tagval.indexOf("&") > -1) {
                            parseparentitem = `div.` + tagval.split("&")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") > -1) {
                            parseparentitem = `div#` + tagval.split("#")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") <= -1 && tagval.indexOf("&") <= -1) parseparentitem = 'div';
                    } else if (tagval.startsWith("p")) {
                        if (tagval.indexOf("&") > -1) {
                            parseparentitem = `p.` + tagval.split("&")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") > -1) {
                            parseparentitem = `p#` + tagval.split("#")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") <= -1 && tagval.indexOf("&") <= -1) parseparentitem = 'p';
                    } else if (parentitem.startsWith("span")) {
                        if (tagval.indexOf("&") > -1) {
                            parseparentitem = `span.` + tagval.split("&")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") > -1) {
                            parseparentitem = `span#` + tagval.split("#")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") <= -1 && tagval.indexOf("&") <= -1) parseparentitem = 'span';
                    } else if (tagval.indexOf("header") > -1) {
                        if (tagval.indexOf("&") > -1) {
                            parseparentitem = `h1.` + tagval.split("&")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") > -1) {
                            parseparentitem = `h1#` + tagval.split("#")[1].replace(/_/g, ".");
                        } else if (tagval.indexOf("#") <= -1 && tagval.indexOf("&") <= -1) parseparentitem = 'h1';
                    }
                    console.log($(parseparentitem).text());
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
