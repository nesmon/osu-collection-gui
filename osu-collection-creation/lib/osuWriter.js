const nodesu = require("nodesu")
const varint = require("varint")
const fs = require("fs")
const EventEmitter = require("events")
const {ipcMain} = require('electron')



class OsuWriter extends EventEmitter {

    /**
     * @param {String} osuApiKey - Your osu API Key
     * */
    constructor(osuApiKey = null, mainWindow, db) {
        super()
        if (!osuApiKey) return console.log("Please set your osu api key!")

        this.window = mainWindow
        this.db = db
        this.osu = new nodesu.Client(osuApiKey)
    }


    /**
     * Create your osu collection :D
     * @param {String} filePath - Path where osu collection.db will be created.
     * @param {Array} mapID - List of mapID would like put on your collection
     * @param {Boolean} md5ID - Say if mapID is a already a md5 list or not
     * */
    async createCollection(filePath = null, mapID = null, isMD5 = false) {
        let mapNumber = mapID.length;
        let arrayMap;
        let hexArray = [];

        if (!filePath || !mapID) {
            return console.log("Please give all information !");
        }

        if (isMD5 === true) {
            arrayMap = mapID;
        } else {
            arrayMap = [];
            for (let i = 0; i < mapNumber; i++) {

                const result = await this.query(this.db, `SELECT md5_hash FROM md5Maps WHERE beatmapID = ${mapID[i]}`);

                if (result.length >= 1) {
                    arrayMap.push(result[0].md5_hash);
                } else if (result.length === 0) {
                    let getMD5 = await this.osu.beatmaps.getByBeatmapId(mapID[i]);
                    arrayMap.push(getMD5[0].file_md5);
                    this.db.run(`INSERT INTO md5Maps VALUES (?, "${getMD5[0].file_md5}", ${mapID[i]})`)
                }

                this.window.webContents.send("md5", i);
            }
        }

        for (let i = 0; i < arrayMap.length; i++) {
            hexArray.push(new Buffer.from(arrayMap[i]).toString("hex"));
        }

        let osuVer = new Buffer.from("8c623401", "hex")

        let numCol = new Buffer.from("01000000", "hex")

        let collectionName = new Buffer.from("0b0463657462", "hex")

        let arrayBuffer = new ArrayBuffer(4)
        let view = new Uint32Array(arrayBuffer)
        view[0] = arrayMap.length;

        let mapsNumber = new Buffer.from(arrayBuffer)

        let beatmapHash = new Buffer.from("0b20" + hexArray.join("0b20"), "hex");

        fs.writeFileSync(filePath, Buffer.concat([osuVer, numCol, collectionName, mapsNumber, beatmapHash]))

        return "Collection creation is done !"
    }

    query(database, userQuery) {
        return new Promise((resolve, reject) => {

            database.all(userQuery, async (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            })
        });
    }
}

module.exports = OsuWriter;