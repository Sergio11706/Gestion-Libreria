const { sequelize } = require('./database');
const Usuario = require('../models/Usuario');
const Encargado = require('../models/Encargado');
const Empleado = require('../models/Empleado');
const Libro = require('../models/Libro');

// Asociaciones
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
  Usuario,
  Encargado,
  Empleado,
  Libro
};
