
function searchInventory(){

let input=document.getElementById("search").value.toLowerCase()

let rows=document.querySelectorAll("#assetBody tr")

rows.forEach(row=>{

if(row.innerText.toLowerCase().includes(input))
row.style.display=""
else
row.style.display="none"

})

}
