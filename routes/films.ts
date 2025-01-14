import {Router} from "express";

import {Film, NewFilm} from "../types";

const router= Router();

const films : Film[] = [
    { id:1, title :"Shang-Chi and the Legend of the ten rings", director: "Destin Daniel Cretton", duration:132 },
    {id : 2, title: "The Matrix", director: "Lana Wachowski", duration: 136}


];

//Read all films, filtered by minimum duration if the query param exists
router.get("/",(req, res)=> {
    if (req.query["minimum-duration"] === undefined){
        return res.send(films);
    }

    const minDuration = Number(req.query["minimum-duration"]);

    if(isNaN(minDuration)|| minDuration<=0) {
        res.json("Wrong minimum duration");
    }

    const filteredFilms = films.filter((film)=> film.duration >=minDuration);

    return res.send(filteredFilms);

})

//Read a film by id 
router.get("/:id",(req,res)=>{
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.json("Wrong id");
    }

    const film = films.find((film)=> film.id === id);

    if (film === undefined) {
        return res.json ("Resource not found")
    }

    return res.send(film);


})

//Create new film

router.post("/",(req,res)=> {
    const body : unknown = req.body;

    if(!body || typeof body !=="object" ||
        !("title" in body) ||
        !("director" in body) ||
        !("duration" in body) ||
        typeof body.title !== "string" ||
        typeof body.director !=="string"||
        typeof body.duration !== "number"||
        !body.title.trim()||
        !body.director.trim()||
        body.duration <=0  
        ) {
            return res.json("Wrong body format");
    }

    const newFilm = body as NewFilm;

    const nextId = films.reduce((acc, film)=>(film.id > acc ? film.id : acc),0) +1;

    const addedFilm : Film = { id: nextId,...NewFilm};

    films.push(addedFilm);
    
    return res.json(addedFilm);


})


export default router;