const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const request = require('request');
const del = require('del');
const gulp = require('gulp');
const zip = require('gulp-zip');
const html2sketch = require('../src/html2sketch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// request html to sketch
router.get('/html2sketch', function(req, res, next) {
  const url = req.query.url;
  request(url, function (err, response, body) {
    if(err){
      res.status(500);
      res.send({
        message: 'Please check address.'
      });
    } else {
      html2sketch(url, function (onlyUrl , folderId) {
        gulp.src('./build-plugin/' + folderId + '/**/*')
          .pipe(zip(onlyUrl + '-HTMLtoSketch.zip'))
          .pipe(gulp.dest('./build-plugin/' + folderId))
          .on('finish', function () {
            const filename = onlyUrl +'-HTMLtoSketch.zip';
            const fileData = fs.readFileSync(path.join(__dirname, '../build-plugin/' + folderId + '/' + filename), 'base64');
            del.sync('./build-plugin/' + folderId, {force: true});

            res.send({
              fileData: fileData,
              fileName: filename
            });

          });
      }).catch(e => {
        console.log(e);
        res.status(500);
        res.send({
          message: 'Please check address.'
        });
      });
    }

  });


});

module.exports = router;
