const https = require('https');

function getNewResults(price, query, latLong) {
  return new Promise((resolve, reject) => {
    let data = '';
    https
      .get(`https://sfbay.craigslist.org/jsonsearch/apa/?max_price=${price || 2000}${query && '&query=' + query || ''}`, res => {
        res.on('data', d => {
          data += d.toString();
        });
        res.on('error', err => reject(err));
        res.on('end', () => {
          data = JSON.parse(data);
          let results = data[0];
          resolve(results);
        });
      });
  });
}

async function doWork() {
  const results = [];
  const toSearch = [
    'temescal+studio', 'rockridge+studio', 'mosswood+studio',
    'piedmont+avenue+studio', 'piedmont+ave+studio', 'adams+point+studio'
  ];
  for (const search of toSearch) {
    const res = await getNewResults(1500, search);
    results.push(...res);
  }
  // pretty print it for testing. just return result on EC2
  for (const result of results) {
    console.log(`${result.Ask}: ${result.PostingTitle}`);
    console.log(`    Url: ${result.PostingURL}`);
  }
}

doWork();
