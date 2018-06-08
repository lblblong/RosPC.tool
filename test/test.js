let fs = require('fs')

let width = 500
let height = 400

let data = `P5\n# CREATOR: Map_generator.cpp\n${width} ${height}\n`

fs.writeFile('./test.txt', data, err => {})
