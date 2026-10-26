# Ionic Shoping List


Es una aplicación de pruebas, siguiendo el curso de https://www.udemy.com/course/aprende-ionic-con-proyectos-practicos

Es una aplicación básica de Ionic 7 con Angular 19, para aprender. Para ello lo que se ejecutó:

`npm install -g @ionic/cli@v7`

`ionic start 05-ionic-shoping-list` y se fue respondiendo: Angular, tabs y standalone


Ejecutar `ionic serve` dentro del directorio de la aplicación para ver tu app en el navegador

Ejecutar `ionic capacitor build android` para crear la aplicación de android y se abra el android studio

Ejecutar `npm run generate-icons-android` para crear los iconos

Usa  `cordova-res --skip-config --copy` para generar el icono de tu app y pantallas de presentación


Ejecutar `ionic capacitor run android -l --external` para actualizar automáticamente en android, aunque hay que pulsar el reload en el Android Studio, la primera vez

## Añadir plugins de capacitor
Por ejemplo, para añadir el plugin de preferences, para guardar datos en el storage :
`npm install @capacitor/preferences`

O para generar los iconos:
`npm install @capacitor/assets --save-dev`

O para usar sqlite:
`npm install --save jeep-sqlite`
`npm install --save sql.js`   usar version 1.11.0
`npm install --save @capacitor-community/sqlite` 
más info: https://github.com/capacitor-community/sqlite#for-angular-framework
Copiar el archivo sql-wasm.wasm de node_modules/sql.js/dist/sql-wasm.wasm a la carpeta src/assets
ó ejecutar `npm run copy-sqlwasm-en-assets` (creamos un script que requiere la librería copyfiles de npm)

## Generar páginas
`ionic g page pages/mipagina`

# Generar servicio
`ionic g s services/servicio`


# Generar pipe
`ionic g pipe pipes/mipipe`

## Generar iconos
Se añadieron los scripts correspondientes en el package.json, y las imagenes en la carpeta resources

`npm run generate-icons-android`
`npm run generate-icons-ios`
`npm run generate-icons-pwa`

Más info sobre el script y las dimensiones necesarias de las imágenes: [https://capacitorjs.com/docs/v7/guides/splash-screens-and-icons](https://capacitorjs.com/docs/v7/guides/splash-screens-and-icons)


`ionic capacitor build android` 


## Más documentación
https://ionic-docs-lq0if04rc-ionic1.vercel.app/docs/v7/intro/cli
https://ionic-docs-lq0if04rc-ionic1.vercel.app/docs/v7/components
https://ionicframework.com/docs
