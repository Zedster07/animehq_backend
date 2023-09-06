// routes/userRoutes.js
const express = require('express');
const RoleController = require('../../controllers/auth-controllers/roleController');
const authMiddleware = require('../../middlewares/authMiddleware');
const proRoleMiddleware = require('../../middlewares/proRoleMiddleware');
const superRoleMiddleware = require('../../middlewares/superRoleMiddleware');
const router = express.Router();



const config = require('../../config/config');
const isAdmin = require('../../middlewares/isAdmin');
router.use(config.routes.role.prefix , router);


// Assign Role : req { userid , organization_id, permissions , roleid }
router.post('/assign', authMiddleware , isAdmin , RoleController.assignRole);

// Revoke Role : req { userid , organization_id , roleid }
router.post('/revoke', authMiddleware , isAdmin , RoleController.revokeRole);

// Get Organization Staff list : req { organization_id }
router.get('/staff/:id', authMiddleware , isAdmin , RoleController.getStaff);

// Update User Permissions : req { permissions , userid , roleid, organization_id }
router.post('/update', authMiddleware , isAdmin , RoleController.updatePermissions);




// Add a new Role to the platform : req { name }
router.post('/create', authMiddleware , isAdmin , RoleController.createRole);

// Remove a Role from the platform
router.get('/remove/:id', authMiddleware , isAdmin , RoleController.removeRole);

// Update a Role name in the platform : req { name , roleid }
router.post('/update', authMiddleware , isAdmin , RoleController.updateRole);

// get Role name by id : req { roleid }
router.get('/:id', authMiddleware , isAdmin , RoleController.getRole);

// get All roles of the platform
router.get('/', authMiddleware , isAdmin , RoleController.getRoles);


module.exports = router;