var app = (function(){
	var app,liquides,matiere,tableDuree;
	
	liquides={ 
			eau : {viscosite : 0.001002 , densite : 1000},
			alcool :{viscosite : 0.0012 , densite : 789},
			glycerine :{viscosite : 1.49 , densite : 1260},
			miel :{viscosite : 10 , densite : 1422},
			huile :{viscosite : 0.9 , densite : 920},
			jus :{viscosite : 0.0035 , densite : 1059},
			petrole :{viscosite : 0.00065 , densite : 800}
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
        //this.$checkBoxChrono.bind('click', $.proxy(this.))
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
       
    },
    backToMenu: function( e ){
        e.preventDefault();
        console.log('back');
        document.getElementById("titrePage").innerHTML =" Sélection des paramètres de simulation.";
        this.$accueil.show();
        this.$simulation.hide();
        this.resetAnimation(e);
    },
    submit: function( e ) {
        e.preventDefault();
        console.log('submit');
        document.getElementById("titrePage").innerHTML =" Effectuer la simultation.";
        this.$accueil.hide();
        this.$simulation.show();
        // Stockage des variables de choix
        var fluide = $('#fluide option:selected').val();
        var materiau = $('#matiere option:selected').val();
        window.localStorage.setItem('fluide', fluide);
        //window.localStorage.setItem('volume', $('#volume option:selected').val()); nom pertinent pour l'instant
        window.localStorage.setItem('matiere', materiau);
        var message = 'fluide : '+window.localStorage.getItem('fluide')+' matière : '+window.localStorage.getItem('matiere');
        console.log(message);
        
        // Calcul des constantes de simulation.
        var K = 2* Math.pow(0.01,2)*matiere[materiau]/(9*liquides[fluide]['viscosite']);
    	var F = 2*Math.pow(0.01,2)*(matiere[materiau] - liquides[fluide]['densite'])/(9*liquides[fluide]['viscosite']);
    	
    	// stokage local des constantes de simulation
    	window.localStorage.setItem('K',K);
    	window.localStorage.setItem('F',F);
    	
    	// Vérification que la simulation est possible.
    	
    	console.log('K = '+K+' et F='+F+'chronophotogramme'+$('#chronophotogramme').attr('checked'));
    	
    	if(F<=0)
    		{
    			$('#animation').unbind('click');
    			$('#animation').css({opacity:.5});
    			$('#erreurs').html('La simulation est impossible dans ces conditions.');
    			$('#tempsSimulation').html('');
    			$('#parametresChoisis').html('');
    		}
    	else
    		{
    			$('#animation').unbind('click').bind('click', $.proxy(this.animer,this));//Test si déjà bind?
    			$('#animation').css({opacity:1});
    			$('#erreurs').html('');
    			$('#tempsSimulation').html('Le temps réel de chute est de '+ tableDuree[materiau][fluide]+' seconde(s)' );
    			$('#parametresChoisis').html('<table><tr><td>Fluide : </td><td>'+fluide+'</td></tr>');
    			$('#parametresChoisis').append('<tr><td>Bille : </td><td>'+materiau+'</td></tr></table>');
    		}
    },
    goToProcessing: function(e){
    	e.preventDefault();
    	console.log('vers traitement');
    	document.getElementById("titrePage").innerHTML = "Effectuer le traitement des données de simulation.";
    	this.$simulation.hide();
    	this.$traitement.show();
    },
    goToParam: function(e){
    	e.preventDefault();
    	console.log('vers accueil');
    	document.getElementById("titrePage").innerHTML = "Sélection des paramètres de simulation.";
    	this.$traitement.hide();
    	this.$accueil.show();
    	this.resetAnimation(e);
    },
    animer:function(e){
    	var K = 2* Math.pow(0.01,2)*matiere[window.localStorage.getItem('matiere')]/(9*liquides[window.localStorage.getItem('fluide')]['viscosite']);
    	var F = 2*Math.pow(0.01,2)*(matiere[window.localStorage.getItem('matiere')] - liquides[window.localStorage.getItem('fluide')]['densite'])/(9*liquides[window.localStorage.getItem('fluide')]['viscosite']);
    	
    	console.log('K = '+K+' et F='+F+'chronophotogramme'+$('#chronophotogramme').attr('checked'));
    	console.log($('#chronophotogramme').attr("checked")=="checked");
    	$('#fantome').animate({
    				left : 100
    				},
    				{
    					duration:5000,
    					easing:'linear',
    					step: function(now, fx) {
    						var temps = now*22.4/100;
    						console.log('t='+now+';pos='+temps*temps+'; left='+$('#fantome').css("left"));
    						/*if($('chronophotogramme').attr('checked')=="checked")
    			    		{ */   			    			
    							
    			    		/*}*/
    						$('#eprouvette').append(($('#bille').clone()));
    						$('#bille').css({top:temps*temps });
    					}
    				});
    		},
    resetAnimation:function(e){
    	console.log('reset');
    	$('#eprouvette').empty();
    	$('#eprouvette').append('<div id="bille"></div>');
    	$('#eprouvette').append('<div id="fantome"></div>');   	
    }
	};
	
	return app;
})();

$(function(){
    app.init();  
});