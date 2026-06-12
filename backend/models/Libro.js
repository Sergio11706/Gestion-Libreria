module.exports = (sequelize, DataTypes) => {
  const Libro = sequelize.define('Libro', {
    id_libro: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editorial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio_costo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tiene_stock_bajo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Libro',
    timestamps: false
  });

  return Libro;
};
