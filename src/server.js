require("dotenv").config();
// This lines allows use to use the.env file
require("./db/connection");
// This imports and runs the database connection function we wrote in the in the connection.js file

const Book = require("./models/bookmodel");

const express= require("express");
// This imports the express NPM library for use to use.
const app = express()
// This gives us the option to use app. instead of express. and is the expected convention when using express js.

app.use(express.json())
// This runs the middleware function express.json which allows use to use JSON on body part of the HTTP


//Now to the server code:
app.post("/books/addbook", async (req, res) => {
    console.log("Req Body:" ,req.body)

    //code for adding book to database goes here
    const result = await Book.create({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre
    })
    console.log(result)


    const successResponse = {
        message: "Book successfully added",
        dbresponse: result
    }

    res.status(201).send(successResponse);
});

app.get("/books/listbooks", async(req,res) => {
    const listOfBooks = await Book.find({});

    const successResponse = {
        message: "List of Books Found is as follows:",
        books: listOfBooks
    };
    res.status(200).send(successResponse);

})

app.put("/books/updateBook", async (req,res) =>{

    //code for updating the author and genre of a book goes here
    const updateBook1 = await Book.findOneAndUpdate({title: req.body.title},{author: req.body.author},{new:true})
    const updateBook2 = await Book.findOneAndUpdate({title: req.body.title},{genre:req.body.genre},{new:true})
    
    //the purpose of explanation is not equal too
    if (updateBook1 !== null && updateBook2 !== null){

    const successResponse = {
        message: "Book has been updated",
        books: updateBook2
    };
res.status(200).send(successResponse)
    } else {
        res.status(418).send("The book has not been updated")
    }
})

app.delete("/books/deleteBook", async(req,res) =>{
    //code for deleting a book from the database goes here
const destroy = await Book.deleteOne({
    title: req.body.title

})
    console.log(destroy)
    if (destroy.deletedCount == 1) {
        const successResponse = {message:"Books successfully deleted"}
        res.status(200).send(successResponse)
    }
    else {
        const failureResponse = {message:"failed to delete book"}
        res.status(418).send(failureResponse)
    }
})

const port = process.env.PORT

app.listen(port, () => console.log(`Server is listening on port ${port}`))