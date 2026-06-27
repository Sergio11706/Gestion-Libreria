CREATE TABLE IF NOT EXISTS libros (  
  id              INT AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(255)   NOT NULL,
  autor           VARCHAR(255)   NOT NULL,
  isbn            VARCHAR(20)    NOT NULL UNIQUE,
  editorial       VARCHAR(255),
  categoria       VARCHAR(100),
  precio_costo    DECIMAL(10, 2),
  precio_venta    DECIMAL(10, 2),
  stock           INT            NOT NULL DEFAULT 0,
  fecha_ingreso   DATE,
  tiene_stock_bajo TINYINT(1)    NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);