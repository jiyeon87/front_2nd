// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.tsx';

const app = express();
const port = 3333;

// 간단한 메모리 내 캐시 객체
const cache: { [key: string]: { content: string; timestamp: number } } = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10분 (밀리초 단위)

app.get('*', (req, res) => {
  const cacheKey = req.url;
  const now = Date.now();

  // 캐시 확인
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return res.send(cache[cacheKey].content);
  }

  // 캐시된 내용이 없거나 만료된 경우 새로 렌더링
  const app = ReactDOMServer.renderToString(<App url={req.url}/>);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR</title>
    </head>
    <body>
      <div id="root">${app}</div>
    </body>
    </html>
  `;

  // 렌더링된 내용을 캐시에 저장
  cache[cacheKey] = { content: html, timestamp: now };

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});