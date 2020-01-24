const express = require('express');
const db = require('./userDb.js');
const postDb = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  db.insert(req.body).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(400).json({message: err});
  })
});

router.post('/:id/posts', validatePost, (req, res) => {
  if (req.body) {
    postDb.insert(req.body).then(response => {
      res.status(200).json(response);
    }).catch(err => {
      res.status(400).json({message: err});
    })
  }
});

router.get('/', (req, res) => {
  db.get().then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(400).json({message: err})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  db.getUserPosts(id).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(400).json({message: err});
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  db.remove(id).then(response => {
    res.status(200).json({success: true, response})
  }).catch(err => {
    res.status(400).json({message: err});
  })
});

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  db.update(id, req.body).then(response => {
    res.status(200).json(response);
  }).catch(err => {
    res.status(400).json({message: err});
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  db.getById(id).then(response => {
    if (response) {
      req.user = response;
      next();
    } else {
      res.status(400).json({message: 'Error'});
    }
  }).catch(err => {
    res.status(500).json({message: err});
  })
}

function validateUser(req, res, next) {
  if (req.body) {
    req.body.name ? next() : res.status(400).send({message: "missing required text field"});
  } else {
    res.status(400).send({message: "missing user data"});
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    req.body.text ? next() : res.status(400).json({message: "missing required text field"});
  } else {
    res.status(400).json({message: "missing post data"})
  }
}

module.exports = router;
