const {Model, DataTypes, Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "../temp.db"
})

class User extends Model {}
User.init({
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
}, {sequelize})


class Message extends Model{}
Message.init({
    content: DataTypes.STRING,
    time: DataTypes.TIME,
    counts:DataTypes.STRING,
}, {sequelize})


class Like extends Model {}
Like.init({
    uID:DataTypes.STRING,
    counts2:DataTypes.STRING,
}, {sequelize})



User.hasMany(Message)
Message.belongsTo(User);

// Message.hasMany(Likes)
// Likes.belongsTo(Message);

(async()=>{
    sequelize.sync({force:true})
})()

module.exports = {
    User, 
    Message, 
    Like,
    sequelize
}

