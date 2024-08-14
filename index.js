require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended:false}));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let counter = 1;
const urlStorage = {};

app.route("/api/shorturl")
.post((req,res)=>{
    const {url:longUrl} = req.body;
    try{
      const urlObj = new URL(longUrl);
      const hostName = urlObj.hostname;
      dns.lookup(hostName, function (err, addresses, family) {
      
        if(err) res.json({error:"invalid url"});
        else{
          const shortUrl = counter;
          urlStorage[shortUrl] = longUrl;
          counter++;
          res.json({original_url:longUrl,short_url:shortUrl});
        }
      });
    }catch(err){
      res.json({error:"invalid catch url"});
    }
})

app.get("/api/shortUrl/:shortUrl",(req,res)=>{
  const shorturl = req.params.shortUrl;    
  if(urlStorage[shorturl]) res.redirect(urlStorage[shorturl]);
  else res.json({error:"invalid short url"});
  }
)
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
