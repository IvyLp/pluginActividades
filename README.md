# PLUGIN ACTIVIDADES BOOTSTRAP

Es un plugin desarrollado en Jquery, Html5, Css3, Bootstrap con estructuras de Datos en JSON.

Aqui encuentran contempladas las siguientes Actividades:

* Ahorcado
* Concentrese
* Completar
* Falso Verdadero
* Drag and Drop
* Lista Desplegable
* Ordenar
* Seleccion Multiple

Configuracion

Html
```
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
```
Javascript

```
$("#Contenedor5").concentrese({
	json:"concentrese.json"
});
```

Json

Para editar los contenidos se deben crear estructuras JSON los ejemplos se encuentran en la carpeta /json.


