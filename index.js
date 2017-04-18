/*
 * Copyright (c) 2013-2015 node-coap contributors.
 *
 * node-coap is licensed under an MIT +no-false-attribs license.
 * All rights not explicitly granted in the MIT license are reserved.
 * See the included LICENSE file for more details.
 */

const util = require('util');
var optionsConv = require('./lib/option_converter'),
  Server = require('./lib/server'),
  ServerSocket = require('./lib/serverSoket'),    
  Agent = require('./lib/agent'),
  AgentSocket = require('./lib/agentSocket'),
  parameters = require('./lib/parameters'),
  net = require('net'),
  URL = require('url'),
  globalAgent =   new Agent({type: 'udp4'}),
  globalAgentV6 = new Agent({type: 'udp6'})


/*
 * This is the only exposure that the application should have to the
 *   client-side of the coap implementation. Concentrate parameter-normalization
 *   code in this call.
 */
module.exports.request = function(url, dtlsOpts, callback) {
  var agent, req, ipv6, _dtls
  if (typeof url === 'string') {
    url = URL.parse(url)
  }

  console.log("url", url)
  
  //console.log("sending:" + JSON.stringify(url, 4));
  ipv6 = net.isIPv6(url.hostname || url.host)

  if ((url.protocol === 'coaps:') || (typeof dtlsOpts === 'Object')) {
    // DTLS CONFIG
    _dtls = {
      host: url.hostname,
      port: url.port || 5684
    };
    Object.assign(_dtls, dtlsOpts);

    url.agent = new Agent({
      type: 'udp4',
      host: url.hostname,
      port: url.port || 5684
    },
    _dtls,
    (ag) => {
      var _req = ag.request(url, _dtls);
      //console.log(util.inspect(_req));
      callback(_req);
      //_req.end();
    });
        
    // dtls wait
    // setTimeout(() => {
    //   callback(agent.request(url, _dtls))
    // }, 10000)
  }
  else {
    // No DTLS. Vanilla datagram.
    if (url.agent) {
      agent = url.agent
    }
    else {
      agent = ipv6 ? globalAgentV6 : globalAgent
    }
    
    if (agent._sock) {
      var req =  agent.request(url);
      //req.end();
      //callback(req);
      return req;
    }
    else {
      console.log("Socket is not ready!\n");
    }
  }
}

module.exports.createServer = Server
module.exports.createServerSocket = ServerSocket

module.exports.Agent = Agent
module.exports.AgentSocket = AgentSocket

module.exports.globalAgent = globalAgent
module.exports.globalAgentIPv6 = globalAgentV6

module.exports.registerOption = optionsConv.registerOption
module.exports.registerFormat = optionsConv.registerFormat
module.exports.ignoreOption = optionsConv.ignoreOption

module.exports.parameters = parameters
module.exports.updateTiming = parameters.refreshTiming
module.exports.defaultTiming = parameters.defaultTiming