(function($){
	$.fn.ahorcado = function(opc)
	{

		var $this = $(this);
		var $mod = $this.parents(".modal");
		var html;
		var acomulado;
		var intentos;
		var alfabeto ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var indice;
		var paginador;
		var json_a;

		var construct = $.extend({
			json:null,
			pista:null,
			aprobado:null
		},opc);
		
		main.call($this);

		function main(){
			$.getJSON("json/"+construct.json+"",function(data){json_a=data}).complete(inicializar);
		
			$mod.on('click','.cap',validar);
			$mod.on('click','.Limpiar',inicializar);
			$mod.on('click','.Siguiente',siguiente);
			$mod.on('click','.Enviar',enviar);
			$mod.on('click','.btnaudio',reproducir);
			$mod.on('click','.Try',inicializar);	
		}
		function inicializar()
		{
			intentos=6;
			acomulado=0;
			indice=0;
			paginador=0;
			$this.empty();
			$this.parents().siblings(".modal-footer").empty();
			html="";
			html+="<div class='titulo'>"+json_a.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
			html+="<div class='descrip'>"+json_a.Presentacion.Descripcion+"</div>";
			html+="<div id='contenedorSlides'>";
				for(var i=0;i<json_a.Actividad.length;i++)
				{
					html+="<div class='ahorcados'>";
						html+="<div class='pista'>";
							switch(construct.pista)
							{
								case "Texto":
									html+="<div>"+json_a.Actividad[i].Pista+"</div>";
								break;
								case "Audio":
									html+="<img src='img/core-plugins/audifonos.png'  class='btnaudio' data-audio='"+json_a.Actividad[i].Pista+"'/>"; 
								break;
								case "Imagen":
									html+="<img src='"+json_a.Actividad[i].Pista+"'/>";
								break; 
							}
							
						html+="</div>";
						html+="<div class='imagenes'>";
							html+="<img src='img/core-plugins/fondoahorcado.png'>";
						html+="</div>";
						html+="<div class='contenedorpalabras'>";
							for(var k in json_a.Actividad[i].Palabra)
						    {
						          html+="<div class='palabra'>?</div>";
						    }
			    			html+="</div>";
						html+="<div class='contenedorletras'>";
					        for(var j in alfabeto)
					        {
					            html+="<div class='letras cap'>"+alfabeto[j]+"</div>";
					        } 
		    			html+="</div>";	
					  
						html+="<div class='contador paginar'>"+(paginador+1)+"/"+json_a.Actividad.length+"</div>";
					
					html+="</div>";
				}
			html+="</div>";
			$($this,$mod).html(html);
			$this.parents().siblings(".modal-footer").append("<div class='validadores'><div class='Limpiar'><a href'#'>"+json_a.Botones.limpiar+"</a></div><div class='Siguiente'><a href='#'>"+json_a.Botones.siguiente+"</a></div><div class='Enviar'><a href='#'>"+json_a.Botones.enviar+"</a></div></div><audio controls id='audiointerno' style='display:none;'></audio>");
			$("#contenedorSlides .ahorcados:first-child",$mod).addClass('act');
			$('.ahorcados',$mod).hide();
			$('.act',$mod).show();
			$('.Siguiente, .Enviar',$mod).hide();
		}

		
		function validar()
		{	
			
		
		    var casilla=0;  
		    var le =$(this).text();
		    $(this).removeClass("cap");
		   
		    for(var i=0;i<json_a.Actividad[indice].Palabra.length;i++)
		    {
		        if(le == json_a.Actividad[indice].Palabra[i])
		        {
		        
		        	var par = $(this).parents('.ahorcados').find('.contenedorpalabras');
		           	$(".palabra",par,$mod).eq(i).text(le);
		            casilla++;
		            acomulado++;
		        }
		    }
		   
		    if(casilla != 0)
		    {
		        $(this).addClass("marcada_bien");    
		        if(acomulado === json_a.Actividad[indice].Palabra.length)
		        {
		    		
		    		if(indice<(json_a.Actividad.length-1))
		    		{
		    			$('.Siguiente',$mod).show();
		        	}else{
		        		$('.Enviar',$mod).show();
		        	}
		        	$(this).parents(".contenedorletras").children().removeClass("cap");
		    		paginador++;
		    		acomulado=0;
		    		intentos=6;
		    		
		    	}
		    }
		    else
		    {
		        $(this).addClass("marcada_mal");
		        intentos--;
		        $(this).parents(".ahorcados").find(".imagenes").empty().append("<img class='sec_ima' src='img/core-plugins/"+intentos+".png'/>");;
		        if(intentos <= 0){
		        	if(indice<(json_a.Actividad.length-1))
		        	{
		        		$('.Siguiente',$mod).show();
		        	}else{
		        		$('.Enviar',$mod).show();
		        	}
		        	$(this).parents(".contenedorletras").children().removeClass("cap");
		    		acomulado=0;
		    		intentos=6;
		    	}
		    	console.log(intentos);
		    } 
		        
		}	

		function siguiente()
		{	
			indice++;
			$('.contador',$mod).text((indice+1)+"/"+json_a.Actividad.length);
			$(this).addClass('act').siblings().removeClass('act');
			$('.ahorcados',$mod).eq(indice).fadeIn().addClass('act').siblings().removeClass('act').fadeOut();
			$('.Siguiente',$mod).hide();
		}

		function enviar()
		{
			$('.Enviar',$mod).hide();
			$('.Limpiar',$mod).hide();
			$this.empty();
			$(".modal-footer",$mod).append("<div class='validadores'><div class='Try'><a href='#'>"+json_a.Botones.repetir+"</a></div></div>");
			html="";
			if(paginador >= construct.aprobado){
				html+="<div class='titulo'>"+json_a.Presentacion.Titulo+"</div>"+"<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html+="<div class='descrip'>"+json_a.Retroalimentacion.Bien+"<br><br>"+paginador+"/"+json_a.Actividad.length+"</div>";
			}else
			{
				html+="<div class='titulo'>"+json_a.Presentacion.Titulo+"</div>"+"<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html+="<div class='descrip'>"+json_a.Retroalimentacion.Mal+"<br><br>"+paginador+"/"+json_a.Actividad.length+"</div>";
			}
			$this.html(html);
		}

		function reproducir(pista)
		{
			var ruta = $(this).attr("data-audio");
			console.log(ruta);
			var vid = document.getElementById("audiointerno");	
			vid.src=ruta;
			vid.play();
		}
	}/*Fin Actividad Ahorcado*/
	/* --------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
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
			tipo:null,
			aprobado:null,
			tmodal:null,
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
			if(construct.tmodal == "lg")$this.parents(".modal-dialog").addClass("modal-lg");
			$this.empty();
			$this.parents().siblings(".modal-footer").empty();
			puntos_ar=0;
			itemd_ar=0;
			html_ar="";

			html_ar+="<div class='titulo'>"+json_ar.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
			html_ar+="<div class='descrip'>"+json_ar.Presentacion.Descripcion+"</div>";
			html_ar+="<div id='dropar'>";
				html_ar+="<table class='listaRar'>"
				if(construct.tmodal == "lg") var iEx = "itemCapturaarEx";  
				for(var i=0;i<json_ar.Actividad.length;i++)
				{
					switch(construct.tipo){
						case "tct":
							html_ar+="<tr><td>"+json_ar.Enunciado[i].Item+"</td><td id='r"+i+"' class='itemCapturaar muestraDropar "+iEx+"'>&nbsp;</td></tr>";
						break;
						case "ict":
							html_ar+="<tr><td><img src='"+json_ar.Enunciado[i].Item+"'/></td><td id='r"+i+"' class='itemCapturaar muestraDropar "+iEx+"'>&nbsp;</td></tr>";
						break;
						case "tci":
							html_ar+="<tr><td>"+json_ar.Enunciado[i].Item+"</td><td id='r"+i+"' class='itemCapturaar muestraDropar itemCapturaar2 "+iEx+"'>&nbsp;</td></tr>";
						break;
						case "act":
							html_ar+="<tr><td><button type='button' class='btn btn-audio' data-audio='"+json_ar.Enunciado[i].Item+"'><span class='glyphicon glyphicon-volume-up'></span></button></td><td id='r"+i+"' class='itemCapturaar muestraDropar "+iEx+"'>&nbsp;</td></tr>";
						break;
						case "aci":
							html_ar+="<tr><td><button type='button' class='btn btn-audio' data-audio='"+json_ar.Enunciado[i].Item+"'><span class='glyphicon glyphicon-volume-up'></span></button></td><td id='r"+i+"' class='itemCapturaar muestraDropar itemCapturaar2 "+iEx+"'>&nbsp;</td></tr>";
						break;
					}

				}
				html_ar+="</table>";
			html_ar+="</div>";
			if(construct.tmodal === "lg")
			{
				html_ar+="<div id='dragarEx'>";	
			}
			else
			{
				html_ar+="<div id='dragar'>";	
			}
				if(construct.tmodal == "lg")var tf = "12px";
				html_ar+="<ul class='listaPar' style='font-size:"+tf+";'>";
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
			$(".itemArrastraar",$mod).draggable( {containment :$this, revert:"invalid",
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
			if(puntos_ar >= construct.aprobado)
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

	} /* Fin Actividad Arrastre*/
	/* ---------------------------------------------------------------------------------------------------------------- */
	$.fn.concentrese = function(op)
	{
		var $this = $(this);
		var $mod = $this.parents(".modal");
		var html;
		var count=0;
		var opc=[];
		var json_a;
		
		var constructor =$.extend({
			json:null
		},op);
		
		main.call($this);
		
		function main()
		{
			$.getJSON("json/"+constructor.json+"",function(data){json_a=data;}).complete(inicializar);
			$mod.on('click','.front',animar);
			$mod.on("click",".Limpiar", inicializar);
		}

		function inicializar()
		{
			$this.empty();
			$this.parents().siblings(".modal-footer").empty();	
			html="";
			html+="<div class='titulo'>"+json_a.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
			html+="<div class='subtitulo descrip'>"+json_a.Presentacion.Descripcion+"</div>";
			$this.parents().siblings(".modal-footer").append("<div class='validadores'><div class='Limpiar'><a href='#'>"+json_a.Botones.limpiar +"</a></div></div>");

			var al = aleatorio(json_a.Actividad);
			
			html+="<ul class='colcon' >";
			for(var i=0; i<json_a.Actividad.length;i++)
			{
				html+="<li class='filcon'>";
					html+="<div class='card' data-info='"+al[i].indice+"'>";
						html+="<img class='comodin back' src='"+al[i].img+"'>";
						html+="<div class='front'><div>";
						
					html+="<div>";
				html+="</li>";	
			}
				
			html+="</ul>";
			$this.html(html); 		
		}

		function animar()
		{
			count++;
			console.log(count);
			
			
			$(this).closest(".card").addClass("animacion");	
			
			opc[count-1] = $(this).closest(".card").attr("data-info");
			console.log(opc);
			
			if(count === 2)
			{
				$mod.off('click','.front',animar);
				if(opc[0] != opc[1]){
					setTimeout(function(){
					console.log("diferente");
						
					
						$(".card[data-info|='"+opc[0]+"']",$mod).removeClass("animacion");
						$(".card[data-info|='"+opc[1]+"']",$mod).removeClass("animacion");
						count=0;
						opc=[];
					
					},1000);
				}
				else
				{
					count=0;
					opc=[];

				}

				setTimeout(function(){
					$mod.on('click','.front',animar);
				},1000);

			}	

		}

		function aleatorio(array)
		{	
			array = array.sort(function(){return Math.random() - 0.5});
			return array;
		}

		function reproducir(pista)
		{
			var ruta = $(this).attr("data-audio");
			console.log(ruta);
			var vid = document.getElementById("audiointerno");	
			vid.src=ruta;
			vid.play();
		}
	}// Fin Actividad Concentrese
	/* ---------------------------------------------------------------------------------------------------------------------- */
	$.fn.desplegableycompletar = function(options) 
    {

      	var $this = $(this);
      	var $mod = $this.parents('.modal');
      	var $foot = $mod.find('.modal-footer');
      	var resp;
		var	count;
		var	nq;
      	var json_d;
      	var paginador;

     	var settings = $.extend({
      	 	json:null,
       		tp:null,
        	aprobado : 0
      	},options);


		main.call($this);
        function main(){
			$.getJSON( "json/"+settings.json+"", function(data) {json_d=data;}).complete(iniciar);
			$mod.on('click','.dropdown-menu li',choice);
			$mod.on('click','.Enviar',validara);
			$mod.on('click','.Siguiente',cambiar);
			$mod.on('click','.Limpiar',iniciar);
			$mod.on('click','.Repetir',iniciar);
		}
		function iniciar() {
			$this.empty();
			$foot.empty();
			resp=[];
			count=0;
			nq = 0; 
			paginar=1;
			$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
			$this.append("<div class='titulo'>"+json_d.Presentacion.Titulo+"</div><div class='descrip'>"+json_d.Presentacion.Descripcion+"</div><div class='frases'></div>");
			for(var i=0;i<json_d.Actividad.length;i++) {
				nq++;
				$(".frases",$mod).append("<div class='frase'>"+json_d.Actividad[i].Frase+"</div>");
				for(var y=0;y<json_d.Actividad[i].Reemplazan.length;y++) {
					var quitar = json_d.Actividad[i].Reemplazan[y].Cambia,
						lista = json_d.Actividad[i].Reemplazan[y].Opciones,
						trues = json_d.Actividad[i].Reemplazan[y].Correcta;
						var listar;
						switch(settings.tp){
							case "despliega":
								listar = '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="txt">Selecciona</span><span class="caret"></span></button><ul class="dropdown-menu" role="menu"></ul></div>';
								$('.frase', $mod).eq(i).html($('.frase', $mod).eq(i).html().replace(quitar,listar));
								for(var x=0;x<lista.length;x++)
								{
									$('.frase', $mod).eq(i).find('.dropdown-menu').eq(y).append('<li>'+lista[x]+'</li>')
								}
							break;
							case "completa":
								listar ='<input class="btn-group form-control tm" type="text" placeholder="Text"/>';
								$('.frase', $mod).eq(i).html($('.frase', $mod).eq(i).html().replace(quitar,listar));
							
							break;
						}

					
					resp.push(trues);
				}
			}
			$this.append("<div class='contador'>"+paginar+"/"+json_d.Actividad.length+"</div>");
			$foot.append("<div class='validadores'><div class='Siguiente'><a href='#'>"+json_d.Botones.siguiente+"</a></div><div class='Enviar'><a href='#'>"+json_d.Botones.enviar+"</a></div><div class='Limpiar'><a href='#'>"+json_d.Botones.limpiar+"</a></div></div>");
			$('.frases div:first-child',$mod).addClass('act');
			$('.Enviar', $mod).hide();
		}
		function limpiara(){
			count = 0;
			$('.txt',$mod).text('Selecciona');
			('.txt',$mod).text('Selecciona');
			$('.Enviar',$mod).hide();
			$('.Siguiente',$mod).show();
			$('.frase.act',$mod).removeClass('act').fadeOut();
			$('.frases div:first-child').addClass('act');
		}
		function choice(){
			var value = $(this).text();
			$(this).closest('.btn-group').find('.dropdown-toggle .txt').text(value);
		}
		function validara() {
			$foot.empty();
			$('.btn-group',$this).each(function(indixe){
					
					switch(settings.tp)
					{
						case "despliega":
							//var par = $($(this),$mod).index('.btn-group');
							var titl = $(this).find('.dropdown-toggle .txt').html();
						break;
						case "completa":
							//var par = $($(this),$mod).index('.btn-group');
							var titl = $(this).val(); 
						break;
					}
					
					var r = resp[indixe];

				if (r.toLocaleUpperCase() === titl.toLocaleUpperCase()) count++;
			
	
			})
		
			$this.empty();
	
			if (count >= settings.aprobado) {
				$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
				$this.append("<div class='titulo'>"+json_d.Presentacion.Titulo+"</div><div class='descrip'>"+json_d.Retroalimentacion.Bien+"</div>");
				$foot.append("<div class='validadores'><div class='Repetir Try'><a href='#'>"+json_d.Botones.repetir+"</a></div></div>");
			} else {
				$this.append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only botonc'>Cerrar</span></button>");
				$this.append("<div class='titulo'>"+json_d.Presentacion.Titulo+"</div><div class='descrip'>"+json_d.Retroalimentacion.Mal+"</div>");
				$foot.append("<div class='validadores'><div class='Repetir Try'><a href='#'>"+json_d.Botones.repetir+"</a></div></div>");
			}
		}
		
		function cambiar() {
			var nu = $('.frase.act', $this).index();
			if (nu+1 == nq){
				$(this).hide();
				$('.Enviar',$mod).show();
			} else {
				$('.frase.act', $this,$mod).next().fadeIn().addClass('act').siblings().removeClass('act').fadeOut();
			}
			if(paginar!=json_d.Actividad.length){
			paginar++;
			$('.contador', $this).html(paginar+"/"+json_d.Actividad.length)
		}
		}
        return this;
    }/* Fin Actividad Desplegable y Completar*/
    /* ---------------------------------------------------------------------------------------------------------------------- */
    $.fn.falsoverdadero = function(options) {
        var defaults = {
            json_fv: ' ',
            aprobado : '0'
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
			if(correctas>=settings.aprobado) 	{
				$this.append("<div class='descrip'>"+json_fv.Retroalimentacion.Bien+"</div>");
				$foot.append("<div class='validadores'><div class='Try'><a href='#'>"+json_fv.Botones.repetir+"</a></div></div>");
				$('.send_fv', $foot).hide();		
			}	
			else {
				$this.append("<div class='descrip'>"+json_fv.Retroalimentacion.Mal+"</div>");
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
    }/*Fin Actividad Falso y Verdadero*/
    /* ---------------------------------------------------------------------------------------------------------------------- - */
    $.fn.seleccionmultiple = function(options) {
        
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
            aprobado : 0,
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
				if (correctas >= settings.aprobado) {
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
    }/* Fin Actividad Seleccion Multiple Unica Respuesta*/
    /* ------------------------------------------------------------------------------------------------------------------------------------------------- */
    $.fn.organizar = function(opciones)
	{
		var $this = $(this);
		var $mod = $this.parents(".modal");
		var $foot = $mod.find('.modal-footer');
		var html;
		var json_o;
		var correctas;

		var construct = $.extend({
			json:null,
			aprobado:null
		},opciones);	

		main.call($this);

		function main()
		{
			$.getJSON("json/"+construct.json+"",function(data){json_o=data}).complete(inicializar);
			$mod.on('click','.Enviar',enviar);
			$mod.on('click','.Try',inicializar);
		}
		function inicializar()
		{
			$this.empty();
			$foot.empty();
			html="";
			html+="<div class='titulo'>"+json_o.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
			html+="<div class='subtitulo descrip'>"+json_o.Presentacion.Descripcion+"</div>";
			html+="<ul id='sortable'>";
				var al= desordenar(json_o.Actividad);
				for(var i in json_o.Actividad)
				{
					html+="<li class='ui-state-default bg-info' data-or='"+al[i].Orden+"'>"+al[i].Frase+"</li>";
				}
			html+="</ul>";
			$this.html(html);
			$foot.append("<div class='validadores'><div class='Enviar'><a href='#'>"+json_o.Botones.enviar+"</a></div></div>");
			$( "#sortable",$mod).sortable({ 
			     placeholder: "ui-state-highlight" ,
			     containment: $this,
			     axis:"y"
		    }); 
		}

		function enviar()
		{
			correctas=0;
			$('.ui-state-default',$mod).each(function(indixe){
				var Y = $(this).attr("data-or");
				if(Y==(indixe+1))correctas++;
			});
			if(correctas >= json_o.Actividad.length)
			{
				$foot.empty();
				$this.empty();
				html=" ";
				html+="<div class='titulo'>"+json_o.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html+="<div class='descrip'>"+json_o.Retroalimentacion.Bien+"</div>";
				html+="<div class='puntajear'>"+correctas +"/"+json_o.Actividad.length+"</div>";
				$foot.append("<div class='validadores'><div class='Try Try_ar'><a href='#'>"+json_o.Botones.repetir+"</a></div></div>");
				$this.html(html);
			}else
			{
				$foot.empty();
				$this.empty();
				html=" ";
				html+="<div class='titulo'>"+json_o.Presentacion.Titulo+"</div><button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html+="<div class='descrip'>"+json_o.Retroalimentacion.Mal+"</div>";
				html+="<div class='puntajear'>"+correctas +"/"+json_o.Actividad.length+"</div>";
				$foot.append("<div class='validadores'><div class='Try Try_ar'><a href='#'>"+json_o.Botones.repetir+"</a></div></div>");
				$this.html(html);
			}
		}

		function desordenar(lista)
		{
		    lista = lista.sort(function() {return Math.random() - 0.5});
		    return lista; 
		}
	}/* Fin Actividad Organizar*/
    /* ------------------------------------------------------------------------------------------------------------------------------------------------- */
    
})(jQuery);