const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing =require("../models/listing.js");
const mongo_url ='mongodb://127.0.0.1:27017/wonderlust'


main().then(()=>{
    console.log("connecter to db")
}).catch((err)=>{
    console.log(err)
});

async function main() {
  await mongoose.connect(mongo_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initdb = async ()=> {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
        ...obj,owner:"6547cb0aa5f44cb05858797a"
    }));
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initdb();