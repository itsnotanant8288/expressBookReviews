const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(300).json({ message: "Username or Password missing" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  let username = req.session.authorization['username'];

  let comment = req.body.comment;

  let isbn_code = req.params.isbn;

  if(books.hasOwnProperty(isbn_code))
  {
    let reviews = books[isbn_code].reviews;
    if(reviews.hasOwnProperty(username))
    {
      books[isbn_code].reviews[username].comment = comment;
    }
    else
    {
      let newComment = {
        comment : comment
      }
      books[isbn_code].reviews[username]=newComment;
    }
  }

  return res.status(200).json(books[isbn_code]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here

  let username = req.session.authorization['username'];

  let isbn_code = req.params.isbn;

  if(books.hasOwnProperty(isbn_code))
  {
    let reviews = books[isbn_code].reviews;
    if(reviews.hasOwnProperty(username))
    {
      delete books[isbn_code].reviews[username];
    }
  }

  return res.status(200).json(books[isbn_code]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
