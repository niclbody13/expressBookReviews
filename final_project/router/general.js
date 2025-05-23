const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
      return res.status(400).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }

 });

 // Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
  } else {
      return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let booksByTitle = Object.values(books).filter(book => book.title === title);
  if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
  } else {
      return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
      return res.status(200).json(book.reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// get all books using promise callbacks
public_users.get('/promise',function (req, res) {
  let getBooks = new Promise((resolve, reject) => {
      resolve(books);
  });
  getBooks.then((data) => {
      return res.status(200).json(data);
  }).catch((err) => {
      return res.status(500).json({message: "Error fetching books"});
  });
});

// get books by isbn using promise callbacks
public_users.get('/promise/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let getBookByIsbn = new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
          resolve(book);
      } else {
          reject({message: "Book not found"});
      }
  });
  getBookByIsbn.then((data) => {
      return res.status(200).json(data);
  }).catch((err) => {
      return res.status(404).json(err);
  });
});

// get books by author using promise callbacks
public_users.get('/promise/author/:author',function (req, res) {
  let author = req.params.author;
  let getBooksByAuthor = new Promise((resolve, reject) => {
      let booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
      } else {
          reject({message: "No books found for this author"});
      }
  });
  getBooksByAuthor.then((data) => {
      return res.status(200).json(data);
  }).catch((err) => {
      return res.status(404).json(err);
  });
});

// get books by title using promise callbacks
public_users.get('/promise/title/:title',function (req, res) {
  let title = req.params.title;
  let getBooksByTitle = new Promise((resolve, reject) => {
      let booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
          resolve(booksByTitle);
      } else {
          reject({message: "No books found with this title"});
      }
  });
  getBooksByTitle.then((data) => {
      return res.status(200).json(data);
  }).catch((err) => {
      return res.status(404).json(err);
  });
});

module.exports.general = public_users;
