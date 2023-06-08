const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    GET api/profile/me
//@desc    get current users profile
//@access    Profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this User' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Eroor');
  }
});

//@route    POST api/profile
//@desc    create or update user profile
//@access    Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').notEmpty(),
      check('skills', 'Skills is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Hello');
  }
);

//@route    GET api/profile
//@desc   get all user profile
//@access    Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route    GET api/profile/user/:user_id
//@desc   get user profile by user id
//@access    Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});
//@route    delete api/profile
//@desc   delete  profile,user and posts
//@access    private
router.delete('/', auth, async (req, res) => {
  try {
    //todo-remove users posts

    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    put api/profile/experience
//@desc   add profile experience
//@access    private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log('exppp');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    delete api/profile/experience/:exp_id
//@desc      delete  experience from profile
//@access    private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //get the remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@desc PUT some new education into the profile of current user.
//@route PUT/api/profile/education
//private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is Required').not().isEmpty(),
      check('degree', 'degree is Required').not().isEmpty(),
      check('fieldofstudy', 'field of study is Requreid').not().isEmpty(),
      check('from', 'Date is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// //@desc PUT some new education into the profile of current user.
// //@route PUT/api/profile/education
// //private
// router.put(
//   '/education',
//   [
//     auth,
//     [
//       check('school', 'school is Required').not().isEmpty(),
//       check('degree', 'degree is Required').not().isEmpty(),
//       check('fieldofstudy', 'field of study is Requreid').not().isEmpty(),
//       check('from', 'Date is Required').not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//       return res.status(400).json({ error: error.array() });
//     }
//     const { school, degree, fieldofstudy, from, to, current, description } =
//       req.body;
//     const newEdu = {
//       school,
//       degree,
//       fieldofstudy,
//       from,
//       to,
//       current,
//       description,
//     };

//     try {
//       console.log('1');
//       const profile = await Profile.findOne({ user: req.user.id });
//       console.log('2');

//       profile.education.unshift(newEdu);
//       console.log('3');
//       await profile.save();
//       console.log('4');
//       res.json(profile);
//     } catch (err) {
//       console.log(err.message);
//       res.status(500).json({ msg: 'Server Error' });
//     }
//   }
// );

//@route    delete api/profile/education/:edu_id
//@desc      delete  education from profile
//@access    private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //get the remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route    get api/profile/github/:username
//@desc      get user repos from github
//@access    public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&
          client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.log(error.message);
      }
      if (response.statusCode != 200) {
        return res.status(400).json({ msg: 'profile does not exits.' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});
module.exports = router;
