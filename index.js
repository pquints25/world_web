const express = require('express');
const path = require('path')
const fs = require('fs')
const app = express();


app.use(express.static('public'));

app.use(express.urlencoded({ extended:true}));
app.use(express.json());


app.post('/crear', (req, res) => {
    const nuevoPost = {
        archivo: req.body.archivo,
        contenido: req.body.contenido
    }


fs.writeFile(`./views/public/${nuevoPost.archivo}.txt`, nuevoPost.contenido, (err) => {
                    if (err) {  
                        return res.status(500).send('Error al crear el archivo');
                    }
                    res.status(201).send('Archivo creado')
                });

            });

app.get('/leer', (req, res) => {
    const archivo = req.query.archivo;
    
    if(!archivo){
        return res.status(400).send('Error archivo no encontrado');
    }

    const rutaArchivo = path.join(__dirname, 'views', 'public', `${archivo}.txt`);
    fs.readFile(rutaArchivo, 'utf8', (err,data) => {
        if (err){
            return res.status(err.code === 'ENOENT' ? 404 : 500).send(`Error:${err.code === 'ENOENT' ? 'archivo no encontrado' : 'Error al leer'}`);
        }
        res.send(`Buscado el archivo ${archivo}:\n${data}`);
    })
})

app.post('/renombrar', (req, res ) => {
    const {nombre, nuevoNombre} = req.body; 

    if(!nombre || !nuevoNombre){
        return res.status(400).send('Error ❌ Te mandaste una cagada')
    }
    
    const antiguoArchivo = path.join(__dirname, 'views', 'public', `${nombre}.txt`);
    const nuevoArchivo = path.join(__dirname, 'views', 'public', `${nuevoNombre}.txt`);

    fs.rename(antiguoArchivo, nuevoArchivo , (err) => {
        if(err) {
            return res.status(500).send('Error imposible crear el nombre del archivo');
        
        }
        res.send('Archivo cambiado ✔')

    })
    
});

app.post('/eliminar', (req, res)=>{
    const { archivo } =  req.body; 

    if (!archivo) {
        return res.status(400).send('<h1>No se proporciono el nombre del archivo</h1>');

    }

    const rutaArchivo = path.join(__dirname, 'views', 'public', `${archivo}.txt`);

    fs.unlink(rutaArchivo, (err) => {
        if(err){
            if(err.code === 'ENOENT') {
                return res.status(400).send ({mensaje: 'archivo no encontrado'})
            } else {
                return res.status(500).send({mensaje: 'Error al eliminar'})
            }
        }
        res.send(`<h1>archivo ${archivo}.txt fue eliminado con exito</h1>`);
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'public', 'index.html'));
});


app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
    
})