module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Usuario',
    timestamps: false
  });

  return Usuario;
};
