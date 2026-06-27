const { Usuario, Encargado } = require('./sequelize');

const seedEncargadoDemo = async () => {
  const encargados = await Encargado.count();
  if (encargados > 0) {
    return;
  }

  const usuario = await Usuario.create({
    nombre_usuario: 'encargado',
    contraseña: 'admin123'
  });

  await Encargado.create({
    id_usuario: usuario.id_usuario,
    nombre: 'María',
    apellido: 'González',
    email: 'encargado@libreria.com',
    telefono: '3515551234'
  });

  console.log('Encargado demo creado: usuario "encargado" / contraseña "admin123"');
};

module.exports = { seedEncargadoDemo };
