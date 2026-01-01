/* Copyright (c) 2021-2024 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Web interface to the expression system, server side. @module */

import fs from 'node:fs';
import * as esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import express from 'express';

/*
 * PS3 instructions: you are free to change this file if you want to add new features
 * or explore beyond the problem set.
 */

const app = express();

app.use('/img', express.static('img', { fallthrough: false }));

app.get('/bundle.js', async function(req, res, next) {
  res.contentType('application/javascript');
  const polyfill = polyfillNode({ globals: { buffer: false, process: false } });
  const bundle = await esbuild.build({
    entryPoints: [ './dist/src/web-client.js'],
    bundle: true,
    write: false,
    plugins: [ polyfill ],
  });
  for (const file of bundle.outputFiles) {
    res.write(file.text);
  }
  res.end();
});

app.get('/', function(req, res, next) {
  res.end(fs.readFileSync('lib/web.html', { encoding: 'utf-8' }));
});

const port = 8080;
app.listen(port).on('listening', () => console.log(`Memely web server listening on http://localhost:${port}`));
