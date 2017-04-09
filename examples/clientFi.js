const coap  = require('../'), // or coap
  Readable = require('stream').Readable;

   // , req   = coap.request('coap://localhost/Matteo')
/*
var creationRequest =  {
            host: "localhost",
            port: "5683",
            method: 'PUT',
            pathname: "rd/1",
            query: "lt=85671&lwm2m=1.0&b=U"
        },  
var creationRequest =  {
            host: "localhost",
            port: "5683",
            method: 'DELETE',
            pathname: "rd/1",
            agent: false
        };
*/  

function create(){
  var rs = new Readable();
  var creationRequest =  {
      host: "localhost",
      port: "5683",
      method: 'POST',
      pathname: "elemento/Room/rd/1", 
      query: 'ep=sensor01&lt=85671&lwm2m=1.0&b=U',
      payload: '</6/0>',
      agent: true
  };

  var agent = new coap.Agent({type: "udp4"});
  var data = '';

  req = agent.request(creationRequest);

  req.on('response', function(res){  
    console.log("port", res.outSocket);                
    console.log(res.payload.toString("utf8"));
  })
  
  req.end();
  
  /*
  rs.on('error', function(error) {
      console.log('There was a connection error during update registration process: %s', error);
  });

    req.on('error', function(error) {
        req.removeAllListeners();

             console.log( 'Request error during update registration process: %s', error);
        });

  rs.pipe(req);
  rs.setEncoding('utf8');

  rs.on('data', function(chunk) {
      data+=chunk;
  });

  rs.on('end', function() {
      console.log(data);
  });  */
}

function update(){
  var  creationRequest =  {
                host: "localhost",
                port: "5683",
                method: 'PUT',
                pathname: "rd/1",
                query: "lt=85671&lwm2m=1.0&b=U"
            };

  var agent = new coap.Agent({type: "udp4"});
  var req= null;

  req = agent.request(creationRequest);

  req.on('response', function(res){  
    console.log(res);
    console.log(res.payload.toString("utf8"));

  })

}

create();

//setTimeout(update, 1500);
