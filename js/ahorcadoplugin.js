(function ($){
	$.fn.actividad = function(opc)
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
			pista:null
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
		    		console.log(intentos);
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
			if(paginador !== json_a.Actividad.length){
				html+="<div class='titulo'>"+json_a.Presentacion.Titulo+"</div>"+"<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html+="<div class='descrip'>"+json_a.Retroalimentacion.Mal+"<br><br>"+paginador+"/"+json_a.Actividad.length+"</div>";
			}else
			{
				html+="<div class='titulo'>"+json_a.Presentacion.Titulo+"</div>"+"<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
				html+="<div class='descrip'>"+json_a.Retroalimentacion.Bien+"<br><br>"+paginador+"/"+json_a.Actividad.length+"</div>";
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
	}/*Fin actividad*/
}(jQuery));