var app = (function(){
	var app,liquides;
	
	liquides={ 
			eau : {viscosite : 0.001002 , densite : 1000},
			alcool :{viscosite : 0.0012 , densite : 789},
			glycerine :{viscosite : 1.49 , densite : 1260},
			miel :{viscosite : 10 , densite : 1422},
			huile :{viscosite : 0.9 , densite : 920},
			jus :{viscosite : 0.0035 , densite : 1059},
			petrole :{viscosite : 0.00065 , densite : 800}
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
        window.localStorage.setItem('fluide', $('#fluide option:selected').val());
        window.localStorage.setItem('volume', $('#volume option:selected').val());
        window.localStorage.setItem('matiere', $('#matiere option:selected').val());
        var message = 'fluide : '+window.localStorage.getItem('fluide')+' volume :'+window.localStorage.getItem('volume')+' matière : '+window.localStorage.getItem('matiere');
        console.log(message);
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
    	/*$('#bille').animate({
    		  top : 500
    		},
    		{
    			duration:5000,
    			easing:'linear',
    			step: function(now, fx) {
    		    console.log(now);
    		     }
    });*/
    	var pas = 0.04;
    	var temps = 0;
    	var constante = 4900;
    	var maximum = parseInt($('#eprouvette').css('height')) - parseInt($('#bille').css('height'));
    	console.log(maximum);
    	while(parseInt($('#bille').css('top'))< maximum){    		
    		for(var i=0; i<1000000;i+=1)
    			{
    				
    			}
    		var x = constante*temps * temps;
    		temps += pas;
    		$('#bille').clone().appendTo($('#eprouvette'));
    		if(x>maximum){
    			x=maximum;
    		}
    		$('#bille').css({top:x});
    	}
    },
    resetAnimation:function(e){
    	console.log('reset');
    	$('#eprouvette').empty();
    	$('#eprouvette').append('<div id="bille"></div>');
    	
    }
	};
	
	return app;
})();

$(function(){
    app.init();  
});