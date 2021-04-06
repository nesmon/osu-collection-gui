const osuWrite = require("./../app");

const osu = new osuWrite("osu_api_key");

let test = [
    '8e1fd86ff3121e863df4cdce4c7798e8',
    '63b10c56e7ac58cef2229ac512560c00'
]


osu.createCollection("./collection.db", test, true);