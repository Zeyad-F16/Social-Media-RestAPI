const express  = require('express');
const router = express.Router();
const  {getUserController,
     updateUserController,
     followUserController,
   unFollowUserController,
      blockUserController,
    unblockUserController,
      blockListController,
     deleteUserController,
     searchUserController,
     uploadImageController} = require('../controllers/UserController');


 const uploadImage= require('../middlewares/uploadImageMiddleware');    
     

//Get User
router.get('/:userId', getUserController);

// Update User
router.put('/update/:userId',updateUserController);

//Follow User
router.post('/follow/:userId',followUserController);

//UnFollow User
router.post('/unfollow/:userId',unFollowUserController);

//Block User
router.post('/block/:userId',blockUserController);

//unBlock User
router.post('/unblock/:userId',unblockUserController);

//Blocklist User
router.get('/blocklist/:userId',blockListController);

//Delete User
router.delete('/deleteuser/:userId',deleteUserController);

//search User
router.get('/search/:query',searchUserController);

//Upload profile picture
router.put('/upload-profile-picture/:userId', uploadImage.single("profilePicture"), uploadImageController);

module.exports = router;