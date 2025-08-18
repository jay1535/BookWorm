import express from 'express';
import {config} from "dotenv"

export const app = express();
config({path:"./config/config.env"});

app.use(express.json());
app.use(express.urlencoded({extended:true}));