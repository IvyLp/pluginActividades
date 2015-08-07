(function ($){
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
	}//Fin Plugin 
}(jQuery));