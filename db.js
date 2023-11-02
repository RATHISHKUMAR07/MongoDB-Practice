const { MongoClient } = require('mongodb');

let dbConnection; // Variable to hold the database connection

// Place the password within single or double quotes
// MongoDB Atlas online database it will not store data in local it will store in online Atlas
let uri = 'mongodb+srv://rathish:dexter123@cluster0.s6zy1bx.mongodb.net/?retryWrites=true&w=majority';

module.exports = {
    // Function to connect to the MongoDB database
    connectToDb: (callback) => {
        MongoClient.connect(uri)
            .then((client) => {
                // Store the database connection in dbConnection
                dbConnection = client.db();
                return callback(); // Call the provided callback function when the connection is successful
            })
            .catch(err => {
                console.log(err); // Log any connection errors
                return callback(err); // Call the provided callback function with the error if there is an error
            });
    },
    // Function to get the database connection
    getDb: () => dbConnection,
};
