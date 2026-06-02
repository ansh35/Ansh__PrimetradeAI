import http from 'http';

http.get('http://localhost:5174/src/index.css', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('CSS length:', data.length);
    console.log('Contains background:', data.includes('--background:'));
    console.log('Contains tailwind utilities:', data.includes('.flex'));
  });
}).on('error', err => console.log('Error:', err.message));
