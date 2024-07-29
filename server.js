const express = require('express');
const request = require('request');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', (req, res) => {
  const url = `https://carapi.app/api${req.url}`;
  console.log(url);
  req.pipe(request({ qs:req.query, uri: url })).pipe(res);
});

app.use('/api', (req, res) =>{
    const url = `https://carapi.app/api/models?year=${year}&make=${make}`;
    console.log(url)
    req.pipe(request({ qs:req.query, uri: url })).pipe(res);
})

app.listen(3004, () => {
  console.log('Proxy server is running on port 3004');
});

