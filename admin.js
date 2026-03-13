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
