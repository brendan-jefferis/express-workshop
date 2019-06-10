// we are making a server in this file
var express = require('express') // imports express into our server
var formidable = require('express-formidable') // imports express-formidable middleware to draw form data out 
var app = express() // initialises an instance of the express server called 'app'
var fs = require('fs')
app.use(formidable()) // use express-formidable 
app.use(express.static("public")); // serve all static assets from the public folder

// *** SENDING DATA TO SERVER FROM FORM ON PAGE *** //
app.post('/create-post', function (req, res) {
  event.preventDefault()
  console.log('/create-post')
  console.log(req.fields)
})

// this reads out the content of the 
fs.readFile((__dirname + '/data/posts.json'), function (error, file) {
  console.log(file.toString()) // convert file to string so that it isn't just the raw buffer 
  let parsedFile = JSON.parse(file)
  console.log('parsedFile:', parsedFile)

})

// *** ALL REQUESTING DATA FROM SERVER TO SEND TO CLIENT *** //

// // handler takes homepage endpoint, listens for request coming through 3000, sends response
// app.get("/", function (req, res) {
//   res.send("Hello Yay Node Girls!") // can only have one res.send
// })

// app.get("/chocolate", function (req, res) {
//   res.send("This is the chocolate page!") // can only have one res.send
// })

// app.get("/node", function (req, res) {
//   res.send("This is the node page") // can only have one res.send
// })

// app.get("/girls", function (req, res) {
//   res.send("Girl page woot!") // can only have one res.send
// })

// set up a port (3000) or endpoint, which is where requests will come through
// listen method takes port and callback function to do things once server is running
app.listen(3000, function () {
  console.log("My server is listening on port 3000. Ready to accept requests!")
})