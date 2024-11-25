import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';


// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
//! END @TODO1
// Ex: http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg
// Ex: http://aws-cloud-dev-course3-project-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg
/**************************************************************************** */
  
app.get("/filteredimage", async (req, res) => {
  let imageUrl = req.query.image_url.toString();

  // Log the incoming request for debugging 
  console.log("Received request for /filteredimage with image_url:", imageUrl);

  // 1. validate the image_url query
  if (!imageUrl) {
      return res.status(400).send(`Image url is requried.`);
  }
  
  // 2. call filterImageFromURL(image_url) to filter the image
  let resultUrl = await filterImageFromURL(imageUrl);

  // 3. send the resulting file in the response
  res.sendFile(resultUrl, function() {
    // 4. deletes any files on the server on finish of the response
    deleteLocalFiles([resultUrl]);
  })
});


// Root Endpoint
// Displays a simple message to the user
app.get( "/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
} );


// Start the Server
app.listen( port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
} );
