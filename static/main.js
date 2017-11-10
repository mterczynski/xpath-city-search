function getAjax(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// selecty:

const selectWojewodztwo = document.querySelector("#selectWojewodztwo");
const selectPowiat = document.querySelector("#selectPowiat");
const selectGmina = document.querySelector("#selectGmina");
const selectMiasto = document.querySelector("#selectMiasto");

let valWoj;
let valPow;
let valGmi;

getAjax("wojewodztwa",(res)=>{
    const wojewodztwa = Object.values(JSON.parse(res).NAZWA);
    for(let i=0; i<wojewodztwa.length; i++){
        const option = document.createElement("option");
        option.innerHTML = wojewodztwa[i];
        option.value = wojewodztwa[i];
        selectWojewodztwo.appendChild(option);
        selectWojewodztwo.selectedIndex = -1;
    }
    valWoj = JSON.parse(res);
});

selectWojewodztwo.addEventListener("change",(e)=>{
    getAjax(`powiat?woj=${selectWojewodztwo.childNodes[selectWojewodztwo.selectedIndex].innerHTML}`, (res)=>{
        const nazwyPowiatow = Object.values(JSON.parse(res).NAZWA);
        selectPowiat.innerHTML = "";
        for(let i=0; i<nazwyPowiatow.length; i++){
            const option = document.createElement("option");
            option.innerHTML = nazwyPowiatow[i];
            option.value = nazwyPowiatow[i];
            selectPowiat.appendChild(option);
            selectPowiat.selectedIndex = -1;
        }
        valPow = JSON.parse(res);
    });
    selectGmina.innerHTML = "";
    selectMiasto.innerHTML = "";
});

selectPowiat.addEventListener("change",(e)=>{
    getAjax(`gmina?powiat=${selectPowiat.childNodes[selectPowiat.selectedIndex].innerHTML}`, (res)=>{
        console.log(JSON.parse(res))
        const nazwyGmin = Object.values(JSON.parse(res).NAZWA);
        selectGmina.innerHTML = "";
        for(let i=0; i<nazwyGmin.length; i++){
            const option = document.createElement("option");
            option.innerHTML = nazwyGmin[i];
            option.value = nazwyGmin[i];
            selectGmina.appendChild(option);
            selectGmina.selectedIndex = -1;
        }
        valGmi = JSON.parse(res);
    });
    selectMiasto.innerHTML = "";
});

selectGmina.addEventListener("change",(e)=>{
    console.log("sending get")
    const selectedWoj = selectWojewodztwo.childNodes[selectWojewodztwo.selectedIndex].innerHTML;
    const selectedPow = selectPowiat.childNodes[selectPowiat.selectedIndex].innerHTML;
    const selectedGmi = selectGmina.childNodes[selectGmina.selectedIndex].innerHTML;
    
    const idWoj = valWoj.WOJ[selectWojewodztwo.selectedIndex];
    const idPow = valPow.POW[selectPowiat.selectedIndex];
    const idGmi = valGmi.GMI[selectGmina.selectedIndex];

    console.log(idWoj);
    console.log(idPow);
    console.log(idGmi);
    
    getAjax(`miasto?gmiId=${idGmi}&powId=${idPow}&wojId=${idWoj}`, (res)=>{
        const nazwyGmin = Object.values(JSON.parse(res).NAZWA);
        selectMiasto.innerHTML = "";
        for(let i=0; i<nazwyGmin.length; i++){
            const option = document.createElement("option");
            option.innerHTML = nazwyGmin[i];
            option.value = nazwyGmin[i];
            selectMiasto.appendChild(option);
            selectMiasto.selectedIndex = -1;
        }
        console.log(res)
    });
});
