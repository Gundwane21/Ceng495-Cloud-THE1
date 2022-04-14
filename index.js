const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
var cors = require('cors')
var FormData = require('form-data');
const bodyParser = require('body-parser')

app.use(bodyParser.raw({
  type: 'application/octet-stream',
  limit:'50mb'
}));

const port = process.env.PORT || 5000 ;                  //Save the port number where your server will be listening
const axios = require('axios');

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
  try {
    
    const formData = new FormData();

    formData.append('key', process.env.IMBGBB_API_KEY);
    formData.append('image', buf2.toString().split(',')[1]  ) ;
    
    const res2 = await axios.post( "https://api.imgbb.com/1/upload", formData, {
      headers: formData.getHeaders()
    })
    .then(response => {
      console.log(response.data.data.url)
      return res.send(response.data)
    } )
    .catch(error => console.log(error))

    
  }catch(err){
    console.log(err.message)
    return new Error(err.message)
  }
  
  }
)

