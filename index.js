const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
var cors = require('cors')
var FormData = require('form-data');
var fs = require('fs');
const os =require('os')
const bodyParser = require('body-parser')
const { Readable } = require('stream');
const streamBuffers = require('stream-buffers')
var FileSaver = require('file-saver');

const multer =require('multer')
const upload  =multer({dest: os.tmpdir() } )

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.raw({
  type: 'application/octet-stream',
  limit:'50mb'
}));


const port = 8080;                  //Save the port number where your server will be listening
const axios = require('axios');
const path = require('path')
app.use("/public", express.static(__dirname + '/public'))



app.use(cors())

console.log(__dirname)

//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});


app.post('/post'  , async (req,res) =>   {
  
  var buf2 = Buffer.from(req.body)
  // console.log(buf2.toString().split(',')[1])
  try {
    
    const api_key = 'a8d76c6468665d69393291b22acee8be'
    const test_file_path = '/home/gundwane/Desktop/kerem1.png'
    
    // const stream2 = fs.createReadStream(test_file_path);

    const formData = new FormData();

    formData.append('key', api_key);
    formData.append('image', buf2.toString().split(',')[1]  ) ;
    
    const res2 = await axios.post( "https://api.imgbb.com/1/upload", formData, {
      headers: formData.getHeaders()
    })
    .then(response => {
      console.log(response.data.data.url)
      return res.send(response.data)
    } )
    .catch(error => console.log(error))
    console.log("HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")
    // console.log(res2)
    // return res.send(res2)
    
  }catch(err){
    console.log(err.message)
    return new Error(err.message)
  }
  
}
)

