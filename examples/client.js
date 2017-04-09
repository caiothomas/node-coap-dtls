const coap  = require('../') // or coap

/*
    , req   = coap.request('coap://localhost/Matteo')

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()
*/

 var  creationRequest =  {
                host: "localhost",
                port: "5683",
                method: 'POST',
                pathname: "rd/1",
                query: "lt=85671&lwm2m=1.0&b=U"
            };

/*
var ag = new coap.Agent({type: 'udp4'}, null, function(_ag){
  console.log("_req:", _ag);
  var _req = _ag.request(creationRequest);  
  _req.on('response', function(res){  
      console.log("res.outSocket:", res.outSocket);
      console.log("response");
      console.log("_req:", res.payload.toString("utf8"));  
  });  
  _req.end();   
});
*/
var ag = new coap.Agent({type: 'udp4'});
  var _req = ag.request(creationRequest);  
  _req.on('response', function(res){  
      console.log("res.outSocket:", res.outSocket);
      console.log("response");
      console.log("_req:", res.payload.toString("utf8"));  
  });  
  _req.end();  