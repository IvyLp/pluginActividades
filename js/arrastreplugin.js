(function ($)
{
	$.fn.arrastre = function(opci)
	{
		var $this=$(this);
		var $mod = $this.parents(".modal");
		var html_ar;
		var json_ar;
		var puntos_ar;
		var item_ar;

		var construct = $.extend({
			json:null,
			tipo:null
		},opci);

		main.call(this);
		function main()
		{
			$.getJSON("json/"+construct.json+"",function(data){json_ar = data;}).complete(inicializar);
			$mod.on("click",".Limpiar_ar, .Try_ar",inicializar);
			$mod.on("click",".arrast",calificar);
			$mod.on("click",".btn-audio",reproducir);
		}
		function inicializar()
		{	

			$this.empty();
			$this.parents().siblings(".modal-footer").empty();
			puntos_ar=0;
			itemd_ar=0;
			html_ar="";

			html_ar+="<div class='titulo'>"+json_ar.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
			html_ar+="<div class='descrip'>"+json_ar.Presentacion.Descripcion+"</div>";
			html_ar+="<div id='dropar'>";
				html_ar+="<table class='listaRar'>"
				for(var i=0;i<json_ar.Actividad.length;i++)
				{
					switch(construct.tipo){
						case "tct":
							html_ar+="<tr><td>"+json_ar.Enunciado[i].Item+"</td><td id='r"+i+"' class='itemCapturaar muestraDropar'>&nbsp;</td></tr>";
						break;
						case "ict":
							html_ar+="<tr><td><img src='"+json_ar.Enunciado[i].Item+"'/></td><td id='r"+i+"' class='itemCapturaar muestraDropar'>&nbsp;</td></tr>";
						break;
						case "tci":
							html_ar+="<tr><td>"+json_ar.Enunciado[i].Item+"</td><td id='r"+i+"' class='itemCapturaar muestraDropar itemCapturaar2'>&nbsp;</td></tr>";
						break;
						case "act":
							html_ar+="<tr><td><button type='button' class='btn btn-audio' data-audio='"+json_ar.Enunciado[i].Item+"'><span class='glyphicon glyphicon-volume-up'></span></button></td><td id='r"+i+"' class='itemCapturaar muestraDropar'>&nbsp;</td></tr>";
						break;
						case "aci":
							html_ar+="<tr><td><button type='button' class='btn btn-audio' data-audio='"+json_ar.Enunciado[i].Item+"'><span class='glyphicon glyphicon-volume-up'></span></button></td><td id='r"+i+"' class='itemCapturaar muestraDropar itemCapturaar2'>&nbsp;</td></tr>";
						break;
					}	
				}
				html_ar+="</table>";
			html_ar+="</div>";
			html_ar+="<div id='dragar'>";
				html_ar+="<ul class='listaPar'>";
					var aleatorio = desordenar(json_ar.Actividad);
					for(var i=0;i<json_ar.Actividad.length;i++)
					{	
						switch(construct.tipo){
							case "tct":
								html_ar+="<li id='a"+(aleatorio[i].Respuesta-1)+"' class='itemArrastraar'>"+aleatorio[i].Pregunta+"</li>";
							break;
							case "ict":
								html_ar+="<li id='a"+(aleatorio[i].Respuesta-1)+"' class='itemArrastraar'>"+aleatorio[i].Pregunta+"</li>";
							break;
							case "tci":
								html_ar+="<li id='a"+(aleatorio[i].Respuesta-1)+"' class='itemArrastraar lista-img'><img src='"+aleatorio[i].Pregunta+"'/></li>";
							break;
							case "act":
								html_ar+="<li id='a"+(aleatorio[i].Respuesta-1)+"' class='itemArrastraar'>"+aleatorio[i].Pregunta+"</li>";
							break;
							case "aci":
								html_ar+="<li id='a"+(aleatorio[i].Respuesta-1)+"' class='itemArrastraar lista-img'><img src='"+aleatorio[i].Pregunta+"'/></li>";
							break;
						}
					}
				html_ar+="</ul>";
			html_ar+="</div>";
			$this.parents().siblings(".modal-footer").append("<div class='validadores'><div class='Enviar arrast'><a href='#'>"+json_ar.Botones.enviar+"</a></div><div class='Limpiar Limpiar_ar'><a href='#'>"+json_ar.Botones.limpiar+"</a></div></div>");
			$($this,$mod).html(html_ar);
			$(".Enviar",$mod).hide();
			$(".itemArrastraar",$mod).draggable( {containment :$this, cursorAt: { right: 75 }, revert:"invalid",
				start:function(event, ui)
				{
					$(this).addClass("cambiaestiloar");
				},
				stop:function(event,ui)
				{
					$(this).removeClass("cambiaestiloar");
					
				}
			});
			$(".itemCapturaar",$mod).droppable({accept:".itemArrastraar",
				drop: function(event, ui)
				{
					recycleImage( ui.draggable, $(this));
					var drop = parseInt($(this).attr("id").substring(1,2));
					var drag = parseInt(ui.draggable.context.id.substring(1,2));	
					if(drop == drag)puntos_ar++;
					$("#a"+drag,$mod).addClass("cambiaestiloar");
					$(this).removeClass("muestraDropar");
					$(ui.draggable,$mod).draggable("disable");
					$("#r"+drop,$mod).droppable("disable");
					if(($("li, .listaPar",$mod).length-1) == 1) $(".Enviar",$mod).fadeIn();
				}
			});
		}

		function recycleImage( $item, $gallery ) {
			var cont = $item.html();
		    $($item,$mod).animate({
		      	'opacity': '0',
		      	'height': '0'},
		      	 300, function() {
		      	$item.remove();
		      	$gallery.fadeOut().html(cont).fadeIn();
		      });
		    }
		function calificar()
		{
			if(puntos_ar >= 6)
			{
				$this.parents().siblings(".modal-footer").empty();
				$($this,$mod).empty();
				html_ar=" ";
				html_ar+="<div class='titulo'>"+json_ar.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html_ar+="<div class='descrip'>"+json_ar.Retroalimentacion.Bien+"</div>";
				html_ar+="<div class='puntajear'>"+puntos_ar +"/"+json_ar.Actividad.length+"</div>";
				$this.parents().siblings(".modal-footer").append("<div class='validadores'><div class='Try Try_ar'><a href='#'>"+json_ar.Botones.repetir+"</a></div></div>");
				$($this,$mod).html(html_ar);
			}else
			{
				$this.parents().siblings(".modal-footer").empty();
				$($this,$mod).empty();
				html_ar=" ";
				html_ar+="<div class='titulo'>"+json_ar.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html_ar+="<div class='descrip'>"+json_ar.Retroalimentacion.Mal+"</div>";
				html_ar+="<div class='puntajear'>"+puntos_ar +"/"+json_ar.Actividad.length+"</div>";
				$this.parents().siblings(".modal-footer").append("<div class='validadores'><div class='Try Try_ar'><a href='#'>"+json_ar.Botones.repetir+"</a></div></div>");
				$($this,$mod).html(html_ar);
			}
			
		}

		function desordenar(lista)
		{
		    lista = lista.sort(function() {return Math.random() - 0.5});
		    return lista; 
		}

		function reproducir(pista)
		{
			var ruta = $(this).attr("data-audio");
			console.log(ruta);
			var vid = document.getElementById("audiointerno");	
			vid.src=ruta;
			vid.play();
		}

	}/*Fin Actividad*/

}(jQuery));