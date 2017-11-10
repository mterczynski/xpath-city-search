// Server config:
const ip = "localhost";
const port = 3000;
// Modules:
const express = require('express');
const xpath = require('xpath');
const fs = require('fs');
const colors = require('colors');
const DomParser = require('xmldom').DOMParser;
const xml2js = require('xml2js');

const xmlToJsonParser = new xml2js.Parser();

const to_json = require('xmljson').to_json;

function getJsonStringFromXpath(xpathString, xmlFile, callback){
    const queryResult = xpath.select(xpathString, xmlFile);
    const queryResultFixed = (queryResult + "").replace(new RegExp(">,<","g"),"><");
    to_json("<WRAPPER>" + queryResultFixed + "</WRAPPER>", function (error, data) {
        callback(JSON.stringify(data.WRAPPER));
    });
}

// App variable:
const app = express();
// XML files as variables:
let simcXml;
let tercXml;

fs.readFile('./terc.xml', 'utf-8', (err, data)=>{
    if(err){
        throw err;
    }
    tercXml  = new DomParser().parseFromString(data);
    console.log("Terc xml loaded".yellow);
});

fs.readFile('./simc.xml', 'utf-8', (err, data)=>{
    if(err){
        throw err;
    }
    simcXml  = new DomParser().parseFromString(data);
    console.log("Simc xml loaded".yellow);
});
// Static folder:
app.use(express.static("static"));
// Start server:
app.listen(port, ip, ()=>{
    console.log(`Server listening on ${ip}:${port}`.cyan);
});
// Get routes for terc file:
app.get("/wojewodztwa", (req, res)=>{
    getJsonStringFromXpath("//row[NAZWA_DOD='województwo']/*", tercXml, (json)=>{
        res.send(json);
    });
});
app.get("/powiat", (req, res)=>{
    getJsonStringFromXpath(`//row[NAZWA_DOD='województwo' and NAZWA='${req.query.woj}']/*`, tercXml, (jsonString)=>{
        getJsonStringFromXpath(`//row[NAZWA_DOD='powiat' and WOJ='${JSON.parse(jsonString).WOJ}']/*`, tercXml, (jsonString2)=>{
            res.send(jsonString2);
        });
    });
});
app.get("/gmina", (req, res)=>{
    getJsonStringFromXpath(`//row[NAZWA_DOD='powiat' and NAZWA='${req.query.powiat}']/*`, tercXml, (jsonString)=>{
        const data = JSON.parse(jsonString);

        getJsonStringFromXpath(`//row[starts-with(NAZWA_DOD,'gmina') and POW='${data.POW}' and WOJ='${data.WOJ}']/*`, tercXml, (jsonString2)=>{
            const data = JSON.parse(jsonString2);
            //console.log(jsonString2);
            res.send(jsonString2);
        });
        // getJsonStringFromXpath(`//row[RODZ>0 and POW='${data.POW}' and WOJ='${data.WOJ}']/NAZWA`, tercXml, (jsonString2)=>{
        //     const data = JSON.parse(jsonString2);
        //     //console.log(jsonString2);
        //     res.send(jsonString2);
        // });
    });
});
// Get routes for simc file:
app.get("/miasto", (req, res)=>{
    console.log("req /miasto");
    // getJsonStringFromXpath(`//row[starts-with(NAZWA_DOD,'gmina') and GMI='${req.query.gmiId}' and WOJ='${req.query.wojId}' and POW='${req.query.powId}']/*`, tercXml, (jsonString)=>{
    //     const data = JSON.parse(jsonString);
    //     res.send(data)
    // });
    getJsonStringFromXpath(`//row[POW='${req.query.powId}' and WOJ='${req.query.wojId}' and GMI='${req.query.gmiId}']/*`, simcXml, (jsonString2)=>{
        const data = JSON.parse(jsonString2);
        //console.log(jsonString2);
        res.send(jsonString2);
    });
});



