const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'gestion_libreria', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false
});

const Usuario = require('../models/Usuario')(sequelize, DataTypes);
const Encargado = require('../models/Encargado')(sequelize, DataTypes);
const Empleado = require('../models/Empleado')(sequelize, DataTypes);
const Libro = require('../models/Libro')(sequelize, DataTypes);

Usuario.hasOne(Encargado, {
  foreignKey: 'id_usuario',
  sourceKey: 'id_usuario',
  as: 'encargado'
});
Encargado.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  targetKey: 'id_usuario',
  as: 'usuario'
});

Usuario.hasOne(Empleado, {
  foreignKey: 'id_usuario',
  sourceKey: 'id_usuario',
  as: 'empleado'
});
Empleado.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  targetKey: 'id_usuario',
  as: 'usuario'
});

module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  Encargado,
  Empleado,
  Libro
};
