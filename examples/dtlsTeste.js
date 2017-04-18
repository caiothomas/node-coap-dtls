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

const server  = coap.createServerSocket(
  {
    dtls: dtls_opts,
    port: 5684,
    type: "udp4",
    proxy: true
  }, null, null);

var rsinfo={};

server.on('request', function(req, res) {
  //console.log(server)
  //console.log('request arrives:\n'+JSON.stringify(req));
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
  } else if (req.method == "DELETE"){
	res.code = "2.02";
	console.log("delete");
  } else if(req.method =="GET"){
	res.code="2.05"
 }else {
    res.code = '1.01';   
  }  
  res.end("Acabou galera!!");
  
  res.on('finish', function(err) {
    console.log("finish")    
    rsinfo = {address: server._sock.remoteAddress, port: server._sock.remotePort};
    console.log("rs info", rsinfo)
  });    
  
});


          
          
function requestt(){
    const key = `${rsinfo.address}:${rsinfo.port}`;

    if(server._dtls_server && server._dtls_server.sockets[key]){
      console.log("achei key", key)        
        var _ag = new coap.AgentSocket({type: 'udp4'}, null, server._dtls_server.sockets[key], function(ag) {
        var  read =  {
                    host: rsinfo.address,
                    port: rsinfo.port,
                    method: 'GET',
                    pathname: '/3/0/14' 
                };

            var _req = ag.request(read, null);
            console.log("req", _req)
            
            _req.on('response', function(res){
              console.log("resposta Read", res.payload.toString("utf8"))
            });

            _req.end("fim");
        });
      
    }
  
      if(server._sock){
        console.log("com socket")
      } else{
        console.log("sem socket")
      }
}

setInterval(requestt, 1000);

server.listen(function() {
  console.log('server started')
});


/*
      if(server._sock){
        
        console.log("sock", server._sock.remotePort)
        var _ag = new coap.AgentSocket({type: 'udp4'}, null, server._sock, function(ag) {
        var  read =  {
                    host: server._sock.remoteAddress,
                    port: server._sock.remotePort,
                    method: 'GET',
                    pathname: '/3/0/14' 
                };

            var _req = ag.request(read, null);
            _req.on('response', function(res){
              console.log("resposta Read", res)
            });

            _req.end("fim");
        });
      }
*/