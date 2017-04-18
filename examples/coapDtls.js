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
        port: "5684",
        method: 'POST',
        pathname: "/rd", 
        query: 'ep=caio2&lt=85671&lwm2m=1.0&b=U'      
   };
 var  creationRequest2 =  {
                host: "localhost",
                port: "5684",
                method: 'DELETE',
                pathname: "rd/1",
                query: "lt=85671&lwm2m=1.0&b=U"
            };

 var  read =  {
                host: "127.0.0.1",
                port: "56182",
                method: 'GET',
                pathname: '/3/0/14' 
            };

var req= null;

//req = agent.request(creationRequest, dtls_opts);
var _dtls = {
  host: creationRequest.host,
  port: creationRequest.port || 5684
};
Object.assign(_dtls, dtls_opts);


/*
console.log("dtls_opts", _dtls)
var _req = new coap.Agent({type: 'udp4'}, _dtls, function(ag) {
  var _req = ag.request(creationRequest, _dtls);
  //console.log("_req:", _req);  
  _req.on('response', function(res){  
      console.log("res.outSocket:", res.outSocket);
      //console.log("response");
      //console.log("re", res);          
      
  });  
  _req.end();   
});
*/

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('hex');
const decoderUft = new StringDecoder('utf8');
var iconv = require('iconv');

function fromHex(hex,str){
  try{
    str = decodeURIComponent(hex.replace(/(..)/g,'%$1'))
  }
  catch(e){
    str = hex
    console.log('invalid hex input: ' + hex)
  }
  return str
}


function request(callback){  
  console.log("dtls", _dtls);
  var rs = new Readable();

  var _ag = new coap.AgentSocket({type: 'udp4'}, _dtls, null, function(ag) {
      var _req = ag.request(creationRequest, _dtls);
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
        callback(null, res.outSocket, ag._sock);
    });
    //_req.end();    
    rs.pipe(_req)
  });
}


function server(outSocket, socket, callback){
 
  socket.removeAllListeners('data');
  socket.removeAllListeners('error');
  socket.removeAllListeners('close');
  
      const server  = coap.createServerSocket(
          {
            port: outSocket.port,
            type: "udp4",
            proxy: true,
            dtls: true
          }, null, socket);     
      

      server.listen(function() {
        console.log('server started')
          callback(null);        
      });
      
        server.on('request', function(req, res) {
          console.log('request arrives:\n'+JSON.stringify(req));            
          res.setOption('Content-Format', 'text/plain')
          
          if (req.headers['Observe'] !== 0){
            
              if (req.method == "DELETE"){
                res.code = "2.02";                
                console.log('send:\n',res);                            
                return res.end("DELETE");                                
              } else if(req.method =="GET"){
                res.code="2.05";
                console.log('send:\n',res);                            
                return res.end("GET");                
              } else if(req.method =="PUT"){
                res.code="2.04";
                console.log('send:\n',res);                            
                return res.end("WRITE PUT");
              } else if(req.method =="POST"){
                res.code="2.04";
                res.setOption('Location-Path',  'rd/11123131');                
                console.log('send:\n',res);                            
                return res.end("execute POST");
              } else {
                res.code = '1.01';   
                console.log('send:\n',res);                            
                return res.end("ERROR");                
              } 
                      
          }
            var interval = setInterval(function() {
              res.write(new Date().toISOString() + '\n')
            }, 1000)                
             
          
          res.on('finish', function(err) {
            console.log("finish coap Dtls");
            clearInterval(interval)
          })
        });    
}

async.waterfall([
 request,
  server
], function (err) {
    console.log("fim execute")
});

console.log("execute");
