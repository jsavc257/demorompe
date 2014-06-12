// JavaScript Document
	$(function() {
			
            var tileSize,   // tamaño de la cuadricula en pixels.
                numTiles,   // numero de cuadros, por ejemplo, 4 = 4 por 4 de cuadrícula. 
                tilesArray, // arreglo de cuadros o tiles.
                emptyGx,    //posición X del espacio vacio de los cuadros o tiles.
                emptyGy,    // posición Y del espacio vacio de los cuadros o tiles.
                imageUrl;   // Url de la imagen.
            
            var phoneObject = function() {
                var	ready = false;
                document.addEventListener("deviceready", function(){
                    ready = true;					
                }, false);
                return {
                    beep: function(n) {
                        if(ready) {
                            navigator.notification.beep(n);
                        }
                    },
                    vibrate: function(n) {
                        if(ready) {
                            navigator.notification.vibrate(n);
                        }
                    }
                }
            }();
            
            // tileObj variable para representar un solo cuadro o tile en el rompecabezas.
            // gx y gy son la posición en la cuadricula de x,y de los cuadros o tiles.
            var tileObj = function (gx, gy) {
                // solvedGx y solvedGy son las coordenadas en la cuadricula
                // se ocupan para determinar cuando este resuelto el rompecabezas
                var solvedGx = gx,
                    solvedGy = gy,
                    // izquierda y de arriba representan las posiciones de pixel css equivalentes.
                    left = gx * tileSize,
                    top = gy * tileSize,
                    $tile = $("<div class='tile'></div>"),

                    that = {
                        $element: $tile,
                        gx: gx,
                        gy: gy,
                        
                     	// El método move () hace un movimiento de un cuadro o tile  a una nueva posición en la cuadricula
						//del rompecabezas
                        //el uso de animación es opcional
                        move: function (ngx, ngy, animate) {
                            that.gx = ngx;
                            that.gy = ngy;
                            tilesArray[ngy][ngx] = that;
                            if (animate) {
                                $tile.animate({
                                    left: ngx * tileSize,
                                    top: ngy * tileSize
                                }, 250);
                            } else {
                                $tile.css({
                                    left: ngx * tileSize,
                                    top: ngy * tileSize
                                });
                            }
                        },
                     	// El método checkSolved () devuelve true (verdadero) si el cuadro o tile
                        // está en la posición correcta o que esta "resuelto".
                        checkSolved: function () {
                            if (that.gx !== solvedGx || that.gy !== solvedGy) {
                                return false;
                            }
                            return true;
                        }
                    };
                // Configurar las propiedades CSS del elemento de los cuadros o tiles
                $tile.css({
                    left: gx * tileSize + 'px',
                    top: gy * tileSize + 'px',
                    width: tileSize - 2 + 'px',
                    height: tileSize - 2 + 'px',
                    backgroundPosition: -left + 'px ' + -top + 'px',
                    backgroundImage: 'url(' + imageUrl + ')'
                });
                // Almacenar una referencia a la instancia tileObj
				//en el elemento de cuadros o tiles jQuery DOM
                $tile.data('tileObj', that);
                // Return a reference to the tile object.
				//Devuelve una referencia al objeto de cuadrado o tile.
                return that;
            };
            
			// la variable checkSolved () hace un recorrido entre todas los cuadros o tiles de objetos
			//y comprueba si todos los cuadros o tiles estan correctos en el rompecabezas.
            var checkSolved = function () {
                var gy, gx;
                for (gy = 0; gy < numTiles; gy++) {
                    for (gx = 0; gx < numTiles; gx++) {
                        if (!tilesArray[gy][gx].checkSolved()) {
                            return false;
                        }
                    }
                }
                return true;
            };

			// Cuando en un cuadro o tile se hace clic la función moveTiles 
	        //se mueve uno o más cuadros (tiles) en el espacio vacío. Esto se puede hacer
            // con o sin la animación
            var moveTiles = function (tile, animate) {
                var clickPos, x, y, dir, t;
				// Si el espacio vacío es el mismo en el nivel vertical como en el cuadro o tile cuando se hace clic
				// mueve el cuadro o cuadros (tiles)horizontalmente
                if (tile.gy === emptyGy) {
                    clickPos = tile.gx;
                    dir = tile.gx < emptyGx ? 1 : -1;
                    for (x = emptyGx - dir; x !== clickPos - dir; x -= dir) {
                        t = tilesArray[tile.gy][x];
                        t.move(x + dir, tile.gy, animate);
                    }
					// actualiza la posición del cuadro vacio o tile
                    emptyGx = clickPos;
                }
				// Si el espacio vacío está en el mismo nivel horizontal como en el cuadro o tile cuando se hace clic,
                // mueve el cuadro o cuadros (tiles)verticalmente
                if (tile.gx === emptyGx) {
                    clickPos = tile.gy;
                    dir = tile.gy < emptyGy ? 1 : -1;
                    for (y = emptyGy - dir; y !== clickPos - dir; y -= dir) {
                        t = tilesArray[y][tile.gx];
                        t.move(tile.gx, y + dir, animate);
                    }
                    // actualiza la posición del cuadro vacio o tile
                    emptyGy = clickPos;
                }
            };
			
			
     		// Barajea aleatoriamente los cuadros o tiles, asegurándose de que el rompecabezas
			// tiene solución. la función moveTiles () es llamado sin animación.
            var shuffle = function () {
                var randIndex = Math.floor(Math.random() * (numTiles - 1));
                if (Math.floor(Math.random() * 2)) {
                    moveTiles(tilesArray[emptyGx][(emptyGy + 1 + randIndex) % numTiles], false);
                } else {
                    moveTiles(tilesArray[(emptyGx + 1 + randIndex) % numTiles][emptyGy], false);
                }
            };
	
            // inicializa setup. borra el marco de los cuadros o tiles anteriores
            // crea nuevos cuadros o tiles y los revuelve
            var setup = function () {
                var x, y, i;
                imageUrl = $("input[name='pic-choice']:checked").val();
                // crea una imagen en marca de agua "guía" para hacer el rompecabezas
                // para hacerlo un poco mas facil.
                $('#pic-guide').css({
                    opacity: 0.2,
                    backgroundImage: 'url(' + imageUrl + ')'
                });
				// Prepara la imagen completa para "resolver".
                $('#well-done-image').attr("src", imageUrl);
                // quita todos los cuadros o tiles antiguos.
                $('.tile', $('#pic-frame')).remove();
                // crea nuevos cuadros o tiles
                numTiles = $('#difficulty').val();
                tileSize = Math.ceil(280 / numTiles);
                emptyGx = emptyGy = numTiles - 1;
                tilesArray = [];
                for (y = 0; y < numTiles; y++) {
                    tilesArray[y] = [];
                    for (x = 0; x < numTiles; x++) {
                        if (x === numTiles - 1 && y === numTiles - 1) {
                            break;
                        }
                        var tile = tileObj(x, y);
                        tilesArray[y][x] = tile;
                        $('#pic-frame').append(tile.$element);
                    }
                }
                // revuelve (shuffle) los nuevos cuadros o tiles.
                for (i = 0; i < 100; i++) {
                    shuffle();
                }
            };
			
            var bindEvents = function () {
                // trampa del efecto 'tap' para el marco de la imagen
                $('#pic-frame').bind('tap',function(evt) {            
                    var $targ = $(evt.target);
                    // se ha capturado un cuadro o tile
                    if (!$targ.hasClass('tile')) return;
                    // Si una ficha ha sido girada luego mover las fichas correspondientes
                    moveTiles($targ.data('tileObj'),true);                    
                    // Comprueba que el rompecabezas ha sido resuelto
                    if (checkSolved()) {
                    	// Si rompecabezas ha sido resuelto, emitir sonido y vibración.
                    	phoneObject.beep(1);
                    	phoneObject.vibrate(500);
                    	// Mensaje de bien hecho.
                        $.mobile.changePage("#well-done","pop");
                    }
                });
                
                $('#play-button').bind('click',setup);
            };
            bindEvents();
            setup();

		});
