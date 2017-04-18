var coap = require('../index.js') // or coap
const path    = require('path');
var Readable = require('stream').Readable;
var parse = require('coap-packet').parse,
    generate = require('coap-packet').generate;
var async = require('async'),
    apply = async.apply;
//var SegfaultHandler = require('segfault-handler');

//SegfaultHandler.registerHandler("crash.log"); // With no argument, SegfaultHandler will generate a generic log file name

var dtls_opts = {
  psk:           new Buffer('AAAAAAAAAAAAAAAA'),
  PSKIdent:      new Buffer("32323232-3232-3232-3232-323232323232"),  
//  key: "127_0_0_1.csr",
  key: null,
  peerPublicKey: null
};

/*
var req = coap.request('coaps://127.0.0.1:5684/oic/res',
                        dtls_opts,
                       (req) => {
                          req.on('response', function(res) {
                            res.pipe(process.stdout)
                          });
                          req.end();
                        }
                      );
*/

 var  creationRequest =  {
        host: "localhost",
        port: "5683",
        method: 'POST',
        pathname: "/rd", 
        query: 'ep=sensor1&lt=85671&lwm2m=1.0&b=U'      
   };

var req= null;

function request(callback){
 var rs = new Readable();

 var ag = new coap.Agent({type: 'udp4'});

 var _req = ag.request(creationRequest);

 rs.push("</3/0>");
 rs.push(null);

 rs.on('error', function(error) {
     console.log("error Rs")
 });

 //console.log("ag._sock", ag._sock)              

 _req.on('response', function(res){
       console.log("response");
       console.log("_req:", res.code);  
       console.log("_req:", res.payload.toString("utf-8"));  
       console.log("create server", res.outSocket)      
       callback(null, res.outSocket)
 })     
 //_req.end();    
 rs.pipe(_req);
}

function server(port, callback){
      const server  = coap.createServerSocket(
          {
            port:  port,
            type: "udp4",
            proxy: true
          });     
      

        server.listen(function() {
          console.log('server started')
          callback(null, port);
        });

        server.on('request', function(req, res) {
          console.log('request arrives:\n'+JSON.stringify(req));            
          res.setOption('Content-Format', 'text/plain')
          
          if (req.headers['Observe'] !== 0){
              if (req.method == "DELETE"){
                res.code = "2.02";
                return res.end("DELETE");                                
              } else if(req.method =="GET"){
                res.code="2.05";
                return res.end("GET");                
              } else if(req.method =="PUT"){
                res.code="2.04";
                return res.end("WRITE PUT");
              } else if(req.method =="POST"){
                res.code="2.04";
                res.setOption('Location-Path',  'rd/11123131');                
                return res.end("execute POST");
              } else {
                res.code = '1.01';   
                return res.end("ERROR");                
              } 
                      
          }
            var interval = setInterval(function() {
              res.write(new Date().toISOString() + '\n')
            }, 1000)                
                
          res.on('finish', function(err) {
            console.log("finish");
            clearInterval(interval)
          })
        });    
}



async.waterfall([
 request,
 server
], function (err, addres) {
    console.log("fim execute", addres)
});
