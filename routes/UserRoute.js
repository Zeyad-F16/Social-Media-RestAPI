const express  = require('express');
const router = express.Router();
const  {getUserController,updateUserController,followUserController,unFollowUserController } = require('../controllers/UserController');

//Get User
router.get('/:userId', getUserController);

// Update User
router.put('/update/:userId',updateUserController);

//Follow User
router.put('/follow/:userId',followUserController);

//UnFollow User
router.put('/unfollow/:userId',unFollowUserController);


module.exports = router;