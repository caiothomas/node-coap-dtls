var coap = require('../index.js') // or coap
const path    = require('path');


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
                pathname: "rd/1",
                query: "lt=85671&lwm2m=1.0&b=U"
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

var _ag = new coap.Agent({type: 'udp4'}, _dtls, function(ag) {
  var _req = ag.request(creationRequest, _dtls);
  console.log("_req:", ag);  
  _req.on('response', function(res){  
      console.log("res.outSocket:", res.outSocket);
      console.log("response");
      console.log("_req:", res.payload.toString("utf8"));  
  });  
  _req.end();  
});

console.log("execute");