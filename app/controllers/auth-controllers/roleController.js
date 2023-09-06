const config = require('../../config/config');
const User = require('../../models/auth-models/user');
const Role = require('../../models/auth-models/role');
const hasRole = require('../../models/auth-models/hasRole');
const RoleService = require('../../services/auth-service/roleServices');

class RoleController {

    /**
   * create a new role .
   * @function
   * @async
   * @param {object} req - Express request object { name } .
   * @param {object} res - Express response object .
   */
    static async createRole(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            const {name} = req.body;
            await RoleService.new(name);
            res.status(200).json({message: "Role added"});
        } catch (error) {
            res.status(500).json({message: "Something wrong happened"});
        }
    } 


   /**
   * remove a role .
   * @function
   * @async
   * @param {object} req - Express request object .
   * @param {object} res - Express response object .
   */
    static async removeRole(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            const id = req.params.id;
            await RoleService.remove(id);
            res.status(200).json({message: "Role removed"});
        } catch (error) {
            switch (error.message) {
                case 'roleNotFound':
                    res.status(404).json({message: "Role Not Found"});
                    break;

                default:
                    res.status(500).json({message: "Something wrong happened"});
                    break;
            }
        }
    } 

    /**
   * update a role name.
   * @function
   * @async
   * @param {object} req - Express request object .
   * @param {object} res - Express response object .
   */
    static async updateRole(req , res ) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            const {roleid, name} = req.body;
            await RoleService.updateRole({id:roleid, name});
            res.status(200).json({message: "Updated!"}); 
        } catch (error) {
            switch (error.message) {
                case 'roleNotFound':
                    res.status(404).json({message: "Role Not Found"});
                    break;
            
                default:
                    res.status(500).json({message: "Something wrong happened"});
                    break;
            }
        }
    }

    /**
   * returns a list of roles.
   * @function
   * @async
   * @param {object} req - Express request object .
   * @param {object} res - Express response object .
   */
    static async getRoles(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            const roles = await RoleService.getall();
            res.status(200).json(roles); 
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something wrong happened"});
        }
        
    } 

    

    /**
   * fetchs a role.
   * @function
   * @async
   * @param {object} req - Express request object .
   * @param {object} res - Express response object .
   */
    static async getRole(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            const id = req.params.id;
            const role = await RoleService.getOne(id);
            res.status(200).json(role); 
        } catch (error) {
            res.status(500).json({message: "Something wrong happened"});
        }
    } 


   /**
   * assign a role to a user in an organization with specific permissions.
   * @function
   * @async
   * @param {object} req - Express request object { userid , organization_id, permissions , roleid }.
   * @param {object} res - Express response object .
   */
    static async assignRole(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            await RoleService.assign(req.body);
            res.status(200).json({message: "Role Assigned"});
        } catch (error) {
            console.log(error.message);
            switch (error.message) {
                case "Validation error":
                    if(error.name = "SequelizeUniqueConstraintError") {
                        res.status(401).json({message: "User Already Have that role"});
                        break;
                    }
                case 'roleNotFound':
                    res.status(404).json({message: "Role Not Found"});
                    break;

                case 'userNotFound':
                    res.status(404).json({message: "User Not Found"});
                    break;
                default:
                    res.status(500).json({message: "Something wrong happened"});
                    break;
            }
        }
       
    }


   /**
   * revoke a role from a user in an organization.
   * @function
   * @async
   * @param {object} req - Express request object { userid , organization_id , roleid }.
   * @param {object} res - Express response object .
   */
    static async revokeRole(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try{
            const { userid , organization_id , roleid } = req.body;
            await RoleService.revoke({ userid , organization_id , roleid } );
            res.status(200).json({message: "Role revoked"});
        } catch (error) {
            switch (error.message) {
                case 'roleNotFound':
                    res.status(404).json({message: "Role Not Found"});
                    break;

                case 'userNotFound':
                    res.status(404).json({message: "User Not Found"});
                    break;
            
                default:
                    res.status(500).json({message: "Something wrong happened"});
                    break;
            }
        }
    } 

    /**
     * update a user's permissions.
     * @function
     * @async
     * @param {object} req - Express request object { permissions , roleid , userid , organization_id }.
     * @param {object} res - Express response object .
     */
    static async updatePermissions(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            const { permissions , roleid , userid , organization_id } = req.body;
            await RoleService.updatePermissions({ permissions , roleid , userid , organization_id });
            res.status(200).json({message: "Permissions updated"});
            
        } catch (error) {
            switch (error.message) {
                case 'roleNotFound':
                    res.status(404).json({message: "Role Not Found"});
                    break;

                case 'userNotFound':
                    res.status(404).json({message: "User Not Found"});
                    break;
            
                default:
                    res.status(500).json({message: "Something wrong happened"});
                    break;
            }
            
        }
    }

    /**
     * get the stuff members of an organization.
     * @function
     * @async
     * @param {object} req - Express request object { permissions , roleid , userid , organization_id }.
     * @param {object} res - Express response object .
     */
    static async getStaff(req ,res) {
        // #swagger.tags = ['Roles']
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        try {
            let organization_id = req.params.id;
            const staff = await RoleService.getStaff({organization_id});
            res.status(200).json(staff);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something wrong happened"});
        }
    }
}

module.exports = RoleController;