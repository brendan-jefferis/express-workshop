// we are making a server in this file
var express = require('express') // imports express into our server
var formidable = require('express-formidable') // imports express-formidable middleware to draw form data out
var app = express() // initialises an instance of the express server called 'app'
var fs = require('fs')
app.use(formidable()) // use express-formidable
app.use(express.static("public")); // serve all static assets from the public folder

/*
   NOTE: This code is not being run by the server, to run it, replace the entire
   contents of server.js with this, or just change your package.json like so:

   {
     ...
     "main": "server-with-async-await.js",
     ...
   }

   (Don't forget to restart your server!)
*/

/*
  GET endpoint, using async/await and arrow functions

  Once the `loadPosts` function has been defined, its nice and simple for our
  endpoints to call.

  Being able to easily read your data – and by easier, I mean for you the dev –
  is super important because you'll be doing it a lot in your code and you won't
  want to write out all that `fs` stuff every time.

  Read more about async/await below...
 */
app.get('/posts', async (req, res) => {
  const posts = await loadPosts()
  res.send(posts)
})

/*
  POST endpoint, using async/await and arrow functions

  With async/await you can pause execution of your code while you 'await' the
  result of a long-running function call (like writing to a database or calling
  another server).

  This is a more modern style of JavaScript (this feature was introduced in
  ES2017 (AKA ECMAScript 8)) and is especially useful when wanting to run a
  bunch of functions in a sequence, which is what we need to here, i.e., we
  can't write the posts until we've read the old one and appended to them.

  There's some other fanciness going on here which is worth explaining.

  For `newPost`, I created a new object using the current time as the key, which
  you can do by using the square brackets like that, that means 'set the key to
  be the result of this function call'. The reason I did all this is because I
  want to use the `newPost` twice, once to save and once to return to the caller
  as a confirmation of what has been saved (another RESTful thing).

  This makes the next line – the data saving line – a little trickier though,
  because if I save `newPost` as is, I'll be saving an object (newPost) within
  an object (posts.json data), which is not what we want here. So instead, I
  created a new object and used the spread operator `...` to say 'use the
  contents of `posts` here, and use the contents of newPost beside it'.
  The spread operator is another super handy modern JS feature, introduced in
  ES2015.

  NOTE: To be clear, this example is not intended to be the solution that someone
  doing this tutorial was expected to write, it's similar to how I would write it
  in a production code base, for your reference.
  That's not to say that it's perfect, and other devs would write it
  differently, but there it is.
 */
app.post('/posts', async (req, res) => {
  if (!req.fields.blogspot) return res.status(400).send('Missing required field: blogspot')
  const content = req.fields.blogspot

  try {
    const posts = await loadPosts()
    const newPost = { [Date.now()]: content }
    const saveData = JSON.stringify({...posts, ...newPost})

    await savePosts(saveData)
    res.send(newPost)
  } catch(err) {
    console.error(`There was a problem saving posts: ${err}`)
  }
})

/*
   I wrapped the reading and writing of data in a couple functions so they're
   nicer to use as you can see above.

   If it were me, I'd move these functions to another module, call it
   'database' or something, then import them (and remove the `fs` require) in
   this file.

   NOTE: these are identical to the ones used in `server-with-promises.js`
 */
function loadPosts() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/data/posts.json', function (error, file) {
      if (error) reject('Failed to read posts')
      resolve(JSON.parse(file))
    })
  })
}

function savePosts(posts) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + '/data/posts.json', posts, function (error) {
      if (error) reject('Failed to save posts')
      resolve()
    })
  })
}

app.listen(3000, function () {
  console.log("My server is listening on port 3000. Ready to accept requests!")
})
