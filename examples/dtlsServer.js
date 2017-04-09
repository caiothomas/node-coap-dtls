var coap    = require('../index');// or coap
const path    = require('path');

//var SegfaultHandler = require('segfault-handler');

//SegfaultHandler.registerHandler("crash.log"); // With no argument, SegfaultHandler will generate a generic log file name

const dtls_opts = {
//  key: path.join(__dirname, '../test/private.der'),
//  key:   "/home/caio/Desktop/fiware/lwm2m-dtls/cert/ssl/server.csr",
   key: "./127_0_0_1.pkey",
  debug: 1,
  handshakeTimeoutMin: 3000
};

const server  = coap.createServer(
  {
    dtls: dtls_opts,
    port: 5684,
    type: "udp4",
    proxy: true
  }
);

server.on('request', function(req, res) {
  console.log('request arrives:\n'+JSON.stringify(req));
  //res.end('Hello ' + req.url.split('/')[1] + '\n')
  
//res.end('Hello ' + req.url.split('/')[1] + '\n')
  if(req.method == "POST"){
    console.log('Registration request ended successfully');    
    res.code = '2.1';
    res.setOption('Location-Path',  'rd/11123131');
    
  } else if (req.method == "PUT"){
    console.log('UPDATE ');    
    console.log('Update Request  1.02');        
    res.code = '1.02';
  } else {
    res.code = '1.01';   
  }  
  res.end("Acabou galera!!");
  
  res.on('finish', function(err) {
    console.log("finish");
  })
  
})

server.listen(function() {
  console.log('server started')
});
