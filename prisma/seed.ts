import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
    let pixelData = getPixels().map(({ name, color, x, y, placedAt }) => {
        console.log(x, y);
        return db.pixel.create({
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
    });

    await db.$transaction(pixelData);
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
