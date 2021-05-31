var express = require('express');
const app = require('../app');
var router = express.Router();
var User = require('../index')
/* GET users listing. */

router.post('/newUser', async (req, res) => {
  const phone = await User.findOne({ mobile: req.body.mobile })
  if (phone) {
    res.status(409).json({ message: "phone number already exist!!" })
  }
  if (req.body.mobile) {
    await User.create(req.body);
    res.status(200).json({ message: "done" })
  } else {
    res.status(404).json({ message: "phone number is compulsory!!" })
  }
});
router.put('/updateUser', async (req, res) => {
  await User.updateOne({ mobile: req.body.mobile }, req.body);
  res.status(200).json({ message: "done" })
});
router.get('/getUsers/:page', async (req, res) => {
  var p = 10
  const user = await User.find({}).sort({ createdAt: 1 }).skip(p * Number(req.params.page));
  res.status(200).json(user)
});
router.get('/:longitude/:latitude', async (req, res) => {

  var data = await User.aggregate([
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ Number(req.params.longitude) , Number(req.params.latitude) ] },
         distanceField: "calculated",
         maxDistance: 500000000
         
      }
    },
    {
      $sort:{calculated:1}
    }
  ])

  res.status(200).json(data)
})
router.delete('/deleteUser',async (req,res)=>{
  await User.deleteOne({mobile:req.body.mobile});
  res.status(200).json("deleted")
})
module.exports = router;
