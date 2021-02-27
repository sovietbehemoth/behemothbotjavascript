import axios from 'axios';
import cheerio from 'cheerio';
import message_send_embed from '../functions/messagecreateembed.js';
import message_send from '../functions/messagecreate.js';

const getSCP = async (location, scp) => {
    try {
        if (scp != "random") {
            const { data } = await axios.get('http://www.scpwiki.com/scp-' + scp);
            const $ = cheerio.load(data);
            const url = 'http://www.scpwiki.com/scp-' + scp;
            const pg = $('p').text();

            const objectclassstart = pg.indexOf("Object Class");
            const objectclassend = pg.indexOf("Special Containment Procedures");
            const objectclass = pg.substring(objectclassstart, objectclassend);

            const containmentend = pg.indexOf("Description");
            const containment = pg.substring(objectclassend, containmentend);

            const description = pg.substring(containmentend, 2048);
            const scpname = $('#page-title').text();
            const contentjs = {
                "tts": false,
                "embed": {
                    "title": `${scpname}`,
                    "description": description,
                    "fields": [
                        {
                          name: 'Object Class',
                          value: objectclass,
                          inline: true
                        },
                        {
                          name: 'Special Containment Procedures',
                          value: containment,
                          inline: true
                        }
                      ],
                }
            }
            const p64 = {
              "tts": false,
              "embed": {
                  "title": `SCP-P64`,
                  "description": "SCP-P64 was acquired by personnel in [REDACTED]. It was first spotted shrieking in an incredibly high pitched voice. Persons who encounter this SCP or hear its shrieks develop delusions about a deity described as “BlueCreeper64”. These persons then refuse to identify with their previous identity and instead identify themselves as a “Creeper”. The names they give themselves have a prefix that is usually anything followed by “Creeper”. This is then followed by a number value, usually divisible by 2. Persons subjected by this SCPs mind control are known as SCP-P64-1. SCP-P64-1 appear to follow a monotheistic cult-like religion referred to as “Creeperism”. Individuals whom have encountered SCP-P64 and were not affected report hearing his shrieks in the form of a musical performance, it is often reported reciting multiple stanzas of a written hip hop song. The specific song is yet to be identified due to the low amount of intelligibility of the song's lyrical contents. These individuals also report feeling highly compelled to listen and approach the source of the singing. They report it to become increasingly difficult to escape this mind control like phenomenon. Those who are affected are prone to developing unpredictable behavior and overall extreme devotion to this religion. It is suspected these people group together in order to establish a syndicate of people who share the same belief system and are dedicated to spreading their beliefs. This group defines itself as the CreeperClub. When in control the CreeperClub enacts a strict caste system employing non conventional methods to purge religious and political opposition. This is most often in the form of “death squad” like groups that are heavily armed and extremely violent towards anything interpreted as resistance. The caste system implemented is defined as a very strict hierarchical, government enforced economic and social system that defines “zombies” as the lowest class and “creepers” as the highest class. The CreeperClub has expressed the desire to commit an ethnic cleansing against those who are viewed to be of “zombie” ancestry. The command council has authorized termination on site of anyone who holds the “Creeperism” belief system as it is viewed to be incompatible with society and humanity as a whole. Individuals affected by this mind control express erratic and violent behavior as well as absolute devotion to the deity “BlueCreeper64”",
                  "fields": [
                      {
                        name: 'Object Class',
                        value: "Keter",
                        inline: true
                      },
                      {
                        name: 'BlueCreeper64',
                        value: "BlueCreeper64 is thought to be an immortal creature possessing immense amounts of power. When believers carry out ritual like processions, unidentified blue colored lights are spotted in the sky. It is suspected BlueCreeper64 is incredibly dangerous and holds the potential to unleash massive amounts of havoc and despair to humanity. It is also thought that Jesus Christ was instead BlueCreeper64 and that historical governments covered the true identity of the deity in an effort to stop the wrath of BlueCreeper64 and SCP-P64. BlueCreeper64 is not identified as an SCP due to the simple fact that it is highly improbable that the SCP foundation and humanity as a whole will ever possess the technological advancements thought to be needed for safe containment of BlueCreeper64. It is of the utmost importance that the public never learns of this deity to preserve the human race as a whole from being drafted into the dangerous realm of Creeperistic ideology.",
                        inline: true
                      }
                    ],
              }
            }
            if (scp === "p64") message_send_embed(location, p64);
            else message_send_embed(location, contentjs);
        }
        else {
            const { data } = await axios.get('http://www.scpwiki.com/scp-' + Math.floor((Math.random() * 5999) + 99));
            const $ = cheerio.load(data)
            const pg = $('p').text();
            const objectclassstart = pg.indexOf("Object Class");
            const objectclassend = pg.indexOf("Special Containment Procedures");
            const objectclass = pg.substring(objectclassstart, objectclassend);
            const scpname = $('#page-title').text();

            const containmentend = pg.indexOf("Description");
            const containment = pg.substring(objectclassend, containmentend);

            const description = pg.substring(containmentend, 2048);


            const contentjs = {
                "tts": false,
                "embed": {
                    "title": `${scpname}`,
                    "description": description,
                    "fields": [
                        {
                          name: 'Object Class',
                          value: objectclass,
                          inline: true
                        },
                        {
                          name: 'Special Containment Procedures',
                          value: containment,
                          inline: true
                        }
                      ],
                }
            }
            message_send_embed(location, contentjs);
        }
    } catch (error) {
        console.log(error)
        if (error.response.status === 404) await message_send(location, 'Error: SCP does not exist.');
        else message_send(location, "Error: Unknown error occurred with retrieving SCP.")
    }
}
export default getSCP;
