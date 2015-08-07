(function($){
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
	}

})(jQuery);