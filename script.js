var url = 'produits.json';
var listeProduits;
var panier = new Array();
var order = new Array();
const TAUX_TPS = 0.05;
const TAUX_TVQ = 0.09975;
var subjetCat = "informatique"; 


 $(document).ready(()=>{
  chargerPanier();
  let getData = async() =>{    
    try{
      let response = await fetch(url);
      if(response.ok){ 
        let data = await response.json();       
        listeProduits = data.liste;     
        afficherListeProduits();  
      } else{
        console.log("Erreur: "+response.status);
      }
    }catch (e){
      console.log(e);
    }
  }
  getData();
}); 

function ajouterItem(ligneCommande){ 
  // check if prodcut already exist in panier  
     if (panier.some((item) => item.produit.id === ligneCommande.produit.id)) {  
     
     changeNumberOfUnits(ligneCommande.produit.id);
  } else{
  panier.push(ligneCommande);
  enregistrerPanier();  
  }   
   var quantite = ligneCommande.quantite;
  var nbItemPanier = parseInt(document.getElementById("idItem").innerHTML);
  nbItemPanier += parseInt(quantite);
  document.getElementById("idItem").innerHTML = nbItemPanier;
  alert('Ajout réussi!'); 
}

function changeNumberOfUnits(id) {
  panier.forEach(function (item){  
    if ( item.produit.id === id ) {
      item.quantite = (parseInt(item.quantite) + 1).toString() ;
    }	
  }); 
  enregistrerPanier();     
}

function enregistrerPanier(){
  if(typeof(localStorage)== "undefined") { 
    alert("votre navigateur ne supporte pas les cookies");
    return;
  }
  localStorage.setItem("panier", JSON.stringify(panier));
}
/*-----------------------------------------------*/

function afficheFacture(){
    document.getElementById("zoneContenuItem").style.display = "none";
    document.getElementById("zoneContenuOrder").style.display = "none";
    document.getElementById("zoneContenuFacture").style.display = "block";
    document.getElementById("zoneContenuFacture").style.height = "85%";

    var sousTotal = 0;
    var noeudTBody = document.querySelector('#corpsTableau');
    
    if (noeudTBody.textContent !=='\n\t\t\t\t') return;    
    else {
    //
    panier.forEach(function(ligneCommande, index){
      var nomDeProduit = ligneCommande.produit.titre;
      var quantite = ligneCommande.quantite;
      var prix = ligneCommande.produit.prix;
      sousTotal += parseInt(quantite) * parseFloat(prix);

      var noeudTr = document.createElement("tr");
      var noeudTd1 = document.createElement("td");
      var contenuTd1 = document.createTextNode(nomDeProduit);
      noeudTd1.appendChild(contenuTd1);
      noeudTr.appendChild(noeudTd1);

      var noeudTd2 = document.createElement("td");
      var noeudTd21 = document.createElement("input");
      noeudTd21.setAttribute("type", "text");
      noeudTd21.setAttribute("value", quantite);
      noeudTd21.addEventListener("change", function(){
        var nouvelleQte = this.value;
        panier[index].quantite = nouvelleQte;
        enregistrerPanier();
        calculerFacture();
      });
      noeudTd2.appendChild(noeudTd21);
      noeudTr.appendChild(noeudTd2);

      var noeudTd3 = document.createElement("td");  
      var contenuTd3 = document.createTextNode(prix);
      noeudTd3.appendChild(contenuTd3);
      noeudTr.appendChild(noeudTd3);

      noeudTBody.appendChild(noeudTr);
    });
    var totalTPS = sousTotal * TAUX_TPS;
    var totalTVQ = sousTotal * TAUX_TVQ; 
    var total = sousTotal + totalTPS + totalTVQ;
    document.querySelector('#idSousTotal').innerHTML = sousTotal.toFixed(2)+' $';
    document.querySelector('#idTPS').innerHTML = totalTPS.toFixed(2)+' $';
    document.querySelector('#idTVQ').innerHTML = totalTVQ.toFixed(2)+' $';
    document.querySelector('#idTotal').innerHTML = total.toFixed(2)+' $';
    // paser commande 
    if (noeudTBody.textContent !=='\n\t\t\t\t') {

    var noeudBtnAjouter = document.createElement("div");
    noeudBtnAjouter.setAttribute("class", "ajouter");
    noeudBtnAjouter.appendChild(document.createTextNode("Passer commande"));
    document.getElementById("zoneContenuFacture").appendChild(noeudBtnAjouter);
    noeudBtnAjouter.addEventListener("click", function(){
      viderPanier();      
    });
    }
    //
  }
}

