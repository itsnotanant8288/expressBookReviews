const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if( !username || !password)
  {
    return res.status(300).json({message: "Username or Password missing"});
  }

  if(isValid(username))
  {
    let newUser = {
      username: username,
      password: password
    };
    users.push(newUser);

    return res.status(200).json(newUser);
  }
  else
  {
    return res.status(300).json({message: "Yet to be implemented"});
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  let isbn_code = req.params.isbn;

  if(books.hasOwnProperty(isbn_code))
  {
    let book = books[isbn_code];
  }

  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let filteredBooks = [];

  let authorName = req.params.author;

  for (let isbn in books) {
    if (books.hasOwnProperty(isbn)) {
        let book = books[isbn];
        if (book.author === authorName) {
            filteredBooks.push({ isbn, ...book });
        }
    }
}
  
  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let filteredBooks = [];

  let title = req.params.title;

  for (let isbn in books) {
    if (books.hasOwnProperty(isbn)) {
        let book = books[isbn];
        if (book.title === title) {
            filteredBooks.push({ isbn, ...book });
        }
    }
}
  
  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  let isbn_code = req.params.isbn;
  let review;

  if(books.hasOwnProperty(isbn_code))
  {
    review = books[isbn_code].reviews;
  }

  return res.status(200).json(review);
});

module.exports.general = public_users;
