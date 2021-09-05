require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_DBNAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    }
);

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING
    }
})
/*
*One to One relationship
*/
const Profile = sequelize.define("Profile", {
  birthday: {
      type: DataTypes.DATE
  }
})
//when user is deleted, profile goes with it
User.hasOne(Profile, {
  onDelete: "CASCADE"
});
Profile.belongsTo(User);

/*
*One to Many
*/
const Order = sequelize.define("Order", {
  shipDate: {
      type: DataTypes.DATE
  }
})
User.hasMany(Order);
Order.belongsTo(User);

/*
*Many to Many
*/
const Class = sequelize.define("Class", {
  className: {
      type: DataTypes.STRING
  },
  startDate: {
    type: DataTypes.DATE
  }
})
User.belongsToMany(Class, [ through: "User_Classes" ])
Class.belongsToMany(User, [ through: "User_Classes" ])

;(async() => {
    // try {
    //     await sequelize.authenticate();
    //     console.log('Connection has been established successfully.');
    //   } catch (error) {
    //     console.error('Unable to connect to the database:', error);
    //   }
    await sequelize.sync({ force: true });

    let my_user = await User.create({ username: "Justin" })
    let my_profile = await Profile.create({ birthday: new Date() })
    console.log(await my_user.setProfile())
    await my_user.setProfile(my_profile)
    console.log(await my_user.getProfile())

    let resultUser = await User.findOne({
      where: {
        id: 1
      }
    })
})();