var fs = require('fs');
// for(let i=0 ; i<20; i++){
// //     fs.readFile('../_contents/en-us/data/index.db', 'utf8', function(err, data) {  
// //         if (err) throw err;
// //         console.log(typeof data, i);
// //     });
// // }


var data = '';
var readStream = fs.createReadStream('../.inmemory');
readStream.setEncoding('utf8');

// Process read stream events.
// Data reading event.
readStream.on('data', function(chunk) {
   data += chunk;
}).on('end',function(){
   // Output read data to console.
   console.log("data", JSON.stringify(data))
});
//}


// const nedb_1 = require("nedb");
// db = new nedb_1({ filename: '../_contents/en-us/data/index.db', corruptAlertThreshold: 1, autoload: true });
// db.ensureIndex({ fieldName: 'uid'});
// for(let i=0 ; i<600000; i++){
// let _id = 'blt'+Math.floor((Math.random() * 20000) + 1);
// //console.log(_id)

// db.find({uid : _id}, function (err, docs) {
//     if (err)
//         return reject(err);   
//     console.log(docs,"docs",i)
// });
// }