function calculerFacture(){
  var sousTotal = 0;
  var totalQte = 0;
  panier.forEach(function(ligneCommande){

    var quantite = ligneCommande.quantite;
    var prix = ligneCommande.produit.prix;
    sousTotal += parseInt(quantite) * parseFloat(prix);
    totalQte += parseInt(quantite);
  });
    var totalTPS = sousTotal * TAUX_TPS;
    var totalTVQ = sousTotal * TAUX_TVQ; 
    var total = sousTotal + totalTPS + totalTVQ;
    document.querySelector('#idSousTotal').innerHTML = sousTotal.toFixed(2)+' $';
    document.querySelector('#idTPS').innerHTML = totalTPS.toFixed(2)+' $';
    document.querySelector('#idTVQ').innerHTML = totalTVQ.toFixed(2)+' $';
    document.querySelector('#idTotal').innerHTML = total.toFixed(2)+' $';
    document.getElementById('idItem').innerHTML = totalQte;
}
function chargerPanier(){
  if(typeof(localStorage)== "undefined") {     
    alert("votre navigateur ne supporte pas les cookies");
    return;
  }
  if(!localStorage.panier){
    return;
  }
  panier = JSON.parse(localStorage.getItem('panier'));
  var totalQte = 0;
  panier.forEach(function(ligneCommande){
    var quantite = ligneCommande.quantite;
    totalQte += parseInt(quantite);
  });
  var nbItemPanier = parseInt(document.getElementById('idItem').innerHTML);
  nbItemPanier += totalQte;
  document.getElementById("idItem").innerHTML = nbItemPanier;
  removeEmptyItemFromCart(); 
}

function  afficherListeProduits(){
  document.getElementById("zoneContenuItem").innerHTML='' ;
  listeProduits.forEach(function(item, index){
    //if(parseInt(item.id)  < 1110 && parseInt(item.id) > 1100 ) {  
    if(item.sujet == subjetCat) { 
    
    var description = item.titre;
    var image = item.image;  
    var prix = item.prix;  
    var noeudDivItem = document.createElement("div");
 
    noeudDivItem.setAttribute("class", "item");
    
    var noeudImage = document.createElement("img");
    noeudImage.setAttribute("class", "imageItem");
    noeudImage.setAttribute("src", image);
    noeudDivItem.appendChild(noeudImage);

    noeudImage.addEventListener("click", function(){
      afficherDetail(item);
    });

    var noeuDescription = document.createElement("div");
    noeuDescription.setAttribute("class", "description");
    noeuDescription.appendChild(document.createTextNode(description));
    noeudDivItem.appendChild(noeuDescription);

    var noeudPrix = document.createElement("div");
    noeudPrix.setAttribute("class", "prix");
    noeudPrix.appendChild(document.createTextNode(prix));
    noeudDivItem.appendChild(noeudPrix);

    var noeudBtnAjouter = document.createElement("div");
    noeudBtnAjouter.setAttribute("class", "ajouter");
    noeudBtnAjouter.appendChild(document.createTextNode("Ajouter"));
    noeudDivItem.appendChild(noeudBtnAjouter); 

    noeudBtnAjouter.addEventListener("click", function(){
      var ligneCommande = {produit : item, quantite : "1"};
      ajouterItem(ligneCommande);
    });

    document.getElementById("zoneContenuItem").appendChild(noeudDivItem);
   }
  });
};


