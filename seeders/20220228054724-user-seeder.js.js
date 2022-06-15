'use strict';
const bcrypt = require('bcryptjs');

const password = '12345678'
const hash = bcrypt.hashSync(password, 10);

// async function hash(password) {
//   const salt = await bcrypt.genSalt(10);
//   const passwprdHash = await bcrypt.hash(password, salt);  

//   return passwprdHash;
// }

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users',[
      {
        firstName:"Test",lastName:"One",email:'testone@yopmail.com',password:hash,role_id:"1",createdAt:new Date(),updatedAt:new Date(),
      },

      
   ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users',{},null);
  }
};
