// Directly use concat for do this

const fs = require("fs")


// Define all value in each buffer per value
let osuVer = new ArrayBuffer(4)
let view = new Uint32Array(osuVer)
view[0] = 20210316;

let ver = new Buffer.from(osuVer)

let numCol = new ArrayBuffer(4)
let colview = new Uint32Array(numCol)
colview[0] = 0o1;

let num = new Buffer.from(numCol)
console.log(num)

// let numCol = new Buffer.from("01000000", "hex")
// let name = new Buffer.from("0b0463657462", "hex")
// let beatmapnumber = new Buffer.from("01000000", "hex")
// let maps = new Buffer.from("0b203866343037333636386439313733633133663035633163306133653934396566", "hex")

// Concat all into one Buffer
// let buf = Buffer.concat([ver, numCol, name, beatmapnumber, maps])
//
// // Write he collection
// let path = "./test/str/collection.db"
// fs.writeFileSync(path, buf)
//
// console.log(buf)
