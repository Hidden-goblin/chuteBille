var app = (function(){
	var app,liquides,matiere,tableDuree, timer;
	
	liquides={ 
			eau : {viscosite : 0.001002 , densite : 1000},
			alcool :{viscosite : 0.0012 , densite : 789},
			glycerine :{viscosite : 1.49 , densite : 1260},
			miel :{viscosite : 10 , densite : 1422},
			huile :{viscosite : 0.9 , densite : 920},
			jus :{viscosite : 0.0035 , densite : 1059},
			petrole :{viscosite : 0.00065 , densite : 800},
			air:{viscosite:0.0000178, densite:1.2}
	};
	
	tableDuree = { fer : {eau :1.07,
						  alcool :1.09,
						  glycerine:5.23,
						  miel:35.73,
						  huile:3.1,
						  jus:1.08,
						  petrole:1.06},
					plastique :{eau :-1,
						  		alcool :3.13,
						  		glycerine:-1,
						  		miel:-1,
						  		huile:-1,
						  		jus:-1,
						  		petrole:3.29},
					cuivre :{eau :1.06,
						  alcool :1.05,
						  glycerine:4.49,
						  miel:25.13,
						  huile:2.74,
						  jus:1.07,
						  petrole:1.05},
					aluminium :{eau :1.26,
						  alcool :1.19,
						  glycerine:23.35,
						  miel:176.06,//environ 3 minutes
						  huile:11.46,
						  jus:1.30,
						  petrole:1.19},
					plomb:{eau :1.05,
						  alcool :1.04,
						  glycerine:3.49,
						  miel:22.69,
						  huile:2.22,
						  jus:1.05,
						  petrole:1.04}};
	
	matiere ={
			cuivre:8960,
			fer:7874,
			aluminium:2698,
			plastique:885,
			plomb:11350
	};
	
	app={
    init: function(){
        this.makeCache();
        this.bindEvents();
    },
    bindEvents: function(){
        this.$form.bind('submit', $.proxy(this.submit, this));
        this.$buttonSimulationVersParam.bind('click', $.proxy(this.backToMenu, this));
        this.$buttonSimulationVersTraitement.bind('click', $.proxy(this.goToProcessing, this));
        this.$buttonTraitementVersParam.bind('click', $.proxy(this.goToParam,this));
        this.$buttonAnimation.bind('click', $.proxy(this.animer,this));
        this.$buttonResetAnimation.bind('click', $.proxy(this.resetAnimation,this));
        this.$buttonTableValeur.bind('click',$.proxy(this.tableValeur,this));
        this.$buttonCanvas.bind('click',$.proxy(this.canvas,this));
        this.$lienPopup.bind('click',$.proxy(this.popup,this));
        this.$buttonPopupVersion.bind('click',$.proxy(this.popup,this));
        this.$buttonPopupInstructions.bind('click',$.proxy(this.popup,this));
    },
    makeCache: function(){
    	this.$header = $('header');
        this.$form = $('form');
        this.$accueil = $('#accueil');
        this.$simulation = $('#simulation');
        this.$traitement = $('#traitement');
        this.$buttonSimulationVersParam= $('#retourParam');
        this.$buttonSimulationVersTraitement=$('#versTraitement');
        this.$buttonTraitementVersParam=$('#versParam');
        this.$buttonAnimation=$('#animation');
        this.$buttonResetAnimation=$('#reset');
        this.$checkBoxChrono=$('#chronophotogramme');
        this.$buttonTableValeur=$('#tableValeur');
        this.$buttonCanvas=$('#courbe');
        this.$buttonPopupVersion=$('#buttonVersion');
        this.$buttonPopupInstructions=$('#buttonInstructions');
        this.$lienPopup=$('a [href^=#]');
  
    },
    backToMenu: function( e ){
        e.preventDefault();

        $('#titrePage').text(" Sélection des paramètres de simulation.");
        this.$accueil.show();
        this.$simulation.hide();
        this.resetAnimation(e);
    },
    submit: function( e ) {
        e.preventDefault();
        //Changement de titre de page
        $('#titrePage').text(" Effectuer la simultation.");
        //Changement de page
        this.$accueil.hide();
        this.$simulation.show();
        // Stockage des variables de choix
        var fluide = $('#fluide option:selected').val();
        var materiau = $('#matiere option:selected').val();
        window.localStorage.setItem('fluide', fluide);
        //window.localStorage.setItem('volume', $('#volume option:selected').val()); non pertinent pour l'instant
        window.localStorage.setItem('matiere', materiau);
        
        //Information sur les choix
        var message = 'fluide : '+window.localStorage.getItem('fluide')+' matière : '+window.localStorage.getItem('matiere');

        
        // Calcul des constantes de simulation.
        var K = 2* Math.pow(0.01,2)*matiere[materiau]/(9*liquides[fluide]['viscosite']);
    	var F = 2*Math.pow(0.01,2)*(matiere[materiau] - liquides[fluide]['densite'])/(9*liquides[fluide]['viscosite']);
    	
    	// stokage local des constantes de simulation
    	window.localStorage.setItem('K',K);
    	window.localStorage.setItem('F',F);
    	
    	// Première arrivée sur la page les boutons vers le traitement et la remise à zéro sont inactif
    	$('#progressBar').hide();
    	$('#versTraitement').unbind('click');
		$('#versTraitement').css({opacity:.5});
		$('#reset').unbind('click');
		$('#reset').css({opacity:.5});
    	// Vérification que la simulation est possible.
    	if(F<=0)
    		{
    			// Elle n'est pas possible : seul le bouton retour est actif
    			$('#animation').unbind('click');
    			$('#animation').css({opacity:.5});
    			$('#erreurs').html('La simulation est impossible dans ces conditions.');
    			$('#tempsSimulation').html('');
    			$('#parametresChoisis').html('');
    		}
    	else
    		{
    			//Elle est possible on affiche le bouton de simulation
    			$('#animation').unbind('click').bind('click', $.proxy(this.animer,this));//Test si déjà bind?
    			$('#animation').css({opacity:1});
    			$('#erreurs').html('');
    			$('#tempsSimulation').html('Le temps théorique de chute est de '+ tableDuree[materiau][fluide]+' seconde(s)' );
    			$('#parametresChoisis').html('Fluide : '+fluide+'<br />');
    			$('#parametresChoisis').append('Bille : '+materiau);
    		}
    },
    goToProcessing: function(e){
    	e.preventDefault();

    	$('#titrePage').text("Effectuer le traitement des données de simulation.");
    	this.$simulation.hide();
    	this.$traitement.show();
    },
    goToParam: function(e){
    	e.preventDefault();

    	$('#titrePage').text("Sélection des paramètres de simulation.");
    	// Changement de page
    	this.$traitement.hide();
    	this.$accueil.show();
    	// Remise à zéro de l'animation
    	this.resetAnimation(e);
    	//Suppression des données d'une éventuelle simulation.
    	if(typeof(window.localStorage.getItem('position'))!=='undefined' && window.localStorage.getItem('position').length !== 0)
    		{
    			window.localStorage.setItem('position','');
    			window.localStorage.setItem('vitesse','');
    		}
    		
    },
    animer:function(e){
    	e.preventDefault();
    	// Récupération des paramètres de simulation
    	var K = Number(window.localStorage.getItem('K'));
    	var F = Number(window.localStorage.getItem('F'));

    	// Définition des paramètres locaux
    	$('#progressBar').show();
    	var t=0;
    	var pos=[];
    	var vit=[];
    	pos[0]=0;
    	vit[0]=0;
    	// Préparation de la simulation
    	while(pos[t] < 480)
    		{
				t+=1;
    			var tReel = t*0.04; 
    			pos[t] = 1000*F*(tReel + K*Math.exp(-tReel/K)-K); //le facteur 1000 correspond à mise à l'échelle 500px correspond à 0,5m
    			vit[t] = F*(1 - Math.exp(-tReel/K)); //Calcul de la vitesse instantannée
    		}
    	
    	//Examen du dernier point
    	if(pos[t]>480)
		{
			pos[t]=480;
		}
    	//Paramètres d'affichage
    	var nbreFrame = t+1; //On part de 0 donc une frame de plus.
    	var leModulo = Math.round(nbreFrame/10);
    	var pas = parseInt($('#dilatationTemps option:selected').val()); //Modification du temps pour le rafraichissement
    	if( $('#chronophotogramme').is(":checked"))
    	{
    		var message ='Le temps entre chaque image est de '+ leModulo*0.04 +' secondes.';
    		$('#intervale').html('');
    		$('#intervale').html(message);
    	}
    	else
    		{
    			$('#intervale').html('');
    		}
    	
    	//Sauvegarde du tableau de position et vitesse pour une récupération future.
    	window.localStorage.setItem('position',JSON.stringify(pos)); //Passage en string de l'objet pos
    	window.localStorage.setItem('vitesse',JSON.stringify(vit)); //Passage en string de l'objet vit
    	
    	// L'animation avec un pas définit par l'utilisateur.
    	t = 0;
    	var step = function(){
    		if(t<nbreFrame)
    			{	
    				if( $('#chronophotogramme').attr("checked")=="checked" && t%leModulo == 0)
    					{
    						$('#eprouvette').append($('#bille').clone());
    					}
    						$('#bille').css({top:pos[t]});
    				t +=1;
    				setTimeout(step,pas);
    			}
    	};
    	timer = setTimeout(step,pas);
    	$('#progressBar').hide();
    	this.$buttonAnimation.unbind('click');
    	this.$buttonAnimation.css({opacity:.5});
    	$('#reset').unbind('click').bind('click',$.proxy(this.resetAnimation,this));
		$('#reset').css({opacity:1});
		$('#versTraitement').unbind('click').bind('click',$.proxy(this.goToProcessing,this));
		$('#versTraitement').css({opacity:1});
    		},
    resetAnimation:function(e){
    	e.preventDefault();
    	$('#eprouvette').empty();
    	$('#eprouvette').append('<div id="bille"></div>');
    	$('#animation').unbind('click').bind('click', $.proxy(this.animer,this));
    	$('#animation').css({opacity:1});
    	$('#reset').unbind('click');
		$('#reset').css({opacity:.5});
    },
    tableValeur:function(e){
    	e.preventDefault();
    	$('#canvas').hide();
    	$('#tableau').show();
    	var temp = window.localStorage.getItem('position');
    	var pos = JSON.parse(temp);
    	var taille = pos.length;
    	var pas = Math.floor(taille/10);
    	var contenu = "<table class=\"table\"> <tr><td>t (en secondes)</td><td> X (en mètre)</td></tr>";

    	for(var i=0; i<taille;i+=pas)
    		{
    			t = i*0.04;
    			contenu += '<tr><td>'+t+'</td><td>'+Math.round(pos[i]*1000)/1000000+'</td></tr>';
    		}
    	contenu += "</table>";
    	$('#tableau').html(contenu);
    },
    canvas:function(e){
    	e.preventDefault();

    	$('#canvas').show();
    	$('#tableau').hide();
    	//Variables
    	var temp = window.localStorage.getItem('position');
    	var pos = JSON.parse(temp);
    	temp = window.localStorage.getItem('vitesse');
    	var vit = JSON.parse(temp);
    	var taille = pos.length;
    	var delta, TMAX = taille *0.04;
    	var VMAX = vit[taille-1];
    	var PMAX = pos[taille -1];
    	var graphMax,texte, util, width = $('#canvas').attr('width'),height=$('#canvas').attr('height');
    	var margeLarge = Math.round(0.1*width), margeHauteur = Math.round(0.05*height),zoneLarge = width-margeLarge, zoneHaut =height-margeHauteur;

    	if($('input[type=radio][name=typeCourbe]:checked').attr('value') === "vitesse")
    		{
    			util = vit;
    			delta = zoneHaut/VMAX;
    			graphMax=VMAX;
    			texte = 'Vitesse en m/s';
    		}
    	else
    		{
    			util = pos;
    			delta = zoneHaut/480;
    			graphMax = PMAX;
    			texte = 'Position en mm';
    		}
    	
    	//Dessin
    	var dessin =document.getElementById("canvas");
    	var context = dessin.getContext('2d');
    	context.clearRect(0,0,width,height);
   		context.strokeStyle='#FFFFFF';
   		context.beginPath();
   		context.fillStyle = "black";
    	context.font="12px sans-serif";
    	context.textBaseline ="top";
   		//Grille et axes
   		//quadrillage vertical et label
   		for(var i=0, j=Math.floor(zoneLarge/40);i<j;i+=1)
   			{
   				context.moveTo(margeLarge+i*40,zoneHaut);
   				context.lineTo(margeLarge+i*40,0);
   				context.fillText(Math.round(i*40*TMAX/zoneLarge*100)/100,i*40+margeLarge-5,zoneHaut);
   			}
   		//quadrillage horizontal et label
   		for(var i=0, j=Math.floor(zoneHaut/40);i<j;i+=1)
   			{
   				context.moveTo(margeLarge,zoneHaut-i*40);
				context.lineTo(width,zoneHaut-i*40);
				context.fillText(Math.round(i*40*graphMax/zoneHaut*100)/100,0,zoneHaut-i*40);
			}
   		//nommage des axes
   		context.fillText('Temps en s',width-140,zoneHaut-20);
    	context.fillText(texte,0,10);
   		context.stroke();
   		context.closePath();
   		// Dessin des axes
    	context.strokeStyle='#000000';
    	context.beginPath();
    	//axe horizontal
    	context.moveTo(0,zoneHaut);
    	context.lineTo(width,zoneHaut);
    	context.moveTo(width - 5,zoneHaut -5);
    	context.lineTo(width,zoneHaut);
    	context.lineTo(width - 5,zoneHaut +5);
    	//axe vertical
    	context.moveTo(margeLarge,height);
    	context.lineTo(margeLarge,0);
    	context.moveTo(margeLarge - 5,5);
    	context.lineTo(margeLarge,0);
    	context.lineTo(margeLarge + 5,5);
    	context.stroke();
    	   	
    	//Courbe
    	context.moveTo(margeLarge,zoneHaut);
    	for(var i=0;i<taille;i+=1)
    		{
    			context.lineTo(margeLarge+i*0.04*zoneLarge/TMAX,zoneHaut-util[i]*delta);
    		}
    	context.stroke();
    	context.closePath();
    
    	
    },
    popup:function(e){
    	e.preventDefault();
    	if(e.target.id ==="buttonVersion")
    		{
    			$('#version').dialog({modal:true});
    			$('#version').dialog();
    		}
    	else{
    		if(e.target.id === "buttonInstructions")
    			{
    				$('#instructions').dialog({modal:true});
    				$('#instructions').dialog();
    			}
    		else
    			{
    			console.log('Erreur de cible');
    			}
    	}
    }
	};
	
	return app;
}());

$(function(){
    app.init();  
});