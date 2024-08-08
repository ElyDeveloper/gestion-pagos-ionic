Para dockerizar SQL Server en su última versión, siga estos pasos:

1. Asegúrese de tener Docker instalado en su sistema.

2. Abra una terminal o línea de comandos.

3. Ejecute el siguiente comando para descargar la imagen más reciente de SQL Server:

```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest
```

4. Una vez descargada la imagen, cree y ejecute un contenedor con el siguiente comando:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=DB_Password" \
   -p 1433:1433 --name SQL_Server_Docker \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

Asegúrese de reemplazar "DB_Password" con una contraseña segura de su elección.

5. Para verificar que el contenedor está en funcionamiento, use:

```bash
docker ps
```

Debería ver el contenedor "SQL_Server_Docker" en la lista.

Este proceso creará un contenedor Docker con SQL Server 2022, que es la versión más reciente en este momento. El servidor estará disponible en el puerto 1433 de su máquina host.

¿Le gustaría que explique alguno de estos pasos con más detalle?
