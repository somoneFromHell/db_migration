var sql = require('mssql');
const { MongoClient } = require('mongodb');
const fs = require('fs');

// ---------------------MONGO-----------------------
const mongoConnection = 'mongodb+srv://bweb:development@cluster0.giyvhxn.mongodb.net/simmonsrana_database?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function connectToMongoDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      return client;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error; // Re-throw the error to handle it elsewhere if needed
    }
  }


// <add name="ConnectionString" connectionString="data source=95.111.227.0,1433;database=simmonsrana_db;user id=simmonsrana_un;password=Rbm4m5_8" providerName="System.Data.SqlClient" />

var dbConfig = {
    user: 'simmonsrana_un',
    password: 'Rbm4m5_8',
    database: 'simmonsrana_db',
    server: '95.111.227.0',
    port:1433,
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
      }
 
};


const connection = new sql.ConnectionPool(dbConfig);

async function connect() {
    try {
      await sql.connect(dbConfig);
      console.log('Connected to the SQL');
      
    } catch (err) {
        console.error('Error connecting to the SQL:', err);
      }


        
      const tables = await sql.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
    `);
    const staticTables = tables.recordset

    // const staticTables =  [
    //     { TABLE_NAME: 'TaxRateMaster' },
    //     { TABLE_NAME: 'TempCartMaster' },
    //     { TABLE_NAME: 'VideoMaster' },
    //     { TABLE_NAME: 'ViewMaster' },
    //     { TABLE_NAME: 'WeightParameter' },
    //     { TABLE_NAME: 'CustomProductColorMaster' },
    //     { TABLE_NAME: 'CustomerMaster' }
    // ]
        
   
try {
    for (const item of staticTables) {
        if( item.TABLE_NAME.includes("CustomProduct")){
            console.log(`Table ${item.TABLE_NAME} is SKIPPED`)
        }else{
            console.log(`Fetching table number ${staticTables.indexOf(item)} ${item.TABLE_NAME}`);
            const result = await sql.query(`SELECT * FROM ${item.TABLE_NAME}`);
            
            const resultWithId = result.recordset.map(entry => ({ ...entry, _id: entry[Object.keys(entry)[0]] }));

            fs.writeFileSync(`data/${item.TABLE_NAME}.json`, JSON.stringify(resultWithId, null, 2));
            console.log(`New file ${item.TABLE_NAME}.json created ________________________________`);
        }
      }
    console.log("operation completed! successfully")
      
} catch (error) {
    console.log("operation failed! \n",error)
}
          
  }
  
  connect();