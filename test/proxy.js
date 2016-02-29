import test from 'ava';
import got from '../';
import {createServer} from './helpers/server';
import {createProxy} from './helpers/proxy';

const proxyEnvVars = [
	'http_proxy',
	'HTTP_PROXY',
	'https_proxy',
	'HTTPS_PROXY',
	'no_proxy',
	'NO_PROXY'
];

let s;
let p;

test.before('setup', async () => {
	s = await createServer();
	p = await createProxy();

	s.on('/', (req, res) => {
		res.end('ok');
	});

	await s.listen(s.port);
	await p.listen(p.port);

	proxyEnvVars.forEach(value => delete process.env[value]);
});

test.serial('simple request to http://127.0.0.1 using HTTP_PROXY', async t => {
	process.env.HTTP_PROXY = `http://localhost:${p.port}`;
	t.is((await got(s.url)).body, 'ok');
	t.is((await got(s.url)).req.agent.proxyUri, process.env.HTTP_PROXY);
	delete process.env.HTTP_PROXY;
});

test.after('cleanup', async () => {
	await s.close();
	await p.close();
	proxyEnvVars.forEach(value => delete process.env[value]);
});
