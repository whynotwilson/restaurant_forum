const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const port = 3000

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`app is running on port ${port}`)
})
