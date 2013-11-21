var app = app||{};
app.simulation =(function(){
	var preparation, start, stop, timer;
	
	preparation = function preparation(K,F){
		var nombreFrame = 0;
		var pos=[];
		var vit=[];
		
		//Si la préparation a déjà été faite on ne la refait plus. Pas de calculs inutiles!
		if(window.localStorage.getItem('position')!==null && window.localStorage.getItem('position').length !== 0)
			{
				pos = JSON.parse(window.localStorage.getItem('position'));
				nombreFrame = pos.length;
			}
		else
			{
				pos[0]=0;
				vit[0]=0;
				// Préparation de la simulation
				while(pos[nombreFrame] < 480)
				{
					nombreFrame+=1;
					var tReel = nombreFrame*0.04; 
					pos[nombreFrame] = 1000*F*(tReel + K*Math.exp(-tReel/K)-K); //le facteur 1000 correspond à mise à l'échelle 500px correspond à 0,5m
					vit[nombreFrame] = F*(1 - Math.exp(-tReel/K)); //Calcul de la vitesse instantannée
				}
				
				//Examen du dernier point
				if(pos[nombreFrame]>480)
				{
					pos[nombreFrame]=480;
				}
    	
				nombreFrame +=1;
				//Sauvegarde du tableau de position et vitesse pour une récupération future.
				window.localStorage.setItem('position',JSON.stringify(pos)); //Passage en string de l'objet pos
				window.localStorage.setItem('vitesse',JSON.stringify(vit)); //Passage en string de l'objet vit
			}
    	
		return nombreFrame;
	};
	start = function start(chrono,pas,nombreFrame){
		var t = 0;
		var leModulo = Math.round(nombreFrame/10);
		var pos = JSON.parse(window.localStorage.getItem('position'));
    	var step = function(){
    		if(t<nombreFrame)
    			{	
    				$('#bille').text(t);
    				if( chrono && t%leModulo == 0)
    					{
    						$('#eprouvette').append($('#bille').clone(true));
    					}
    						$('#bille').css({top:pos[t]});
    				t +=1;
    				timer = setTimeout(step,pas);
    			}
    	};
    	timer = setTimeout(step,pas);
	};
	stop = function stop(){
		clearTimeout(timer);
	};
	
	
	return{
		preparation:preparation,
		start:start,
		stop:stop		
	};
}());
