require('dotenv').config();

// const mongoose = require('mongoose');

import { _response, importData } from "../../@api/core"

import reservePanuozzoToday from "../../@api/controller/prenotazioni"

exports.handler = async function (event, context) {

    const data = importData(event, context);

    console.log('action', data.action);

    switch (data.action) {
        case '/reservePanuozzoToday':
            console.log('entro in reservePanuozzoToday');
            await reservePanuozzoToday(data);
            break;
        default:
            console.log('invalid action => ', data.action);
            break;
    }


    return _response(200, "tutto ok");

    // const prenotazioniQuery = await db.prenotazioni.find({}).exec();

};