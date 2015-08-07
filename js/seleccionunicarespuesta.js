(function($){
    $.fn.MultipleUnica = function(options) {
        
    	var index=0,
			html="",
 			respuestaOpcion,
  			idACtivo,
  			respuestas=[],
  			correctas=0,
  			json_sl;


        var defaults = {
            json: null,
            tipo :null,
            minq : 0,
            aud : false
          },
          settings = $.extend(true, {}, defaults, options),
          $this = $(this),
          $mod = $this.parents('.modal'),
          $foot = $mod.find('.modal-footer');

		
			$mod.delegate('.opciones','click',activar);
			$mod.on('click','.btnaudio',reproducir);	
			$foot.delegate('.Enviar','click',evaluar);
			$foot.delegate('.Try','click',limpiar);

		$.getJSON( "json/"+settings.json, function( data ) {
			json_sl=data;	
		}).complete(cargarInicio);
   
		function cargarInicio(){
			$this.empty();
			$foot.empty();
			html="";
			$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
			html+="<div class='titulo'>"+json_sl.Presentacion.Titulo+"</div><br/>";
			html+="<div class='descrip'>"+json_sl.Enunciado[index]+"</div>";
			if (settings.aud) {
				html+="<div class='pistad btnaudio glyphicon glyphicon-volume-down' data-audio='audio/"+json_sl.Audios[index]+"'></div>";
				html+="<div class='well well-sm'>"+json_sl.Descripcion_Audio[index]+"</div>";
			};
			html+="<div class='contiene-opciones'>";
			$.each(json_sl.Actividad[index], function(index, value) {
				switch(settings.tipo){
					case "texto":
						html+="<div class='opciones' id="+index+">"+value+"</div>";
					break;
					case "audio":
						html+="<div class='btnaudio opciones' id="+index+" data-audio='"+value+"'>";
							html+="<h4 class='colort'>Option "+json_sl.Enunciado[index]+"</h4>"
							html+="<div class='glyphicon glyphicon-volume-down'></div>";
						html+="</div>";
					break;
				}
			});
			$foot.append("<div class='validadores'><div class='Enviar'><a href='#'>Send</a></div></div>");
			html+="<div class='contador'>"+(index+1)+"/"+json_sl.Actividad.length+"</div>";
			html+="</div>";
			$this.append(html);
			$('.Enviar', $mod).hide();
			console.log(json_sl);
		}
		function limpiar(){
			index=0,
			html="",
 			respuestaOpcion,
  			idACtivo,
  			respuestas=[],
  			correctas=0;
			cargarInicio();
		}
		function activar(){
			$('.Enviar',$mod).show();
			$(this).addClass('activo');
			idActivo=$(this).attr('id');
			$('.contiene-opciones div', $mod).each(function(index, element) {
	    		if ($(this).attr('id')!=idActivo)				
				$(this).removeClass('activo');
     		});
		}
	
		function evaluar(){
			if ((index+1)!=json_sl.Actividad.length) {	 
	    		respuestas[index]=idActivo;
			 	index+=1;
				cargarInicio();
			}
			else {
				respuestas[index]=idActivo;
				$this.empty();
				$foot.empty();
				html="";
				$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
				html+="<div class='titulo'>"+json_sl.Presentacion.Titulo+"</div>";
				$.each(respuestas, function(index,value){
					if (value==json_sl.Respuestas[index])
						correctas+=1;			
				});
				if (correctas >= settings.minq) {
					html+="<div class='descrip'>"+json_sl.Retroalimentacion.Bien+": "+correctas+" / "+json_sl.Actividad.length+"</div>";
					$foot.append("<div class='validadores'><div class='Try'><a href='#'>"+json_sl.Botones.repetir+"</a></div></div>");	
				}
				else {
					html+="<div class='descrip'>"+json_sl.Retroalimentacion.Mal+": "+correctas+" / "+json_sl.Actividad.length+"</div>";	
					$foot.append("<div class='validadores'><div class='Try'><a href='#'>"+json_sl.Botones.repetir+"</a></div></div>");	
					index=0;
					correctas=0;
					respuestas=[];
				}
				$this.append(html);
			}
		}
        
		function reproducir(pista)
		{
			var ruta = $(this).attr("data-audio");
			var vid = document.getElementById("audiointerno");	
			vid.src=ruta;
			vid.play();
		}
        return this;
    }
})(jQuery);
