const express = require("express");

const postDb = require("./postDb");
const userDb = require("../users/userDb");

const router = express.Router();

router.get("/", (req, res) => {
  postDb
  .get()
    .then(posts => {
      res.json(posts);
    })
    .catch((err) => res.status(500).json({ message: "Unable to retrieve Posts." }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  postDb
  .getById(id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message:  "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.post("/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "Content is Required." });
  } else {
    userDb
    .getById(id)
      .then(user => {
        if (user) {
          postDb
          .insert({ text, user_id: id })
            .then(() => {
              postDb
              .get().then(posts => {
                res.json(posts);
              });
            })
            .catch(() => {
              res.status(400).json({ message: "Unable to add post." });
            });
        } else {
          res.status(404).json({ message: "User could not be found." });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Unable to add Post." });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "Content is required." });
  } else {
    userDb
    .getById(id).then(user => {
      if (user) {
        postDb
        .update(id, { text })
          .then(result => {
            if (result) {
              postDb
              .get().then(posts => {
                res.status(203).json(posts);
              });
            } else {
              res.status(500).json({ message: "Unable to update Post." });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "Unable to Update Post." });
          });
      } else {
        res.status(404).json({ message: "User could not be found." });
      }
    });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  postDb
  .remove(id)
    .then(result => {
      if (result) {
        postDb
        .get().then(posts => {
          res.json(posts);
        });
      } else {
        res.status(400).json({ message: "Unable to delete Post." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Unable to delete Post." });
    });
});

module.exports = router;