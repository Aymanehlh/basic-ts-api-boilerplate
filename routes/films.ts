import {Router} from "express";

import {Film} from "../types";

const router= Router();

const defaultFilms : Film[] = [
    { id:1, title :"Shang-Chi and the Legend of the ten rings", director: "Destin Daniel Cretton", duration:132 },
    {id : 2, title: "The Matrix", director: "Lana Wachowski", duration: 136}


];

//Read all films
router.get("/",(__req,res)=>{
    return res.json(defaultFilms);
});

export default router;