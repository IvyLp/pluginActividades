PLUGIN ACTIVIDADES BOOTSTRAP

Es un plugin desarrollado en Jquery, Html5, Css3, Bootstrap con estructuras de Datos en archivos JSON.

Aqui encuentran contempladas las siguientes Actividades:

*Ahorcado
*Concentrese
*Completar
*Falso Verdadero
*Drag and Drop
*Lista Desplegable
*Ordenar
*Seleccion Multiple

Configuracion

//------------------------------------------------------------------------------------------------------
HTML

  		<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#act5">Concentrese<span class="glyphicon glyphicon-chevron-right"></span></button>          
	      <!-- Modal -->
	    <div class="modal fade" id="act5" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	      <div class="modal-dialog">
	        <div class="modal-content">
	          <div class="modal-body">
	            <div id="Contenedor5">
	            
	            </div>
	          </div>
	          <div class="modal-footer">
	        
	          </div>
	        </div>
	      </div>
	    </div>
//------------------------------------------------------------------------------------------------------
JS

$("#Contenedor5").concentrese({
	json:"concentrese.json"
});

//------------------------------------------------------------------------------------------------------
JSON

Para editar los contenidos se deben crear estructuras JSON los ejemplos se encuentran en la carpeta /json.


{
  "Presentacion":
  {
    "Titulo":"indica el titulo de la actividad",
    "Descripcion":"indica la descripcion de la actividad"
  },
  "Actividad":
  [
    {
      "indice":"1",
      "img":"img/act4/01.jpg"
    },
    {
      "indice":"2",
      "img":"img/act4/02.jpg"
    },
    {
      "indice":"3",
      "img":"img/act4/03.jpg"
    },
    {
      "indice":"4",
      "img":"img/act4/04.jpg"
    },
    {
      "indice":"5",
      "img":"img/act4/05.jpg"
    },
	{
      "indice":"1",
      "img":"img/act4/01.jpg"
    },
    {
      "indice":"2",
      "img":"img/act4/02.jpg"
    },
    {
      "indice":"3",
      "img":"img/act4/03.jpg"
    },
    {
      "indice":"4",
      "img":"img/act4/04.jpg"
    },
    {
      "indice":"5",
      "img":"img/act4/05.jpg"
    }
  ],
  "Retroalimentacion":
  {
    "Bien":"Felicitaciones",
    "Mal":"Intenalo Nuevamente"
  },
 "Botones":
 {
    "limpiar":"Clear",
    "enviar":"Send",
    "siguiente":"Next",
    "repetir":"Retry"
 }
}

