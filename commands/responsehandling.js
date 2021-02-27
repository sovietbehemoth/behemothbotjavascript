import message_send from "../../functions/messagecreate.js";

function allinstancesOf(substring,string){
    var a=[],i=-1;
    while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
    return a;
}

const responsehandler = async (content, parsing, location) => {
    var FINALCONTENT = content;
    var outboolval;
    var falseoutput;
    var outresponse
    var trueoutput;
    const strhandling = parsing.slice(parsing.indexOf("=>") + 1, parsing.length);
    if (strhandling.indexOf("<output:") > -1) {
        const outputglobalpos = strhandling.indexOf('<output:') + 1;
        outboolval = strhandling[outputglobalpos].replace(">", "");
    }
    if (strhandling.indexOf("<falseresponse:") > -1) {
        const outputglobalpos = strhandling.indexOf('<falseresponse:') + 1;
        falseoutput = strhandling[outputglobalpos].replace(">", "");
    }
    if (strhandling.indexOf("<trueresponse:") > -1) {
        const outputglobalpos = strhandling.indexOf('<trueresponse:') + 1;
        trueoutput = strhandling[outputglobalpos].replace(">", "");
    }
    if (strhandling.indexOf("<response:") > -1) {
        const outputresponse = strhandling.indexOf('<response:') + 1;
        outresponse = strhandling[outputresponse].replace(">", "");
    }
    
    var sendresponse = Boolean(outresponse != "off");
    var outboolglobal = Boolean(outboolval != "false");
    var outboolfalse = Boolean(falseoutput != "off");
    var outbooltrue = Boolean(trueoutput != "off");

    if (strhandling.indexOf("<formatfordiscordF>") > -1) {
        if (content.length <= 2000 && content.length > 0) message_send(location, 'BehemothBotParser: Unnecessary discord formatting');
            if (parsing.indexOf('<limit:') > -1) message_send(location, 'BehemothBotParser: Error, <limit> cannot be used with <formatfordiscord> as they conflict');
            FINALCONTENT = FINALCONTENT.substring(0, 2000); 
    } else if (strhandling.indexOf("<limit:") > -1) {
        const position = strhandling.indexOf('<limit:') + 1;
        const limitedvalue = strhandling[position].replace(">", "");
        if (limitedvalue > 2000) message_send(location, "BehemothBotParser: Unnecessary limit value, discord char limit is 2000");
        if (limitedvalue == 0) message_send(location, "BehemothBotParser: Unnecessary limit value assignment, Cannot send 0 characters");
        if (limitedvalue < 0) message_send(location, "BehemothBotParser: Error, illogical limit value"); else {
        FINALCONTENT = FINALCONTENT.substring(0, limitedvalue);
        }
    } 
    if (strhandling.indexOf("<substring:") > -1) {
        const position1 = strhandling.indexOf("<substring:") + 1;
        const position2 = strhandling.indexOf("<substring:") + 2;
        const startString = strhandling[position1].replace(",", "");
        const endString = strhandling[position2].replace(">", "");
        if (startString < 0 || endString < 0) message_send(location, "BehemothBotParser: Error, illogical value assignment to string indexing value");
        else {
        FINALCONTENT = FINALCONTENT.substring(startString, endString);
        }
    }
    if (strhandling.indexOf("<uppercase>") > -1) {
        FINALCONTENT = FINALCONTENT.toUpperCase();
    } else if (strhandling.indexOf("<lowercase>") > -1) {
        FINALCONTENT = FINALCONTENT.toLowerCase();
    }
    if (strhandling.indexOf("<startswith:") > -1) {
        const position1 = strhandling.indexOf("<startswith:") + 1;
        const position2 = strhandling.indexOf("<startswith:") + 2;
        const queryvalue = strhandling[position1].replace(",", "").replace("_", " ");
        const indexstart = strhandling[position2].replace(">", "");
        if (FINALCONTENT.startsWith(queryvalue, indexstart) && outboolglobal === true && outbooltrue === true) {
            message_send(location, `StartsWithObject: True: Starts with '${queryvalue}'`);
        } else if (outboolglobal === true && outboolfalse === true) message_send(location, `StartsWithObject: False: Does not start with '${queryvalue}'`);
    }
    if (strhandling.indexOf("<endswith:") > -1) {
        const position1 = strhandling.indexOf("<endswith:") + 1;
        const position2 = strhandling.indexOf("<endswith:") + 2;
        const queryvalue = strhandling[position1].replace(",", "").replace("_", " ");
        const indexstart = strhandling[position2].replace(">", "");
        if (indexstart < 0) message_send(location, "BehemothBotParser: Error, illogical value assignment to string indexing value");
        if (FINALCONTENT.endsWith(queryvalue, indexstart) && outbooltrue === true && outboolval === true) {
            message_send(location, `EndsWithObject: True: Ends with '${queryvalue}'`);
        } else if (outboolglobal === true && outboolfalse === true) message_send(location, `EndsWithObject: False: Does not end with '${queryvalue}'`);
    }
    if (strhandling.indexOf("<includes:") > -1) {
        const position = strhandling.indexOf('<includes:') + 1;
        const includingvalue = strhandling[position].replace(">", "").replace("_", " ");
        if (!includingvalue.length) message_send(location, "BehemothBotParser: Error, no value specified");
        else if (FINALCONTENT.includes(includingvalue) && outboolglobal === true && outbooltrue === true) message_send(location, "IncludesObject: True: Includes " + "'" + includingvalue + "'");
        else if (outboolglobal === true && outboolfalse === true) message_send(location, "IncludesObject: False: Does not include " + "'" + includingvalue + "'");
    }
    if (strhandling.indexOf("<length>") > -1 && outboolglobal === true) {
        message_send(location, "ContentLength: " + FINALCONTENT.length);
    }
    if (strhandling.indexOf("<search:") > -1) {
        const position1 = strhandling.indexOf('<search:') + 1;
        const position2 = strhandling.indexOf("<search:") + 2;
        const queryvalue = strhandling[position1].replace(",", "").replace("_", " ");
        const defaultqueryvalue = strhandling[position1].replace(">", "").replace("_", " ");
        console.log(defaultqueryvalue);
        const regexp = new RegExp(defaultqueryvalue, 'i')
        if (strhandling[position1].endsWith(",") && strhandling[position2].replace(">", "") === "sensitive") {
            const search = FINALCONTENT.search(queryvalue);
            if (search > -1 && outboolglobal === true && outbooltrue === true) {
                message_send(location, `SearchObject: Found '${queryvalue}' at character ${search}`);
            } else if (outboolglobal === true && outboolfalse === true) message_send(location, `SearchObject: '${queryvalue}' not found`);
        } else {
            const search = FINALCONTENT.search(regexp);
            if (search > -1 && outboolglobal === true && outbooltrue === true) {
                message_send(location, `SearchObject: Found '${defaultqueryvalue}' at character ${search}`);
            } else if (outboolglobal === true && outboolfalse === true) message_send(location, `SearchObject: '${defaultqueryvalue}' not found`);
        }
    }
    if (strhandling.indexOf("<instanceof:") > -1) {
        const position = strhandling.indexOf('<instanceof:') + 1;
        const position2 = strhandling.indexOf('<instanceof:') + 2;
        const instance = strhandling[position].replace(",", "").replace("_", " ");
        const specification = strhandling[position2].replace(">", "");
        switch (specification) {
            case "first":
                const firstinstance = FINALCONTENT.indexOf(instance);
                if (firstinstance > -1 && outboolglobal === true && outbooltrue === true) message_send(location, `InstanceObject: First found '${instance}' at character ${firstinstance}`);
                else if (outboolglobal === true && outboolfalse === true) message_send(location, `InstanceObject: '${instance}' not found`);
                break;
            case "last":
                const lastinstance = FINALCONTENT.lastIndexOf(instance);
                if (lastinstance > -1 && outboolglobal === true && outbooltrue === true) message_send(location, `InstanceObject: Last found '${instance}' at character ${lastinstance}`);
                else if (outboolglobal === true && outboolfalse === true) message_send(location, `InstanceObject: '${instance}' not found`);
                break;
            default:
                if (specification.startsWith("start:")) {
                    const startvalue = specification.split(":")[1];
                    const instancesearch = FINALCONTENT.indexOf(instance, startvalue);
                    if (instancesearch > -1 && outboolglobal === true && outbooltrue === true) message_send(location, `InstanceObject: Found '${instance}' at character ${instancesearch}`);
                    else if (outboolglobal === true && outboolfalse === true) message_send(location, `InstanceObject: '${instance}' not found`); 
                } else message_send(location, "BehemothBotParser: Error, Invalid argument");
                break;
        }
    }
    if (strhandling.indexOf("<replace:") > -1) {
        const position1 = strhandling.indexOf('<replace:') + 1;
        const position2 = strhandling.indexOf("<replace:") + 2;
        const position3 = strhandling.indexOf("<replace:") + 3
        const targetvalue = strhandling[position1].replace(",", "").replace("_", " ");
        const defaultqueryvalue = strhandling[position2].replace(">", "").replace("_", " ");
        const nondefaultqueryvalue = strhandling[position2].replace(",", "").replace("_", " ");
        const thirdparam = strhandling[position3].replace(">", "");
        switch (thirdparam) { 
            case "global":
                const regexpgl = new RegExp(targetvalue, 'g');
                FINALCONTENT = FINALCONTENT.replace(regexpgl, nondefaultqueryvalue);
                break;
            case "sensitive":
                FINALCONTENT = FINALCONTENT.replace(targetvalue, nondefaultqueryvalue);
                break;
            default:
                if (strhandling[position2].endsWith(">")) {
                    const regexpinsens = new RegExp(targetvalue, 'i');
                    FINALCONTENT = FINALCONTENT.replace(regexpinsens, defaultqueryvalue);
                } else message_send(location, "BehemothBotParser: Error, invalid arguments");
                break;
        }
    }
    if (strhandling.indexOf("<remove:")) {
        const position1 = strhandling.indexOf('<remove:') + 1;
        const position2 = strhandling.indexOf("<remove:") + 2;
        const arg1 = strhandling[position1].replace(",", "").replace("_", " ");
        const arg2 = strhandling[position2].replace(",", "").replace("_", " ");
        if (arg1.startsWith("start:") && arg2.startsWith("end:")) {
            const startvalue = arg1.split(":")[1];
            const endvalue = arg2.split(":")[1];
            if (endvalue === "rest") {
                FINALCONTENT = FINALCONTENT.replace(FINALCONTENT.substring(startvalue, FINALCONTENT.length), "");
            } else {
                FINALCONTENT = FINALCONTENT.replace(FINALCONTENT.substring(startvalue, endvalue), "");
            } 
        } else if (arg2 === "all") {
            const regexpgl = new RegExp(arg1, 'g');
            FINALCONTENT = FINALCONTENT.replace(regexpgl, "");
        } else {
            FINALCONTENT = FINALCONTENT.replace(arg1, "");
        }
    }
   

    if (sendresponse === true) message_send(location, FINALCONTENT);
}
export default responsehandler;
