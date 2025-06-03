const express = require('express');
const { addUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

const router = express.Router();

// Admin-only actions
router.post('/add-user', protect, adminOnly, addUserController);
router.get('/get-users', protect, adminOnly, getUsersController);
router.get('/:id', protect, adminOnly, getUserByIdController);
router.put('/:id', protect, adminOnly, updateUserController);
router.delete('/:id', protect, adminOnly, deleteUserController);

module.exports = router;
