// Using Node.js `require()`


const mongoose = require('mongoose');

const DB = process.env.MONGO_URL;


mongoose.connect(DB,{dbName:"Conversify"})
  .then(() => console.log('Connected!'))
  .catch((e)=>{console.log(e)});

  