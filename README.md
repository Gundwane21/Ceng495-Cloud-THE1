# Ceng495-Cloud-THE1
HERE IS THE WEBSITE LINK:
https://rhea-weekly-scheduler.herokuapp.com/


DEVELOPMENT DECISIONS

I have chosen node.js to build the backend of the application because this project does not require neither long setup configurations nor middlewares nor database support. Django or Spring boot would require more setup. 

I did not add any database to support the application since our requirements does not need to store the weekly app schedular to keep any user specific data.

I generate the frontend of the app using html, a little css and bootstrap to add better look. 

I set the the static files to public directory. These will be served to browser by express using this simple command 
``` 
app.use("/public", express.static(__dirname + '/public'))
```

table.js file in static files generate the html table using days and hours constants. By modifying this constants this table could be extended to be used in any number of days or any number of hours. Therefore this frontend of tables could be simply extended without changing the code. This complies with OCP principle of SOLID design.

Following 3 api's are used to generate random activity to do
1 - BORED API
2 - POETRY DB
3 - GITHUB ISSUES

Bored api gives u random thing to do, poetry db gives you a random poem and github issue gives you one of the popular repositories, my code chooses a random repository than fetches a random issue from its active issues.

I have used the fetch API of javascript to send get request to the above explained apis. Because fetch api uses Promises which is quite useful to use in any asyncronous situation.

I have also used jQuery to make each table cell clickable. Because it gives the developer an intuitive way to generate this functionality.

I have used html2canvas package to generate screenshots of the schedule table. Because it uses html to parse the image and since i dont have any raw data this provides the perfect accuracy and simplicity.

I use html2canvas's toDataUrl() method to generate base64 format of the image. After taking screenshot I have used ajax to send this raw base64 image data the backend of my application.
Since i am sending raw data following parameters are set to the POST request
processData: false,
contentType: 'application/octet-stream',

At the server side a simple index.js file is used to start the express server. It serves the index html file to the root path. PORT variable is taken from heroku. Cors package is used to allow simple sharing between backend and frontend. body-parser package is used to parse the octet-stream send from frontend. 50 MB is a reasonable limit for a simple image file
app.use(bodyParser.raw({
  type: 'application/octet-stream',
  limit:'50mb'
}));

I set up a simple post endpoint in /api/post at index.js as a simple backend 
This endpoint takes the raw base64 input as request then generates into a buffer than from this buffer
removes th base64 metadata at the beginning of the string. 

API_KEY for imgbb is set into the config_vars of heroku for security reasons. form-data package is used to create a form data to send the post request to thr imgbb api since it requires multi part form data
I use the axios to send this data because it is simple to generate headers from the formdata to send it to the API properly. base64 image and api key is send then succesfull upload to the imgbb is received. Then the upload url is returned to the frontend as as response. Frontend uses this response to share the link with the user.
