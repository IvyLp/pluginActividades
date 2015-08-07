(function($){
    $.fn.MultipleVarias = function(options) {
        var defaults = {
            json: ' ',
            min : '0'
          },
          settings = $.extend({}, defaults, options),
          $this = $(this),
          $mod = $this.parents('.modal'),
          $foot = $mod.find('.modal-footer');

		var index=0,
 			html="",
 			json,
 			pagina=0,
 			idACtivo,
 			respuestas=[],
 			respuestasPagina=[],
 			correctasTotal=0,
 			cantidadRespuestas=3,
 			contadorRespuestas=0,
 			correctasPagina=0;

		$this.delegate('.opciones','click',activar);
		$foot.delegate('.Enviar','click',evaluar);
		$foot.delegate('.Try','click',limpiar);
		$foot.delegate('.Limpiar','click',cargarInicio);

		$.getJSON( "json/"+settings.json, function( data ) {
			json=data;	
		}).complete(cargarInicio);
	
		function cargarInicio(){
			contadorRespuestas=0;
			$this.empty();
			$foot.empty();
			html="";
			$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
			html+="<div class='titulo'>"+json.Presentacion.Titulo+"</div><br/>";
			html+="<div class='descrip'>"+json.Enunciado[pagina]+"</div>";
			html+="<div class='contiene-opciones'>";
			$.each(json.Actividad[pagina], function(index, value) {
				html+="<div class='opciones' id="+index+">"+value+"</div>";
			});
			$foot.append("<div class='validadores'><div class='Enviar send1'><a href='#'>"+json.Botones.enviar+"</a></div><div class='Limpiar'><a href='#'>"+json.Botones.limpiar+"</a></div></div>");
			html+="<div class='contador'>"+(pagina+1)+"/"+json.Actividad.length+"</div>";
			html+="</div>";
			$this.append(html);
		}
	
		function limpiar(){
			contadorRespuestas=0;
			respuestas=[];
			pagina=0;
			correctasTotal=0;
			contadorRespuestas=0;
			respuestasPagina=[];
			$this.empty();
			cargarInicio();
		}
	
		function activar(){
			var contadorInterno=0;
			contadorRespuestas+=1;
			$('.Enviar', $mod).show();
			$('.Limpiar', $mod).show();
	
			if (contadorRespuestas<=3)
				$(this).addClass('activo');
	
			$('.contiene-opciones .opciones', $this).each(function() {
		    	if ($(this).hasClass('activo')) {							
					respuestas[contadorInterno]=$(this).attr('id');
					contadorInterno+=1;
				}
			});
		} 
	
		function evaluar(){
			correctasPagina=0;
			if ((pagina+1)!=json.Actividad.length) {	  	    
				$.each(json.Respuestas[pagina], function(index,value){
					var actual=value;
					$.each(respuestas, function(index, value){
						if(actual==value) {
							correctasTotal+=1;	
							correctasPagina+=1;	
						}
					});
				});
				respuestasPagina[pagina]=correctasPagina;
			 	pagina+=1;
				cargarInicio();
			}
			else {
				correctasPagina=0;
				$this.empty();
				$foot.empty();
				html="";
				$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
				html+="<div class='titulo'>"+json.Presentacion.Titulo+"</div>";
				$.each(json.Respuestas[pagina], function(index,value){
					var actual=value;
					$.each(respuestas, function(index, value){
						if(actual==value) {
							correctasTotal+=1;	
							correctasPagina+=1;	
						}
					});
				});
				respuestasPagina[pagina]=correctasPagina;
				if (correctasTotal>=8) {
					html+="<div class='descrip' style='height: 200px; line-height: 40px; margin-top: 20px;'>"+json.Retroalimentacion.Bien+": "+correctasTotal+" / "+(json.Actividad.length * cantidadRespuestas);
					$.each(respuestasPagina, function(index,value){				 
				  		html+="<br/>Tu puntaje en la pagina "+(index+1)+" fue: "+respuestasPagina[index]+" / "+cantidadRespuestas;
				  	});
				  	html+="</div>";
				}
				else {
					html+="<div class='descrip' style='height: 200px; line-height: 40px; margin-top: 20px;'>"+json.Retroalimentacion.Mal+": "+correctasTotal+" / "+(json.Actividad.length * cantidadRespuestas);
					$.each(respuestasPagina, function(index,value){				 
				  		html+="<br/>Tu puntaje en la pagina "+(index+1)+" fue: "+respuestasPagina[index]+" / "+cantidadRespuestas;
				  	});
				   	html+="</div>";
					$foot.append("<div class='validadores'><div class='Try'><a href='#'>"+json.Botones.repetir+"</a></div></div>");
				}
				$this.append(html);
			}
		}
		return this;
    }
})(jQuery);