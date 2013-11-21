var app = app||{};
app.fichier = (function(){
	var initFS, creerFichier, ecritFichier, urlFichier, errorHandler;
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	
	errorHandler = function errorHandler(e){
		  var msg = '';
		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    default:
		      msg = 'Unknown Error';
		      break;
		  };
		  
		  console.log('File system error message :' + msg);
		};
		
		initFS = function initFS() {
			
			  return window.requestFileSystem(window.TEMPORARY, 1024*1024,function(fs){return fs;},errorHandler);//création d'un filesystem de 1Mio
			};
			
		creerFicher = function creerFichier(fs,nom){
			fs.root.getFile(nom,{create:true});
		};
		
		ecritFichier = function ecritFichier(fs,nom,donnees){ //données sous forme de blob
			/*var temp = window.localStorage.getItem('position');
	    	var pos = JSON.parse(temp);
	    	temp = window.localStorage.getItem('vitesse');
	    	var vit = JSON.parse(temp);*/
	    	var fichier = fs.root.getFile(nom,{create:false});
	    	var writer = fichier.createWriter();
	    	writer.write(donnees);
		};
		
		urlFichier = function urlFichier(fs,nom){
			var fichier = fs.root.getFile(nom,{create:false});
			return fichier.toUrl();
		};		
	
	return {
		initFS:initFS,
		creerFichier:creerFichier,
		ecritFichier:ecritFichier,
		urlFichier:urlFichier};
})();