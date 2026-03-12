
let userEmail=""
let userName=""
let scannedAsset=""

function initLogin(){

google.accounts.id.initialize({
client_id:CONFIG.GOOGLE_CLIENT_ID,
callback:handleLogin
})

google.accounts.id.renderButton(
document.getElementById("login"),
{theme:"outline",size:"large"}
)

}

function handleLogin(response){

const data=parseJwt(response.credential)

userEmail=data.email
userName=data.name

if(!userEmail.endsWith(CONFIG.COMPANY_DOMAIN)){
alert("Only company accounts allowed")
return
}

document.getElementById("userInfo").innerText="Logged in: "+userEmail

startScanner()

}

function parseJwt(token){

let base64Url = token.split('.')[1]
let base64 = base64Url.replace(/-/g,'+').replace(/_/g,'/')
let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
}).join(''))

return JSON.parse(jsonPayload)

}

function startScanner(){

const scanner=new Html5QrcodeScanner(
"scanner",
{fps:10,qrbox:250}
)

scanner.render((decodedText)=>{

scannedAsset=decodedText
document.getElementById("assetID").innerText=decodedText

})

}

function confirmBorrow(){

if(!scannedAsset){
alert("Scan a key first")
return
}

document.getElementById("popupAsset").innerText=scannedAsset
document.getElementById("borrowPopup").style.display="block"

}

function closePopup(){
document.getElementById("borrowPopup").style.display="none"
}

function borrowAsset(){

sendAction("borrow")
closePopup()

}

function returnAsset(){

sendAction("return")

}

function sendAction(action){

fetch(CONFIG.API_URL,{
method:"POST",
body:JSON.stringify({
action:action,
asset:scannedAsset,
email:userEmail,
name:userName
})
})
.then(res=>res.json())
.then(data=>{
document.getElementById("status").innerText=data.message
})

}

window.onload=initLogin
