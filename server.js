// we are making a server in this file
var express = require('express') // imports express into our server
var formidable = require('express-formidable') // imports express-formidable middleware to draw form data out
var app = express() // initialises an instance of the express server called 'app'
var fs = require('fs')
app.use(formidable()) // use express-formidable
app.use(express.static("public")); // serve all static assets from the public folder


/*
  GET endpoint to return all posts

  I renamed these from `/create-post` and `/get-posts` to just `/posts` (I
  realise that naming these was not part of the exercise, but here's a bit of
  info on why just as a side-note).

  To get all posts, you call `/posts` with the GET method, and to create a post
  you call `/posts` with the POST method.

  This is the more 'RESTful' way to do things, it's outside the scope of this
  tutorial, but in a nutshell: you want to name the endpoint after the resource
  you're providing access to (in this case a 'post' but it could be '/users',
  '/products', '/girls', '/chocolates', etc) then the caller knows to use the
  various HTTP methods (GET, POST, PUT, PATCH, DELETE) as needed.

  If you wanted to get a single post you'd call `/posts` with the id of the
  resource (e.g., 123), `GET /posts/123`. To edit it, you'd use
  `PATCH /posts/123`; replace it with `PUT /posts/123`; or delete it with
  `DELETE /posts/123`.

  Later on you can get into filtering and sorting with query parameters, like
  `GET /posts?topic=chocolates&sort_by=date_ascending`.

  These aren't hard rules though and there are a lot of differing opinions on
  REST best practices, but the above should serve as a basic intro to the core
  concepts.
 */
app.get('/posts', async (req, res) => {
  fs.readFile(__dirname + '/data/posts.json', function (error, file) {
    const parsedFile = JSON.parse(file)
    res.send(parsedFile)
  })
})

/*
  POST endpoint, using fs read/write methods.

  To save a post:
  1. check that user has sent us a post
  2. read existing posts
  3. add user's post to existing posts
  4. overwrite all existing posts with combined posts

  This works, but it's a shame to have to define all the fs.readFile stuff twice
  (here and above, in the GET). Also, nesting the `writeFile` inside the read
  like that is ok since we're only doing a 2-step operation here, but what if we
  needed 3 or 4 steps?

  Nesting callbacks within callbacks like this is known in the Node community as
  'callback hell' and is about as much fun as the name suggests. The alternative
  to this is to use Promises (see `server-with-promises.js` and
  `server-with-async-await.js`.
 */
app.post('/posts', function (req, res) {
  if (!req.fields.blogspot) return res.status(400).send('Missing required field: blogspot')
  const content = req.fields.blogspot

  fs.readFile(__dirname + '/data/posts.json', function (error, file) {
    if (error) throw new Error('Failed to read posts')

    const existingPosts = JSON.parse(file)
    const now = Date.now()
    existingPosts[now] = content
    const newPosts = JSON.stringify(existingPosts)

    fs.writeFile(__dirname + '/data/posts.json', newPosts, function (error) {
      if (error) throw new Error('Failed to save posts')
      res.send({ [now]: content })
    })
  })
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
