import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
    for (let { name, color, x, y, placedAt } of getPixels()) {
        console.log(x, y);
        await db.pixel.create({
            data: {
                color,
                x,
                y,
                placedAt,
                namer: {
                    connectOrCreate: {
                        where: {
                            name: name
                        },

                        create: {
                            name: name
                        }
                    }
                }
            }
        });
    };

    // adds random namers

    // const words = ["sevier", "hilarious", "coffee", "pogo", "collin", "cellulare", "radars", "sprinkle", "disapproval", "sympathies", "xin", "culminating", "iogear", "latham", "kenshin", "econometric", "pink", "tourisme", "titanium", "quintile", "mittens", "childers", "parser", "knox", "storys", "gyno", "afterglow", "singles", "epl", "asics", "dwelt", "aten", "predominantly", "tron", "bratz", "observe", "coun", "ene", "teensex", "launcher", "sequin", "palmos", "harman", "pab", "nts", "margie", "fixation", "chan", "cbm", "bookseller", "kubota", "orbitz", "gutters", "cypher", "fruition", "admirably", "interventions", "inconvenience", "murfreesboro", "angular", "corridor", "beliefnet", "fsc", "election", "zhong", "replacement", "platte", "aiken", "wilcox", "cena", "mango", "cambio", "meer", "dramas", "escaping", "ungarn", "algorithms", "gre", "wavelets", "unwise", "ipt", "summoned", "inflatable", "headrest", "hardstyle", "outfield", "sebring", "fen", "copyrights", "crucified", "hospitable", "kyle", "diverting", "prognostic", "gg", "rodents", "compel", "undermining", "nemo", "caffe"];
    // for (let word of words) {
    //     await db.namer.create({
    //         data: {
    //             name: word
    //         }
    //     });
    // }
}

seed();

function getPixels() {
    let pixels = [];
    for (let x = 1; x <= 256; x++) {
        for (let y = 1; y <= 256; y++) {
            pixels.push({
                name: "shakeplace",
                color: "ffffff",
                x,
                y,
                placedAt: new Date(0)
            });
        }
    }
    return pixels;
}
