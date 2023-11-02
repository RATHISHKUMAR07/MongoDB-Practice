const express = require('express');
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db');

// Initialize Express app
const app = express();
//It is used to get data as json through url
app.use(express.json())

// Connect to the database and start the server
connectToDb((err) => {
    if (!err) {
        // Start the Express server
        app.listen(3000, () => {
            console.log("App is running on port 3000");
        });
        // Get the database connection
        db = getDb();
    }
});

// Define a route to retrieve books from the database
app.get('/books', (req, res) => {

    //if p=0 zero it will take zero for page http://localhost:3000/books?p=0
    //if http://localhost:3000/books it will assign zero to page 
    const page = req.query.p || 0
    const booksPerPage = 2


    let books = [];

    // Use the db connection to access the 'books' collection
    db.collection('books')
        .find()
        .sort({ author: 1 })
        //it is used to skip in this case if p is 0 means
        //it will show first 2 data as per the booksPerPage
        //if p = 1 means it will show next 2 data
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Could not fetch the documents' });
        });
});


app.get('/books/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id) })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not fetch the documents' });
        })   
    }
    else {
        res.status(500).json({error: 'Not a valid document id'})
    }
    

})

app.get('/books/:id/genres', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then(doc => {
            res.status(200).json(doc.genres)
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not fetch the documents' });
            }) 
    }
    else {
        res.status(500).json({error: 'Not a valid document id'})
    }
})

app.get('/books/author', (req, res) => {
    const author = [];

    // Use the db connection to access the 'books' collection
    db.collection('books')
        .find()
        .sort({ author: 1})
        .forEach(book => author.push(book.author))
        .then(() => {
            res.status(200).json(author);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Could not fetch the documents' });
        });
});

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
        res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ err: 'Could not create a document' })
            
        })
})

app.delete('/books/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)) {
        
        db.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then(result => {
            res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not delete the document'})
            })
    }
    else {
        res.status(500).json({error: 'Not a valid document Id'})
    }
})

//Patch is used to update 
app.patch('/books/:id', (req, res) => {
    //req.body is used to get data from id: json
    const updates = req.body


    if (ObjectId.isValid(req.params.id)) {
        
        db.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id) },{$set: updates})
            .then(result => {
            res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not update the document'})
            })
    }
    else {
        res.status(500).json({error: 'Not a valid document Id'})
    }
})