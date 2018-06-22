const express  = require('express'),
      ObjectID = require('mongodb').ObjectID

let router = express.Router()

router.use((req, res, next) => {
  next()
})

router.post('/approve', (req, res) => {
  req.db.collection('videos').update({ _id: ObjectID(req.body.id) }, { $set: { approved: true } }, (err, results) => {
    console.log('Approved ' + req.body.id)
    res.redirect('/admin/unapproved')
  })
})

router.post('/unapprove', (req, res) => {
  req.db.collection('videos').update({ _id: ObjectID(req.body.id) }, { $set: { approved: false } }, (err, results) => {
    console.log('Removed ' + req.body.id + ' from approved')
    res.redirect('/admin')
  })
})

router.post('/update', (req, res) => {
  let videos = req.body.videos

  for (let i = 0; i < videos.length; i++) {
    let objId = videos[i].objId,
        channel = videos[i].channels,
        notInEverything = (videos[i].notInEverything == 'true')

    req.db.collection('videos').update({ _id: ObjectID(objId) }, { $set: { channel: channel, notInEverything: notInEverything } }, (err, results) => {
      console.log('Updated ' + objId + ' with channel ' + channel + ' and flag notInEverything: ' + notInEverything)
    })
  }
})

router.post('/delete', (req, res) => {
  req.db.collection('videos').remove({ _id: ObjectID(req.body.id) }, (err, results) => {
    console.log('Deleted ' + req.body.id)
    res.redirect(req.get('referer'))
  })
})

module.exports = router