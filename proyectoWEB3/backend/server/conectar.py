import cx_Oracle

# Inicializar Oracle Instant Client
cx_Oracle.init_oracle_client(lib_dir=r"E:\instantclient_23_5")  # Ruta al Instant Client

# Datos de conexión
usuario = "Pepeambrocio20"  # Cambia esto por el usuario que tengas
contrasena = "Pepe1899078*"  # Cambia esto por la contraseña que estableciste
dsn = "vdz7h7v4o3asev6i_high"  # Alias del archivo tnsnames.ora

# Conectar a la base de datos usando el DSN y las credenciales
connection = cx_Oracle.connect(
    user=usuario,
    password=contrasena,
    dsn=dsn
)

# Verificar la conexión
print("Conexión exitosa:", connection.version)

# Cerrar la conexión
connection.close()