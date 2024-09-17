# Ejecutar en desarrollo
1. Clonar el repositorio
2. Ejectuar
```
yarn install
```

3. Tener Nest CLI instalado
```
npm i -g @nest/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```

5. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```


## Stack usado
* MongoDB
* Nest