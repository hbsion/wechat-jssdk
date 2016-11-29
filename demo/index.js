const express = require('express');
const http = require("http");
const swig = require('swig');
const wx = require('../lib');
const path = require("path");
wx.initialize({
  "wechatToken": "6mwdIm9p@Wg7$Oup",
  "appId": "wxfc9c5237ebf480aa",
  "appSecret": "2038576336804a90992b8dbe46cd5948",
});

const app = express();
swig.setDefaults({
  cache: false,
});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/api/wechat', function (req, res) {
  if(wx.jssdk.verifySignature(req.query)) {
    res.send(req.query.echostr);
    return;
  }
  res.send("error");
});

app.get('/get-signature', function(req, res) {
  console.log(req.query);
  wx.jssdk.getSignatureByURL(req.query.url).then((data) => {
    console.log('OK', data);
    res.json(data);
  }, (reason) => {
    console.error(reason);
    res.json(reason);
  });
});

app.get('/client.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../client.js'));
});

const server = http.createServer(app);
//should use like nginx to proxy to the request to 3000, the signature domain must be on 80 PORT.
server.listen(3000);