(function($){
    $.fn.FalsoVerdadero = function(options) {
        var defaults = {
            json_fv: ' ',
            min : '0'
          },
          settings = $.extend({}, defaults, options),
          $this = $(this),
          $mod = $this.parents('.modal'),
          $foot = $mod.find('.modal-footer');

		var html="",
			correctas=0,
			resp = [],
			respU = [];

		$.getJSON( "json/"+settings.json_fv, function( data ) {
			json_fv=data;	
		}).complete(iniciar);

		$mod.on("click",".falso, .verdadero",validar);
		$foot.on("click",'.send_fv', resultados);
		$foot.on("click",'.Try',recarga);

		function iniciar() {
			html+="<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>";

			html+="<div class='titulo'>"+json_fv.Presentacion.Titulo+"</div>";
			html+="<div class='descrip'>"+json_fv.Presentacion.Descripcion+"</div>";

			for(var i=0;i<json_fv.Actividad.length;i++) {
				resp[i]=json_fv.Actividad[i].Respuesta;
				html+="<div id='pregunta"+i+"' class='pregunta'>"+json_fv.Actividad[i].Pregunta+"</div>";
				html+="<div class='cont'><div id='btn"+i+"'><div class='falso'>Falso</div><div class='verdadero'>Verdadero</div></div></div>";
			}
			$('#act12 .modal-footer').append("<div class='validadores'><div class='Enviar send_fv'><a href='#'>"+json_fv.Botones.enviar+"</a></div></div>");
			$(".Enviar",$mod).hide();
			$this.html(html);
		}	

		function validar() {
	
			if($(this).hasClass('falso')) {
				var atributo = $(this).parent().attr("id");
				var posicion = parseInt(atributo.substring(3,5));
				respU[posicion] = false;
				$(this).addClass('select').siblings().removeClass('select');

			}  else {
				var atributo = $(this).parent().attr("id");
				var posicion = parseInt(atributo.substring(3,5));
				respU[posicion] = true;
				$(this).addClass('select').siblings().removeClass('select');
				
			}

			if(respU.length == json_fv.Actividad.length)$(".Enviar",$mod).fadeIn();
		}

		function resultados() {
	
			for(var i=0;i<resp.length;i++) {
				if(respU[i] == resp[i])correctas++;
			}
			$this.empty();
			$foot.empty();
			html=" ";
			$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
			$this.append("<div class='titulo'>"+json_fv.Presentacion.Titulo+"</div>");
			if(correctas<=resp.length*.6) 	{
				$this.append("<div class='descrip'>"+json_fv.Retroalimentacion.Mal+"</div>");
				$foot.append("<div class='validadores'><div class='Try'><a href='#'>"+json_fv.Botones.repetir+"</a></div></div>");
				$('.send_fv', $foot).hide();		
			}	
			else {
				$this.append("<div class='descrip'>"+json_fv.Retroalimentacion.Bien+"</div>");
				$foot.append("<div class='validadores'><div class='Try'><a href='#'>"+json_fv.Botones.repetir+"</a></div></div>");
				$('.send_fv', $foot).hide();
			}
			return correctas=0;
		}

		function recarga() {
		
			correctas=0;
			respU=[];
			$this.empty();
			$foot.empty();
			html=" ";
			$('.select', $this).removeClass('select');
			$this.append("<div class='validadores'><div class='Enviar send_fv'><a href='#'>Send</a></div></div>");
			$('.Try, .descrip', $this).hide();
			iniciar();
		}
		return this;
    }
})(jQuery);