'use strict';
const http = require('http');
const pify = require('pify');
const getPort = require('get-port');
const host = exports.host = 'localhost';
const setup = require('proxy');

exports.createProxy = function () {
	return getPort().then(port => {
		const p = setup(http.createServer());

		p.host = host;
		p.port = port;
		p.protocol = 'http';

		p.listen = pify(p.listen, Promise);
		p.close = pify(p.close, Promise);

		return p;
	});
};
