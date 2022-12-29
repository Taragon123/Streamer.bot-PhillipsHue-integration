import * as HUE from './hue';

import express, { Express, Request, Response } from 'express';

import * as hue_keys from './keys/hue_keys.json';

// const v3 = require('node-hue-api').v3;
import { v3 } from 'node-hue-api';
import { Api } from 'node-hue-api/dist/esm/api/Api';

const LightState = v3.lightStates.LightState;

let BRIDGE: Api;
getBridge();

async function getBridge() {
    BRIDGE = await v3.api.createLocal(hue_keys.bridge_ip).connect(hue_keys.appkey);
}

async function getIdByName(name: string) {
    return BRIDGE.lights.getLightByName(name)
    .then(lights => {
        if (lights.length == 0) {
            return -1;
        } else { 
            return lights[0].id; 
        }
    });
}

const app: Express = express();
app.use(express.json())
const port = 8000;

app.listen(port, async () => {
    // await getDeviceList();
    console.log("Server running on port 8000");
});

app.get('/setcolour', async (req: Request, res: Response) => {
    const req_name = req.query.light?.toString();
    const req_colour = req.query.colour?.toString();

    console.log(req.query)

    if (req_colour == undefined || req_name == undefined) {
        res.statusCode = 400;
        res.send(`Body must contain {colour, light}`);
        return;
    }

    let colour: HUE.XYLColour;
    try {
        colour = HUE.parseHexColour(req_colour).xyl();
    } catch (e) {
        console.log(e)
        res.statusCode = 400;
        res.send(e);
        return;
    }
    
    const state = new LightState()
        .on()
        .xy(colour.X,colour.Y)
        .brightness(colour.L)
    ;

    const id = await getIdByName(req_name);
    if (id == -1) {
        res.statusCode = 404;
        res.send(`No light found with name: ${req_name}`);
        return;
    }

    BRIDGE.lights.setLightState(id, state)
        .then((result: any) => {
            console.log(`Light ${result ? '':'un'}sucessfully set to ${colour.toString()}`);
    });

    res.statusCode = 200;
    res.send(`Light sucessfully set to ${req_colour}`);
    return;
});

app.get('/seton', async (req: Request, res: Response) => {
    const set_on = req.query.on == 'false' ? false : true;
    const req_name = req.query.light?.toString();

    console.log(set_on, req_name)

    if (req_name == undefined) {
        res.statusCode = 400;
        res.send(`Body must contain {light}`);
        return;
    }

    const state = new LightState()
        .on(set_on)
    ;

    const id = await getIdByName(req_name);
    if (id == -1) {
        res.statusCode = 404;
        res.send(`No light found with name: ${req_name}`);
        return;
    }

    BRIDGE.lights.setLightState(id, state)
        .then((result: any) => {
            console.log(`Light ${result ? '':'un'}sucessfully set to ${set_on ? 'on' : 'off'}`);
    });

    res.statusCode = 200;
    res.send(':)');
    return;
});