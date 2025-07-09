const express = require('express');
const { addUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController, getCurrentUserController } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

const router = express.Router();

// users 
router.get('/user-profile', protect, getCurrentUserController);


// Admin-only actions
router.post('/add-user', protect, adminOnly, addUserController);
// router.get('/get-users', protect, getUsersController);
router.get('/', protect, getUsersController);
router.get('/:id', protect, adminOnly, getUserByIdController);
router.put('/:id', protect, updateUserController);
router.delete('/:id', protect, adminOnly, deleteUserController);

// user-only actions 


module.exports = router;
