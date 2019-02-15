const express = require("express");

const router = express.Router();

const userDb = require("./userDb");

const upperCase = (req, res, next) => {
  req.body.name = req.body.name.toUpperCase();
  next();
};

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      res.json(users);
    })
    .catch(() =>
      res.status(500).json({ message: "Not able to Retrieve User Information" })
    );
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  userDb
    .getById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Not able to retrieve user" });
    });
});

router.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  userDb
    .getUserPosts(id)
    .then(posts => {
      res.json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: "Not able to retrieve posts" });
    });
});

router.post("/", upperCase, (req, res) => {
  const name = req.body.name;
  if (!name) {
    res.status(400).json({ message: "You must Include a Name" });
  } else {
    userDb
      .insert({ name })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({ message: "Unable to Add User" });
      });
  }
});

router.put("/:id", upperCase, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  userDb
    .update(id, { name })
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else {
        res.status(200).json({ user, message: "The user has been updated." });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: "The user information could not be updated."
      })
    );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  userDb
    .remove(id)
    .then(user => {
      if (user) {
        userDb.get().then(users => {
          res.json(users);
        });
      } else {
        res.status(404).json({ message: "User Could Not be Found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Server Error" });
    });
});

module.exports = router;
