const express =  require('express');
const {registerController,
  loginController,
  logoutController,
  refetchController,} = require("../controllers/authController");
  const router= express.Router();

//register
router.post('/register',registerController);

//login
router.post('/login',loginController);

//logout
router.get('/logout',logoutController);

// Fetch current user
router.get('/refetch',refetchController);

module.exports = router;