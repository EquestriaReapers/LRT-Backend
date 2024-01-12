<p align="center">
  <img width="200" src="/logo.png">
</p>

<h1 align="center">UCAB Profile Backend</h1>

## Index

- [Descripcion](#descripcion)
- [Pre-Requisitos](#pre-requisitos-📋)
- [Instalación](#instalación-🔧)
- [Documentacion](#documentacion)
- [Documentación](#documentacion)
- [Construido](#construido-con-🛠️)
- [Soporte](#soporte)
- [Stay-in-touch](#stay-in-touch)
- [License](#license)

## Descripcion

Servidor realizado para un proyecto de la materia Ingenieria de Requisitos en donde se busca crear una plataforma para egresados con la finalidad de exponerte y darte a conocer a reclutadores con la caracteristica especial de crear un CV con certificado ucabista y ser un portfolio

## Pre-Requisitos 📋

_Software requerido_

```
NodeJS >= 14.X
NPM >= 8.X
NestJS >= 9.X
Docker
```

## Instalación 🔧

_Para ejecutar un entorno de desarrollo_

_Previamente ejecutar el comando en la terminal para descargar "node_modules" para el funcionamiento del proyecto_

```
 npm install
```

_Previamente a ejecutar el servidor en desarrollo configurar el archivo .env con las credenciales del servidor correos y base de datos , ejecutar :_

_Example .Env_

```
JWT_SECRET=<your-jwt-secret>
BACKEND_BASE_URL=<your-backend-base-url>
DB_TYPE=<your-db-type>
DB_HOST=<your-db-host>
PORT=<your-port>
DB_PORT=<your-db-port>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
NODE_ENV=<your-node-env>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
EMAIL_USER=<your-email-user>
EMAIL_PASSWORD=<your-email-password>
ELASTIC_URL=<your-elastic-url>
ELASTIC_USER=<your-elastic-user>
ELASTIC_PASSWORD=<your-elastic-password>
API_COUNTRY_KEY=<your-api-country-key>
EMAIL_LOCAL_TESTING_MODE=<your-email-local-testing-mode>
EMAIL_LOCAL_BASE_URL=<your-email-local-base-url>
FRONTEND_URL=<your-frontend-url>
API_BANNER_URL=<your-api-banner-url>

```

_Luego ejecutar los siguiente comando en consola_

```
 docker-compose up -d

 docker compose -f "docker-compose2.yml" up -d

 npm run start:dev
```

> [!NOTE]  
> Necesitaras una API KEY de https://api.countrystatecity.in/play para tener todos los paises con sus estados y ciudades esto para el get de localidades para el front

> [!TIP]
> Url para solicitar api key = https://countrystatecity.in/docs/

_Dirigirse a la ruta http://localhost:3000/ donde tendra el API REST levantada_

## Documentacion

_Se realizo la documentación del API Rest usando Swagger el cual puede encontrar en la ruta http://localhost:3000/api en la configuración por default_

## Construido con 🛠️

_Las herramientas utilizadas son:_

- [NestJS](https://nestjs.com/) - El framework para construir aplicaciones del lado del servidor eficientes, confiables y escalables.
- [NPM](https://www.npmjs.com/) - Manejador de dependencias
- [Docker](https://www.docker.com/) - Para el despliegue de aplicaciones basado en contenedores
- [Prettier](https://prettier.io/) - Formateador de Codigo
- [Swagger](https://swagger.io/) - Automatización de Documentación
- [Visual Studio Code](https://code.visualstudio.com/) - Editor de Codigo
- [OpenSearch](https://github.com/opensearch-project/OpenSearch) - Motor de búsqueda y analítica distribuido, gratuito y de codigo abierto
- [Puppeteer](https://github.com/puppeteer/puppeteer) - Biblioteca de Node.js que proporciona una API de alto nivel para controlar y automatizar el navegador web Chrome o Chromium, usada para generar PDF
- [Nestjs-html-pdf](https://github.com/saemhco/nestjs-html-pdf) - Un paquete para generar archivos PDF desde HTML para NestJs
- [Nestjs-DbValidator](https://github.com/AyubTouba/nestjs-dbvalidator) - Módulo que tiene algunos validadores de bases de datos de disfraces que utilizan class-validator y typeorm
- [Nestjs-swagger-api-exception-decorator](https://github.com/nanogiants/nestjs-swagger-api-exception-decorator) - Decorador NestJS Swagger para excepciones de API.

## Soporte

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Autores ✒️

- **Emmanuel Salcedo** - _Developer_
- [HopeAero](https://github.com/HopeAero)
- **Luis Rivas** - _Developer_
- [LuisRivasW](https://github.com/LuisRivasW)
- **Hector Ferrer** - _Developer_
- [Hector1567XD](https://github.com/Hector1567XD)
- email de contacto: davidsalcedo388@gmail.com

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
