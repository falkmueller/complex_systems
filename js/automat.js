var automat = {
    translation: {},
    d: 1,
    status: [],
    wait: 250,
    border: "loop",
    run: false,
    generation: 0,
    
    grid: {
        cells: [],
        cell_values: [],
        cell_size_px: 0,
        grid_size_px: 0,
        grid_size_cells: 0
    },
    
    container_id: null,
    paper: null,
    
    standard: {
        grid: {
            col_count: 30, 
            row_count: 30, 
            cells: [
                [1,0,1],
                [1,1,1],
                [1,0,1]
                ]
        },
        automat: {
            status: [
                {color: "#AAD562"}
            ],
            d: 2,
            translation: "automat_copy"
        }
    },
    
    init: function(container_id){
        automat.container_id = container_id;
        automat.grid.grid_size_px = $("#div_paint").innerWidth();
        automat.load_automat(automat.standard.automat)
        automat.load_grid(automat.standard.grid);
        
        $("#div_paint svg").click(automat.set_cell);
    },
    
    /**
     * Fängt click event auf Zeichenfläsche ab und ändert angeklickte Zelle
     * @param {type} e
     * @returns {undefined}
     */
    set_cell: function(e){
        var elm = $(this);
        var xPos = e.pageX - elm.offset().left;
        var yPos = e.pageY - elm.offset().top;

        var i_row = Math.floor(yPos / automat.grid.cell_size_px);
        var i_col = Math.floor(xPos / automat.grid.cell_size_px);
        
        var value = (automat.grid.cell_values[i_row][i_col] + 1) % (automat.status.length + 1);
        if(value > 0){
            automat.grid.cells[i_row][i_col].attr("fill", automat.status[value - 1].color);
            automat.grid.cells[i_row][i_col].attr("stroke", automat.status[value - 1].color);
        } else {
            automat.grid.cells[i_row][i_col].attr("fill", "#fff");
            automat.grid.cells[i_row][i_col].attr("stroke", "#ccc");
        }               
        automat.grid.cell_values[i_row][i_col] = value; 
        
    },
    
    set_border: function(type){
        automat.border = type;
    },
    
    set_speed: function(wait){
        automat.wait = wait;
    },
    
    start_stop: function(){
        if(automat.run){
            automat.run = false;
        }
        else {
            $.publish("automat.start", []);
            automat.run = true;
            setTimeout(automat.loop, 10);
        }
    },
    
    loop: function(){
        if(!automat.run){
            $.publish("automat.stop", []);
            return;
        }
        
        if(automat.d == 1){
            automat._step_d1();
        } else {
            automat._step_d2();
        }
        
        setTimeout(automat.loop, automat.wait);
    },
    
    single_step: function(){
        $.publish("automat.start", []);
        
        setTimeout(function(){
            if(automat.d == 1){
                automat._step_d1();
            } else {
                automat._step_d2();
            }
            
            $.publish("automat.stop", []);
        }, 10);
        
    },
    
    _step_d1: function(){
        var cells = [];
        var population = 0;
        
        for (i_row = 0; i_row < automat.grid.cell_values.length; i_row++) {
            cells[i_row] = [];
            
            for (i_col = 0; i_col <  automat.grid.cell_values[i_row].length; i_col++) {
                var i_col_bevore = i_col - 1;
                var i_col_after = i_col + 1;
                
                if (i_col_bevore < 0){
                    if(automat.border == "loop"){
                        i_col_bevore = automat.grid.cell_values[i_row].length - 1;
                    } else {
                        i_col_bevore = -1;
                    }
                }

                if (i_col_after >= automat.grid.cell_values[i_row].length){
                    if(automat.border == "loop"){
                        i_col_after = 0;
                    } else {
                        i_col_after = -1;
                    }
                }
                
                var signatur = "";
                var value = automat.grid.cell_values[i_row][i_col];
                
                //aktuelle zeile
                if(i_col_bevore < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row][i_col_bevore]}
                signatur += value;
                if(i_col_after < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row][i_col_after]}
                
                
                if(automat.translation[signatur] !== null){
                    value = automat.translation[signatur];
                }
                
                if(value){population++;}
                
                cells[i_row][i_col] = value;
            }
        }
        
        automat._draw_cells(cells);
        
        automat.generation++;
        $.publish("automat.step", [automat.generation, population]);
    },
    
    _step_d2: function(){
        var cells = [];
        var population = 0;
        
        for (i_row = 0; i_row < automat.grid.cell_values.length; i_row++) {
            cells[i_row] = [];
            var i_row_bevore = i_row - 1;
            var i_row_after = i_row + 1;
            if (i_row_bevore < 0){
                if(automat.border == "loop"){
                    i_row_bevore = automat.grid.cell_values.length - 1;
                } else {
                    i_row_bevore = -1;
                }
            }
            
            if (i_row_after >= automat.grid.cell_values.length){
                if(automat.border == "loop"){
                    i_row_after = 0;
                } else {
                    i_row_after = -1;
                }
            }
            
            for (i_col = 0; i_col <  automat.grid.cell_values[i_row].length; i_col++) {
                var i_col_bevore = i_col - 1;
                var i_col_after = i_col + 1;
                
                if (i_col_bevore < 0){
                    if(automat.border == "loop"){
                        i_col_bevore = automat.grid.cell_values[i_row].length - 1;
                    } else {
                        i_col_bevore = -1;
                    }
                }

                if (i_col_after >= automat.grid.cell_values[i_row].length){
                    if(automat.border == "loop"){
                        i_col_after = 0;
                    } else {
                        i_col_after = -1;
                    }
                }
                
                var signatur = "";
                var value = automat.grid.cell_values[i_row][i_col];
                
                //zeile davor
                if(i_row_bevore < 0){
                    signatur += "000";
                } else {
                    if(i_col_bevore < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row_bevore][i_col_bevore]}
                    signatur += automat.grid.cell_values[i_row_bevore][i_col];
                    if(i_col_after < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row_bevore][i_col_after]}
                }
                
                //aktuelle zeile
                if(i_col_bevore < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row][i_col_bevore]}
                signatur += value;
                if(i_col_after < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row][i_col_after]}
                
                //zeile danach
                if(i_row_after < 0){
                    signatur += "000";
                } else {
                    if(i_col_bevore < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row_after][i_col_bevore]}
                    signatur += automat.grid.cell_values[i_row_after][i_col];
                    if(i_col_after < 0) {signatur += 0;} else {signatur += automat.grid.cell_values[i_row_after][i_col_after]}
                }
                
                if(typeof automat.translation === "string"){
                    value = window[automat.translation].apply(this, [signatur]);
                }
                else if(automat.translation[signatur] !== null){
                    value = automat.translation[signatur];
                }
                
                if(value){population++;}
                
                cells[i_row][i_col] = value;
            }
        }
        
        automat._draw_cells(cells);
        
        automat.generation++;
        $.publish("automat.step", [automat.generation, population]);
    },
    
    zoom: function(diff){
        automat.load_grid({
            col_count: automat.grid.grid_size_cells + diff,
            row_count: automat.grid.grid_size_cells + diff,
            cells: automat.grid.cell_values
        });
    },
    
    load_automat: function(conf){
        automat.status = conf.status;
        automat.translation = conf.translation;
        automat.generation = 0;
        automat.d = conf.d;
        
        if(conf.file){
            load_script("data/" + conf.file);
        }
        
        $.publish("automat.status", [conf.status]);
    },
    
    load_grid: function(grid){
        automat.grid.grid_size_cells = Math.max(grid.col_count, grid.row_count);
        automat.grid.cell_size_px = Math.floor(automat.grid.grid_size_px / automat.grid.grid_size_cells);
        if(automat.grid.cell_size_px > 40){
            automat.grid.cell_size_px = 40;
            automat.grid.grid_size_cells = Math.floor(automat.grid.grid_size_px / automat.grid.cell_size_px);
        }
        
        if(automat.paper){
            automat.paper.clear();
        } else {
            automat.paper = Raphael(automat.container_id, automat.grid.grid_size_px , automat.grid.grid_size_px);
        }
        
        automat.grid.cells = [];
        automat.grid.cell_values = [];
        
        var set = automat.paper.set();

        var radius = Math.floor(automat.grid.cell_size_px / 2);
        for (i_row = 0; i_row < automat.grid.grid_size_cells; i_row++) {
            automat.grid.cells[i_row] = [];
            automat.grid.cell_values[i_row] = [];
            
            for (i_col = 0; i_col < automat.grid.grid_size_cells; i_col++) {
                var circle = automat.paper.circle(i_col * automat.grid.cell_size_px, i_row * automat.grid.cell_size_px, radius);
                circle.attr("fill", "#fff");
                circle.attr("stroke", "#ccc");
                set.push(circle);
                
                automat.grid.cells[i_row][i_col] = circle;
                automat.grid.cell_values[i_row][i_col] = 0;
            }
        }

       set.translate(automat.grid.cell_size_px/2 + 1, automat.grid.cell_size_px/2 + 1);
        
       grid.cells = automat._center_cells(automat.grid.grid_size_cells,grid.cells);
       automat._draw_cells(grid.cells);
    },
    
    _center_cells: function(size, cells){
        
         if (cells.length < size){
            //höhe vergrößern
            while(cells.length < size){
                if (cells.length & 1) {
                    cells.unshift([0]);
                } else {
                    cells.push([0]);
                }
            }
        } else {
            //wenn zu hoch, verkleinern
            while(cells.length > size){
                if (cells.length & 1) {
                    cells.shift();
                } else {
                    cells.pop();
                }
            }
        }
        
        
        for(i = 0; i < cells.length; i++){
            //wenn zu breit
            while(cells[i].length > size){
                if (cells[i].length & 1) {
                    cells[i].shift();
                } else {
                    cells[i].pop();
                }
            }
            
            //wenn zu schmal
            while(cells[i].length < size){
                if (cells[i].length & 1) {
                    cells[i].unshift(0);
                } else {
                    cells[i].push(0);
                }
            }
        }

        return cells;
    },
    
    _draw_cells: function(cells){
        $.each(cells, function(i_row, row){
            $.each(row, function(i_col, value){
                if(value != automat.grid.cell_values[i_row][i_col]){
                    if(value > 0 && automat.status.length >= value){
                        automat.grid.cell_values[i_row][i_col] = value;
                        automat.grid.cells[i_row][i_col].attr("fill", automat.status[value - 1].color);
                        automat.grid.cells[i_row][i_col].attr("stroke", automat.status[value - 1].color);
                    } else {
                        automat.grid.cell_values[i_row][i_col] = 0;
                        automat.grid.cells[i_row][i_col].attr("fill", "#fff");
                        automat.grid.cells[i_row][i_col].attr("stroke", "#ccc");
                    }
                }
            });
        });
    },
}

function automat_copy(signature){
    
    var livings = 0;
    for(i = 0; i < signature.length; i++){
        if(signature[i] == "1" && i != 4){
            livings++;
        }
    }
    
    if(livings % 2 == 0){
        return 0;
    }
    
    return 1;
}