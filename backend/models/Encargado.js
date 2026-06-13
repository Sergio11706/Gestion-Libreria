const { sequelize, DataTypes } = require('../config/database');

const Encargado = sequelize.define('Encargado', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id_usuario'
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Encargado',
  timestamps: false
});

module.exports = Encargado;
