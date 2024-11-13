import dotenv from "dotenv";
dotenv.config();//lee el fichero .env y crea las variables de entorno
//------------------

import express from "express";
import { leerTareas,crearTarea } from "./db.js";

const servidor = express();

servidor.use(express.json());

if(process.env.PRUEBAS){
    servidor.use(express.static("./pruebas"));
}

servidor.get("/tareas", async (peticion,respuesta) => {
    try{
        let tareas = await leerTareas();

        respuesta.json(tareas);

    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });

    }
});

servidor.post("/tareas/nueva", async (peticion,respuesta,siguiente) => {
    
    let {tarea} = peticion.body;

    if(!tarea || tarea.trim() == ""){
        return siguiente(true);
    }

    try{

        let id = await crearTarea(tarea);

        respuesta.json({id});

    }catch(error){
        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });
    }
});

servidor.delete("/tareas/borrar/:id", (peticion,respuesta) => {
    respuesta.send("id recibido -->" + peticion.params.id);
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la peticion"});
});

//crear solo DELETE y probar con fetch







servidor.listen(process.env.PORT);