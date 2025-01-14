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
        return res.sendStatus(400)
    }

    const filteredFilms = films.filter((film)=> film.duration >=minDuration);

    return res.send(filteredFilms);

});

//Read a film by id 
router.get("/:id",(req,res)=>{
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.sendStatus(400);
    }

    const film = films.find((film)=> film.id === id);

    if (film === undefined) {
        return res.sendStatus(404);
    }

    return res.send(film);


});

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
            return res.sendStatus(400);
    }

    const newFilm = body as NewFilm;

    const existingFilm = films.find((film)=>
        film.title.toLowerCase() === newFilm.title.toLowerCase()&&
        film.director.toLowerCase()=== newFilm.director.toLowerCase()
    
    );

    if(existingFilm){
        return res.sendStatus(409)
    }

    const nextId = films.reduce((acc, film)=>(film.id > acc ? film.id : acc),0) +1;

    const addedFilm : Film = { id: nextId,...newFilm};

    films.push(addedFilm);
    
    return res.json(addedFilm);


});

//Delete a film by id
router.delete("/:id",(req,res)=>{
    const id =Number(req.params.id);

    if (isNaN(id)){
        return res.sendStatus(400);
    }

    const index = films.findIndex((film)=> film.id ===id);
    if (index===-1){
        return res.sendStatus(404);
    }

    const deletedFilm = films[index];

    films.splice(index, 1);

    return res.send(deletedFilm);
});

//Update on or multiple props of a film
router.patch("/:id",(req,res)=>{
    const id = Number(req.params.id);

    if(isNaN(id)){
        return res.sendStatus(400);
    }

    const filmToUpdate = films.find((film)=>film.id===id);

    if (filmToUpdate === undefined){
        return res.sendStatus(404);
    }

    const body : unknown = req.body;

    if (
        !body ||
        typeof body !== "object" ||
        Object.keys(body).length === 0||
        ("title" in body && 
            (typeof body.title !=="string" || !body.title.trim())) ||
        ("director" in body &&
            (typeof body.director !=="string" || !body.director.trim())) ||
        ("duration" in body &&  
            (typeof body.duration !=="number" || body.duration <=0))

    ){
        return res.sendStatus(400)
        
    }

    const updatedFilm = {...filmToUpdate,...body};

    films [films.indexOf(filmToUpdate)] = updatedFilm;

    return res.send(updatedFilm);
});

export default router;