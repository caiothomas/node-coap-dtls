var coap = require('../index.js') // or coap
const path    = require('path');
var Readable = require('stream').Readable;


//var SegfaultHandler = require('segfault-handler');

//SegfaultHandler.registerHandler("crash.log"); // With no argument, SegfaultHandler will generate a generic log file name

var dtls_opts = {
  psk:           new Buffer('AAAAAAAAAAAAAAAA'),
  PSKIdent:      new Buffer("32323232-3232-3232-3232-323232323232"),  
//  key: "127_0_0_1.csr",
  key: null,
  peerPublicKey: null
};


const dtls_opts2 = {
//  key: path.join(__dirname, '../test/private.der'),
//  key:   "/home/caio/Desktop/fiware/lwm2m-dtls/cert/ssl/server.csr",
   key: "./127_0_0_1.pkey",
  debug: 1,
  handshakeTimeoutMin: 3000
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

console.log("dtls", _dtls);
var rs = new Readable();
var _ag = new coap.Agent({type: 'udp4'}, _dtls, function(ag) {
    var _req = ag.request(creationRequest, _dtls);
    console.log("_req:", ag);    
  
    rs.push("</6/0>");
    rs.push(null);

    rs.on('error', function(error) {
      console.log("error Rs")
    });

      console.log("ag._sock", ag._sock)              
  
    _req.on('response', function(res){
      console.log("response");
      console.log("_req:", res.code);  
      console.log("_req:", res.payload.toString("utf8"));  
      console.log("create server", res.outSocket)
      dtls_opts2.socket = ag._sock;
      const server  = coap.createServer(
        {          
          dtls: dtls_opts2,
          type: "udp4",
          proxy: true
        }
      );

      server.on('request', function(req, res) {
        console.log(server)
        res.end("Acabou galera!!");

        res.on('finish', function(err) {
          console.log("finish");
        })
      })

      server.listen(function() {
        console.log('server started')
      });                           
  });
  //_req.end();    
  rs.pipe(_req)
});

console.log("execute");