function afficherDetail(unProduit){
  document.querySelector("#zoneDetail").style.display="block";  
  document.querySelector("#zoneContenuItem").style.display="none";
  document.querySelector("#uneImage").src= unProduit.image;
  document.querySelector("#uneDescription").innerHTML = unProduit.titre;
  document.querySelector("#unPrix").innerHTML = unProduit.prix;
  document.querySelector("#unDetail").innerHTML = unProduit.description;

  document.querySelector("#unAjout").addEventListener("click", function(){
    document.querySelector("#zoneDetail").style.display = "none";
   
    var qte = document.querySelector("#txtQuantite").value ;  
    var ligneCommande = {produit : unProduit, quantite : qte};
      ajouterItem(ligneCommande);
      location.reload();      
  });
  topFunction();
}

function fermerDialogue(){
  document.querySelector("#zoneDetail").style.display ="none";  
  location.reload();
}

// remove  empty item from cart
function removeEmptyItemFromCart() {
  panier = panier.filter((item) => item.quantite != 0 );
  enregistrerPanier();   
};

function viderPanier(){ 
  order = JSON.parse(localStorage.getItem('panier'));
  localStorage.setItem("order",JSON.stringify(order)); 
  
  alert("Panier vide. Merci de votre achat! "); 
  localStorage.removeItem("panier");
  location.reload(); 
}


function afficherOrder(){
  document.getElementById("zoneContenuItem").style.display = "none";
  document.getElementById("zoneContenuFacture").style.display = "none";
  document.getElementById("zoneContenuOrder").style.display = "block";
  document.getElementById("zoneContenuOrder").style.height = "85%";

  var sousTotal = 0;
  var noeudTBody = document.querySelector('#corps2Tableau');
  
  if (noeudTBody.textContent !=='\n\t\t\t\t') return;    
  else {
  //
    order = JSON.parse(localStorage.getItem('order'));
    order.forEach(function(ligneCommande, index){
    var nomDeProduit = ligneCommande.produit.titre;
    var quantite = ligneCommande.quantite;
    var prix = ligneCommande.produit.prix;
    sousTotal += parseInt(quantite) * parseFloat(prix);

    var noeudTr = document.createElement("tr");
    var noeudTd1 = document.createElement("td");
    var contenuTd1 = document.createTextNode(nomDeProduit);
    noeudTd1.appendChild(contenuTd1);
    noeudTr.appendChild(noeudTd1);

    var noeudTd2 = document.createElement("td");     
    var contenuTd2 = document.createTextNode(quantite); 
    noeudTd2.appendChild(contenuTd2);
    noeudTr.appendChild(noeudTd2);

    var noeudTd3 = document.createElement("td");  
    var contenuTd3 = document.createTextNode(prix);
    noeudTd3.appendChild(contenuTd3);
    noeudTr.appendChild(noeudTd3);

    noeudTBody.appendChild(noeudTr);
  });
  var totalTPS = sousTotal * TAUX_TPS;
  var totalTVQ = sousTotal * TAUX_TVQ; 
  var total = sousTotal + totalTPS + totalTVQ;
  document.querySelector('#id2SousTotal').innerHTML = sousTotal.toFixed(2)+' $';
  document.querySelector('#id2TPS').innerHTML = totalTPS.toFixed(2)+' $';
  document.querySelector('#id2TVQ').innerHTML = totalTVQ.toFixed(2)+' $';
  document.querySelector('#id2Total').innerHTML = total.toFixed(2)+' $';
   
}
}

 
//chercher produit
function  chercherProduit(){
  const id = document.querySelector('#chercherProduit').value;
  listeProduits.forEach(function(item){ 
	if( item.id == id) {
    alert('produit trouvé!');
    afficherDetail(item);
    return;
  }   
  });  
}

function gohome()
{
  window.location="../index.html"
}
function promotion()
{
  window.location="../promotion.htm"
}
function contact()
{
  window.location="../location.htm"
}

 function avertir(obj){
  subjetCat= obj.innerHTML;    
  afficherListeProduits();
 }
  
 function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
 

 
 
 