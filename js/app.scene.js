var app = app||{};
app.scene = (function(){
	var goToAccueil, goToSimulation, goToTraitement, popup, lancerSimulation, reinitialiserSimulation, arreterSimulation,
		afficherTableau, afficherCourbe, arret, telechargerSimulation,afficheInformation, effaceInformation;
	
	goToAccueil = function goToAccueil(e){
		if(typeof(e)!=='undefined')
			{
				e.preventDefault();
			}
		//Bind des événements
		$('#parametres').bind('submit',app.scene.goToSimulation);
		$('#buttonVersion').unbind('click').bind('click',popup);
		$('#buttonInstructions').unbind('click').bind('click',popup);
		//Modification du titre de la page
		$('#titrePage').text("Sélection des paramètres de simulation.");
    	// Changement de page
		$('#donnee').hide();
    	$('#traitement').hide();
    	$('#simulation').hide();
    	$('#accueil').show();
    	// Remise à zéro de l'animation
    	reinitialiserSimulation();
    	//Suppression des données d'une éventuelle simulation.
    	if(window.localStorage.getItem('position')!==null && window.localStorage.getItem('position').length !== 0)
    		{
    			window.localStorage.setItem('position','');
    			window.localStorage.setItem('vitesse','');
    		}
	};
	
	goToSimulation = function goToSimulation(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
		}
		//Changement de page
		$('#donnee').hide();
     	$('#traitement').hide();
    	$('#simulation').show();
    	$('#accueil').hide();
		
		//Stockage des éléments du formulaire.
		var fluide = $('#fluide option:selected').val();
        var matiere = $('#matiere option:selected').val();
        window.localStorage.setItem('fluide', fluide);
        window.localStorage.setItem('matiere', matiere);
        var message = 'Fluide : '+window.localStorage.getItem('fluide')+'<br /> Matière : '+window.localStorage.getItem('matiere');
       
        // Calcul des constantes de simulation.
        var K = 2* Math.pow(0.01,2)*app.setting.getDensite(matiere)/(9*app.setting.getViscosite(fluide));
    	var F = 2*Math.pow(0.01,2)*(app.setting.getDensite(matiere) - app.setting.getDensite(fluide))/(9*app.setting.getViscosite(fluide));
   	
    	// stokage local des constantes de simulation
    	window.localStorage.setItem('K',K);
    	window.localStorage.setItem('F',F);
		
    	//Modification du titre de la page
    	 $('#titrePage').text(" Effectuer la simultation.");
		
    	//Bind des boutons et de leur aspect.
     	// Première arrivée sur la page les boutons vers le traitement et la remise à zéro sont inactif
     	$('#versTraitement').unbind('click');
 		$('#versTraitement').css({opacity:.5});
 		$('#reset').unbind('click');
 		$('#reset').css({opacity:.5});
 		$('#retourParam').bind('click',goToAccueil);
 		$('#arret').hide();
 		$('#chargement').hide();
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
     			$('#animation').unbind('click').bind('click', lancerSimulation);//Test si déjà bind?
     			$('#animation').css({opacity:1});
     			$('#erreurs').html('');
     			$('#tempsSimulation').html('Le temps théorique de chute est de '+ app.setting.getDuree(matiere,fluide)+' seconde(s)' );
     			$('#parametresChoisis').html(message);
     		} 
    	
	};
	
	goToTraitement = function goToTraitement(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
		}
		//Modification du titre de la page
    	$('#titrePage').text("Effectuer le traitement des données de simulation.");
    	//Bind des boutons
    	$('#versParam').bind('click',goToAccueil);
    	$('#tableValeur').bind('click',afficherTableau);
    	$('#courbe').bind('click',afficherCourbe);
    	$('#telecharger').bind('click',telechargerSimulation);
    	//Changement de page
    	$('#donnee').hide();
     	$('#traitement').show();
    	$('#simulation').hide();
    	$('#accueil').hide();
	};
	
	popup = function popup(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
			if(e.target.id ==="buttonVersion")
    			{
    				$('#version').dialog({modal:true});
    				$('#version').dialog();
    			}
			else
			{
				if(e.target.id === "buttonInstructions")
    				{
						$('#instructions').dialog({modal:true});
						$('#instructions').dialog();
    				}
				else
    				{
						//console.log('Erreur de cible');
    				}
			}
		}
	};
	
	lancerSimulation = function lancerSimulation(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
		}
		/* Ajout du survol des billes*/
		$('#bille').bind('mouseenter',app.scene.afficheInformation);
    	$('#bille').bind('mouseleave',app.scene.effaceInformation);
		//Modification des boutons
		$('#arret').show();
		$('#arret').unbind('click').bind('click', arreterSimulation);
		$('#chargement').show();
		//Préparation de la simulation
		var nbreFrame = app.simulation.preparation(Number(window.localStorage.getItem('K')),Number(window.localStorage.getItem('F')));
		var leModulo = Math.round(nbreFrame/10);
    	var pas = parseInt($('#dilatationTemps option:selected').val()); //Modification du temps pour le rafraichissement
    	// Affichages propres à la simulation
    	var chronoIsOn = $('#chronophotogramme').is(":checked");
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
    	//Simulation
    	app.simulation.start(chronoIsOn,pas,nbreFrame);
    	//Modification des boutons
    	var temps = pas*nbreFrame;
    	arret = setTimeout(function(){$('#arret').unbind('click').hide();$('#chargement').hide();},temps);
    	$('#animation').unbind('click');
    	$('#animation').css({opacity:.5});
    	$('#reset').unbind('click').bind('click',reinitialiserSimulation);
		$('#reset').css({opacity:1});
		$('#versTraitement').unbind('click').bind('click',goToTraitement);
		$('#versTraitement').css({opacity:1});

		
	};
	reinitialiserSimulation = function reinitialiserSimulation(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
		}
		arreterSimulation();
    	$('#eprouvette').empty();
    	$('#eprouvette').append('<div id="bille"></div>');
    	$('#animation').unbind('click').bind('click', lancerSimulation);
    	$('#animation').css({opacity:1});
    	$('#reset').unbind('click');
		$('#reset').css({opacity:.5});
		$('#erreurs').html('');
	};
	arreterSimulation = function arreterSimulation(e){
		app.simulation.stop();
		clearTimeout(arret);
		$('#arret').unbind('click').hide();
		$('#chargement').hide();
		$('#erreurs').html("La simulation a été arrêtée. <br /> Pour reprendre, réinitialiser la simulation à l'aide du bouton puis redémarer.");
		
	};
	afficherTableau = function afficherTableau(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
		}
    	$('#canvas').hide();
    	$('#tableau').show();
      	var pos = JSON.parse(window.localStorage.getItem('position'));
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
	};
	afficherCourbe = function afficherCourbe(e){
		if(typeof(e)!=='undefined')
		{
			e.preventDefault();
		}

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
    
	};
	
	telechargerSimulation = function telechargerSimulation(){
		//Changement de page
		//$('#donnee').show();
     	//$('#traitement').hide();
    	//$('#simulation').hide();
    	//$('#accueil').hide();
		//Modification du titre
    	//$('#titrePage').text("Récupérer les données brutes");
    	//Gestion des évènements.
    	//$('#retour').unbind('click').bind('click',goToTraitement);
    	// Variables
		var temp = window.localStorage.getItem('position');
    	var pos = JSON.parse(temp);
    	temp = window.localStorage.getItem('vitesse');
    	var vit = JSON.parse(temp);
    	var tabDonnee = new Array();
    	//	$('#lesDonnees').html(" ");
    	  //  $('#lesDonnees').append("Temps ; Position ; Vitesse <br />");
    	tabDonnee[0] = "Temps (s); Position(mm); Vitesse(m/s)\n";
    	
    	for(var i=0, end=pos.length; i<end;i++){
    		//$('#lesDonnees').append(i*0.04 + ";" + pos[i] + ";" + vit[i] +"<br />");
    		tabDonnee[i+1] = i*0.04 + ";" + pos[i] + ";" + vit[i] +"\n";
    	}
    	var mesDonnees =  new Blob(tabDonnee,{type:"text/plain"});
    	saveAs(mesDonnees,"simulation.txt");
    	//var fs = app.fichier.initFS();
    	//app.fichier.creerFichier(fs,'simulation.txt');
    	//app.fichier.ecrireFichier(fs,'simulation.txt',mesDonnees);
    	//console.log("URL du blog : " + window.URL.createObjectURL(mesDonnees));
    	//document.location.url = window.URL.createObjectURL(mesDonnees);//app.fichier.urlFichier(fs,'simulation.txt');
    	 
    	
	};
	
	afficheInformation = function afficheInformation(e){
		
		var frame = Number(e.target.innerHTML);
		var pos = JSON.parse(window.localStorage.getItem('position'));
		var vit = JSON.parse(window.localStorage.getItem('vitesse'));
		
		$('#resultat').html('Le numero d\'apparition de la bille est le '+frame+'.<br /> Cela correspond à un temps de '+frame*0.04+'seconde(s)<br />La hauteur est de '+Math.round(Number(pos[frame]))/1000+'m.<br /> La vitesse est de '+Math.round(Number(vit[frame])*100)/100+'m/s');		
	};
	
	effaceInformation = function effaceInformation(e){
		$('#resultat').html('');
	};
	return {
		goToAccueil:goToAccueil, 
		goToSimulation:goToSimulation,
		goToTraitement:goToTraitement,
		popup:popup,
		lancerSimulation:lancerSimulation, 
		reinitialiserSimulation:reinitialiserSimulation, 
		arreterSimulation:arreterSimulation,
		afficherTableau:afficherTableau,
		afficherCourbe:afficherCourbe,
		telechargerSimulation:telechargerSimulation,
		afficheInformation:afficheInformation,
		effaceInformation:effaceInformation};
	
})();
