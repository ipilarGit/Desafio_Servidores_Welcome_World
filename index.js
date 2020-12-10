const http = require('http');
const url = require('url');
const fs = require('fs');
const moment = require('moment');

let fecha = moment();
let hoy = fecha.format("DD/MM/YYYY");

http.createServer((req, res) => {

    // Almacenar los parámetros de la consulta en una constante 
    // con el método parse del módulo url y su propiedad query
    const params = url.parse(req.url, true).query;
    console.log(req.url);
    const archivo = params.archivo;
    const contenido = params.contenido;
    const nombre = params.nombre;
    const nuevoNombre = params.nuevoNombre;

    // Crear una ruta “/crear” que ejecute la creación
    // de un archivo con el método writeFile del módulo File System,
    // usando los parámetros nombre y contenido de la url expuestos en 
    // la url de la petición. Devuelve un mensaje de éxito al cliente

    if (req.url.includes("/crear")) {
        fs.writeFile(archivo, hoy + " " + contenido, "utf8", (error) => {
            if (!error) {
                res.write(`EL archivo ${archivo} ha sido creado con éxito.`);
                res.end();
            } else {
                res.write(`Ha ocurrido un problema al crear el archivo :${error}`);
                res.end();
            }
        })
    };

    // Crea una ruta “/leer” que use el método readFile 
    // del módulo File System para obtener el contenido del archivo 
    //cuyo nombre debe ser el obtenido por query string
    if (req.url.includes("/leer")) {
        fs.readFile(archivo, (error, data) => {
            if (!error) {
                res.write(`EL contenido del archivo ${archivo} es: `);
                res.write(data);
                res.end();
            } else {
                res.write(`Ha ocurrido un problema en la lectura del archivo: ${error}. El archivo no existe.`);
                res.end();
            }
        })
    };

    //  Crear una ruta “/renombrar” que procese el método rename del módulo
    // fileSystem especificando el nombre del archivo devolviendo en su callback un
    // mensaje de éxito
    if (req.url.includes("/renombrar")) {
        fs.rename(nombre, nuevoNombre, (error) => {
            if (!error) {
                res.write(`El archivo: ${nombre} ha sido renomadro como: ${nuevoNombre} exitosamente.`);
                res.end();
            } else {
                res.write(`Ha ocurrido un problema al renombrar el archivo :${error}. El archivo no existe.`);
                res.end();
            }
        })
    };

    // Crear una ruta “/eliminar” que procese el método unlink del
    // módulo File System especificando el nombre del archivo devolviendo
    // en su callback un mensaje de éxito
    if (req.url.includes("/eliminar")) {
        //  res.write(`Tu solicitud para eliminar el archivo ${archivo} se esta procesando.`);
        setTimeout(() => {
            fs.unlink(archivo, (error) => {
                res.write(`Tu solicitud para eliminar el archivo ${archivo} se esta procesando.`);
                if (!error) {
                    res.write(`El archivo ${archivo} ha sido eliminado.`);
                    res.end();

                } else {
                    res.write(`Ha ocurrido un problema al eliminar el archivo :${error}`);
                    res.end();
                }
            })
        }, 3000);
    };
}).listen(8080);
// Paso 4: Crear un servidor con el método createServer 
// del módulo http que esté disponible en el puerto 8080