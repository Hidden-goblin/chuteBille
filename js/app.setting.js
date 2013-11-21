var app = app||{};
app.setting=(function(){
	var fluide, duree, matiere, getViscosite, getDensite, getDuree;
	
	fluide = { 
			eau : {viscosite : 0.001002 , densite : 1000},
			alcool :{viscosite : 0.0012 , densite : 789},
			glycerine :{viscosite : 1.49 , densite : 1260},
			miel :{viscosite : 10 , densite : 1422},
			huile :{viscosite : 0.9 , densite : 920},
			jus :{viscosite : 0.0035 , densite : 1059},
			petrole :{viscosite : 0.00065 , densite : 800},
			air:{viscosite:0.0000178, densite:1.2}
	};
	
	duree = { fer : {eau :1.07,
		  alcool :1.09,
		  glycerine:5.23,
		  miel:35.73,
		  huile:3.1,
		  jus:1.08,
		  petrole:1.06,
		  air:1.00009},
	plastique :{eau :-1,
		  		alcool :3.13,
		  		glycerine:-1,
		  		miel:-1,
		  		huile:-1,
		  		jus:-1,
		  		petrole:3.29,
				air:1.00083},
	cuivre :{eau :1.06,
		  alcool :1.05,
		  glycerine:4.49,
		  miel:25.13,
		  huile:2.74,
		  jus:1.07,
		  petrole:1.05,
		  air:1.00008},
	aluminium :{eau :1.26,
		  alcool :1.19,
		  glycerine:23.35,
		  miel:176.06,//environ 3 minutes
		  huile:11.46,
		  jus:1.30,
		  petrole:1.19,
		  air:1.00036},
	plomb:{eau :1.05,
		  alcool :1.04,
		  glycerine:3.49,
		  miel:22.69,
		  huile:2.22,
		  jus:1.05,
		  petrole:1.04,
		  air:1.00006}};
	
	matiere = {
			cuivre:8960,
			fer:7874,
			aluminium:2698,
			plastique:885,
			plomb:11350
	};
	
	getViscosite = function getViscosite(vis){
		return fluide[vis]['viscosite'];
	};
	
	getDensite = function getDensite(mat){
		var retour =  false;
		
		if(mat in fluide)
			{
				retour = fluide[mat]['densite'];
			}
		else
			{
				if(mat in matiere)
					{
						retour = matiere[mat];
					}
			}
		
		return retour;
	};
	
	getDuree =  function getDuree(mat,liquide){
		return duree[mat][liquide];
	};
	
	return {
		getViscosite : getViscosite,
		getDensite : getDensite,
		getDuree : getDuree
	};
}());
