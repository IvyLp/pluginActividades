(function($){
    $.fn.ListaDesplegable = function(options) 
    {

      	var $this = $(this);
      	var $mod = $this.parents('.modal');
      	var $foot = $mod.find('.modal-footer');
      	var resp;
		var	count;
		var	nq;
      	var json_d;

     	var settings = $.extend({
      	 	json:null,
       		tp:null,
        	minq : 0
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
	
			if (count >= settings.minq) {
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
		}
        return this;
    }
})(jQuery);



