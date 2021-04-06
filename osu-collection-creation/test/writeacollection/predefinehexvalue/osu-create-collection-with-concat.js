const fs = require("fs")

// Define all value in each buffer per value
let osuVer = new Buffer.from("8c623401", "hex")
let numCol = new Buffer.from("01000000", "hex")
let name = new Buffer.from("0b0463657462", "hex")
let beatmapnumber = new Buffer.from("01000000", "hex")
let maps = new Buffer.from("0b203866343037333636386439313733633133663035633163306133653934396566", "hex")

// Concat all into one Buffer
let buf = Buffer.concat([osuVer, numCol, name, beatmapnumber, maps])

// Write he collection
let path = "./test/str/collection.db"
fs.writeFileSync(path, buf)



