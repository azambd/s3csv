const fs = require('fs');
const csv = require('csv-parser');

//File Name
//  s3://inputs-dev-digitalshelf/scrapers/import/development/outgoing/master_list/core/
// :source.country/MasterList_:source.input_name_:source.country_Regular.csv`
const source = 'TestAmazon';
const source_country = 'CA';
const filename = 'MasterList_' + source + '_' + source_country + '_Regular.csv';

const outdata = [];

let count =1;
fs.createReadStream('in-scraper.csv')
  .pipe(csv())
  .on('data', function(row) {
   
    count +=1;

    const indata = {
        RPC: row.RPC,
    };
    if (count <= 1001){
    outdata.push(indata);}
    
  })
  .on('end', function() {
    console.table(outdata);
    console.log('Total Count: '+ count);
    writeToCSVFile(outdata);
  });

function writeToCSVFile(outdata) {
//   const filename = 'output-test.csv';

  fs.writeFile(filename, extractAsCSV(outdata), err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.log(`saved as ${filename}`);
    }
  });
}

function extractAsCSV(outdata) {
  const header = ['RPC'];
  const rows = outdata.map(
    dataItem => `${dataItem.RPC}`
  );

  return header.concat(rows).join('\n');
}