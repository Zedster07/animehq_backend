const {sequelize , User , hasRole , Role} = require('../../config/database'); 
const UserService = require('./userServices');

class RoleService {
    static async new(name) {
       await Role.create({name});
    }

    static async remove(id) {
        if(!checkRole){
            throw new Error('roleNotFound');
        } else {
            await Role.destroy({where:{id}});
        }
    }


    static async updatePermissions(payload){
        const { permissions , userid , organization_id , roleid } = payload;
        const checkUser = await UserService.getUserById(userid);
        const checkRole = await Role.findOne({where: {id:roleid}});
        if (!checkUser) {
            throw new Error('userNotFound');
        } else if(!checkRole){
            throw new Error('roleNotFound');
        } else {
            const affectedRows = await hasRole.update({permissions}, {where:{UserId:userid, RoleId: roleid , organization: organization_id}});
            if(affectedRows[0] <= 0) {
                throw new Error("Nothing to Update");
            }
        }
        
    }

    static async updateRole(payload){
        const { id, name } = payload;
        const checkRole = await Role.findOne({where: {id}});
        if(!checkRole){
            throw new Error('roleNotFound');
        } else {
            await Role.update({name}, {where:{id}});
        }
    }

    static async assign(payload) {
        const { userid , organization_id, permissions , roleid } = payload;
        const checkUser = await UserService.getUserById(userid);
        const checkRole = await Role.findOne({where: {id:roleid}});
        if (!checkUser) {
            throw new Error('userNotFound');
        } else if(!checkRole){
            throw new Error('roleNotFound');
        } else {
            await hasRole.create({UserId: userid, organization: organization_id, permissions, RoleId: roleid});
        }
    }

    static async revoke(payload) {
        const { userid , organization_id , roleid } = payload;
        const checkUser = await UserService.getUserById(userid);
        const checkRole = await Role.findOne({where: {id:roleid}});
        if (!checkUser) {
            throw new Error('userNotFound');
        } else if(!checkRole){
            throw new Error('roleNotFound');
        } else {
            await hasRole.destroy({where:{UserId: userid, organization: organization_id, RoleId: roleid}});
        }
    }

    static async getall() {
        return await Role.findAll();
    }

    static async getOne(id) {
        return await Role.findOne({where:{id}});
    }

    static async getRoleByName(name) {
        return await Role.findOne({where:{name}});
    }

    static async getStaff(payload) {
        const { organization_id } = payload;
        const usersInOrganization = await User.findAll({
            where: {
                id: {
                [sequelize.Sequelize.Op.in]: sequelize.literal(`
                    ( SELECT UserId FROM hasRoles WHERE organization = ${organization_id} )
                `),
                },
            },
            include:{
                model: Role,
                through: hasRole
            }
        });
        return usersInOrganization;
    }
}

module.exports = RoleService;