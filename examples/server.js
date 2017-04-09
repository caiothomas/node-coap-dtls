const coap    = require('../') // or coap

const server  = coap.createServer({type: "udp4",proxy: true});

server.on('request', function(req, res) {
  //console.log('request arrives:\n', req);  
  
  //res.end('Hello ' + req.url.split('/')[1] + '\n')
  if(req.method == "POST"){
    console.log('Registration request ended successfully');    
    res.code = '2.0';
  } else if (req.method == "PUT"){
    console.log('UPDATE ');    
    console.log('Update Request  1.02');        
    res.code = '1.02';
  } else {
    res.code = '1.01';   
  }  
  res.end("dtls");
  
  res.on('finish', function(err) {
    console.log("finish");
  })
  
  //console.log('response arrives:\n', res);    
})

server.listen(function() {
  console.log('server started')
})
