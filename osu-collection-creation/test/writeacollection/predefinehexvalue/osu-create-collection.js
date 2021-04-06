const fs = require("fs")

let buf = new Buffer.from("8c623401010000000b0463657462010000000b203866343037333636386439313733633133663035633163306133653934396566", "hex")
let path = "./collection.db"

fs.writeFileSync(path, buf)

console.log(buf)


