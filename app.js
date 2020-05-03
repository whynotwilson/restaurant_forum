const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const db = require('./models')
const port = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`app is running on port ${port}`)
})

require('./routes')(app)
