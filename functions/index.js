const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));

app.get('/hola', (req, res) => {
    return res.status(200).send('Hola mundo, soy el primer endpoint');
});

app.get("/api/peliculas", async (req, res) => {
    try {
        let query = db.collection("peliculas");
        const querySnapshot = await query.get();
        let docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            titulo: doc.data().titulo,
        }));

        return res.status(200).json(salida("200", response));
    } catch (error) {
        return res.status(500).json(salida("500", error));
    }
});

app.post("/api/peliculas", async (req, res) => {
    try {
        if (!req.body.id || !req.body.titulo) {
            return res
                .status(400)
                .send(
                    "Se requiere tanto 'id' como 'titulo' en el cuerpo de la solicitud."
                );
        }

        const peliculaData = {
            titulo: req.body.titulo,
            duracion: req.body.duracion || "",
            generos: req.body.generos || [],
            horario: req.body.horario || "",
            img_url: req.body.img_url || "",
            img_url_hd: req.body.img_url_hd || "",
            precio: req.body.precio || 0,
            sinopsis: req.body.sinopsis || "",
            trailer: req.body.trailer || "",
        };

        await db.collection("peliculas").doc(req.body.id).set(peliculaData);

        return res.status(200).send();
    } catch (error) {
        console.error("Error al crear el documento:", error);
        return res.status(500).send("Error al procesar la solicitud.");
    }
});

var permisos = require("./permisos.json");
admin.initializeApp({
    credential: admin.credential.cert(permisos),
    databaseURL: "https://url-que-te-da-firestore.firebaseio.com",
});

const db = admin.firestore();



function salida(codigo, entrada) {
    var today = new Date();
    var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "|" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();

    if (codigo === "200")
        return {
            mensaje: "Proceso terminado exitosamente",
            folio: date,
            resultado: entrada,
        };

    if (codigo === "201")
        return {
            mensaje: "Elemento creado exitosamente",
            folio: date,
            resultado: entrada,
        };

    if (codigo === "500")
        return {
            mensaje: "Ocurrio un detalle en el servidor",
            folio: date,
            resultado: entrada,
        };

    return {
        mensaje: "Ocurrio un detalle en el servidor",
        folio: date,
        resultado: entrada,
    };
}

exports.app = functions.https.onRequest(app);