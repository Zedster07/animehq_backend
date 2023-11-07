
const {sequelize , Message } = require('../../config/database');
class CmsService { 
    

    static async getUnseenCount(data) {

        const { foru } = data;
        const [results, metadata] = await sequelize.query(
            `SELECT count(*) as ccuns from Messages where msg_receiver = ${foru} and msg_seen=0`,
        );

        return results;
    }


    static async addMessage(data) {
        return await Message.create(data);
    }

    static async updateMessage(data) {
        const {payload, id} = data;
        return await Message.update({...payload},{where:{id}});
    }

    static async getMessage(data) {

        const { msg_type, msg_sender, msg_receiver, filter } = data;

        /*
            MSG_TYPE:
                0 => normal message
                1 => report 
                    STATUS:
                        0 => waiting
                        1 => done
                2 => request
                    STATUS:
                        0 => waiting
                        1 => review
                        2 => working
                        3 => done
                        4 => reject
                3 => contact us

        */

        // let reqWhere = {};
        // reqWhere['msg_type'] = msg_type;

        // switch (msg_type) {
        //     case 0:
        //         reqWhere['msg_receiver'] = msg_receiver;
        //         reqWhere['msg_sender'] = msg_sender;
        //         break;
        //     case 1:
        //         if(filter!='all') {
        //             reqWhere['msg_sender'] = msg_sender;
        //         }
        //         break;
        //     case 2:
        //         if(filter!='all') {
        //             reqWhere['msg_sender'] = msg_sender;
        //         }
        //         break;
        //     case 3:
        //         if(filter!='all') {
        //             reqWhere['msg_sender'] = msg_sender;
        //         }
        //         break;

        //     default:
        //         break;
        // }


        const [results, metadata] = await sequelize.query(
            `SELECT * from Messages where msg_type = ${msg_type} and ( (msg_sender=${msg_sender} and msg_receiver=${msg_receiver}) OR (msg_sender=${msg_receiver} and msg_receiver=${msg_sender}))`,
        );

        return results;
    }

}

module.exports = CmsService;