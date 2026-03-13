// Load assets when page opens
window.onload = loadAssets

async function loadAssets(){

try{

console.log("Fetching assets...")

const res = await fetch(CONFIG.API_URL + "?action=getAssets")

if(!res.ok){
throw new Error("Network response error")
}

const data = await res.json()

console.log("Assets received:", data)

const body = document.getElementById("assetBody")

body.innerHTML=""

let total=0
let borrowed=0
let available=0

data.forEach(asset=>{

total++

if(asset.status === "Borrowed") borrowed++
if(asset.status === "Available") available++

body.innerHTML += `
<tr>
<td>${asset.id}</td>
<td>${asset.name}</td>
<td>${asset.status}</td>
<td>${asset.holder || ""}</td>
</tr>
`

})

document.getElementById("totalAssets").innerText = total
document.getElementById("borrowedAssets").innerText = borrowed
document.getElementById("availableAssets").innerText = available

}catch(error){

console.error("Error loading assets:", error)
alert("Failed to load inventory. Check console (F12).")

}

}

// SEARCH INVENTORY
function searchInventory(){

let input = document.getElementById("search").value.toLowerCase()

let rows = document.querySelectorAll("#assetBody tr")

rows.forEach(row=>{

if(row.innerText.toLowerCase().includes(input))
row.style.display=""
else
row.style.display="none"

})

}


// ADD NEW ASSET
async function addAsset(){

let id = document.getElementById("assetID").value
let name = document.getElementById("assetName").value
let category = document.getElementById("category").value
let location = document.getElementById("location").value

if(!id || !name){
alert("Asset ID and Name required")
return
}

try{

const res = await fetch(CONFIG.API_URL,{
method:"POST",
body:JSON.stringify({
action:"addAsset",
assetID:id,
name:name,
category:category,
location:location
})
})

const result = await res.json()

console.log(result)

generateQR(id)

alert("Asset added successfully")

loadAssets()

}catch(error){

console.error("Error adding asset:", error)
alert("Failed to add asset")

}

}


// GENERATE QR PREVIEW
function generateQR(id){

document.getElementById("qrPreview").src =
"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+id

}


// PRINT REPORT
function printReport(){

window.print()

}


// DOWNLOAD CSV REPORT
function downloadCSV(){

let table = document.querySelector("table")
let rows = table.querySelectorAll("tr")

let csv=[]

rows.forEach(row=>{

let cols=row.querySelectorAll("td,th")

let rowData=[]

cols.forEach(col=>{
rowData.push(col.innerText)
})

csv.push(rowData.join(","))

})

let blob=new Blob([csv.join("\n")],{type:"text/csv"})

let link=document.createElement("a")
link.href=URL.createObjectURL(blob)
link.download="inventory_report.csv"

link.click()

}
