app.views.automat = app.view.$extend({
         
         events: [
             ["change", "#sel_automat", "select_automat"],
             ["change", "#sel_grid", "load_grid"],
             ["click", "#bt_zoom_in", "zoom_in"],
             ["click", "#bt_zoom_out", "zoom_out"],
             ["click", "#bt_start_stop", "start_stop"],
             ["click", "#bt_step", "single_step"],
             ["change", "#sel_speed", "set_speed"],
             ["change", "#sel_border", "set_border"],
             ["click", "#div_paint svg", "set_cell"]
         ],
        
        render: function(){
             
             
             var me = this;
             this.$el.load( "views/automat.html", function() {
                $("#div_paint", this.$el).html("");
                me.load_config();
                me.automat = new automatClass();
                
                me.automat.callbacks.start = function(){
                    $('#sel_automat').attr('disabled', true);
                    $('#sel_grid').attr('disabled', true);
                    $('#sel_speed').attr('disabled', true);
                    $('#sel_border').attr('disabled', true);
                    $('#bt_zoom_in').addClass("disabled");
                    $('#bt_zoom_out').addClass("disabled");
                    $('#bt_step').addClass("disabled");
                };
                me.automat.callbacks.stop = function(){
                    $('#sel_automat').attr('disabled', false);
                    $('#sel_grid').attr('disabled', false);
                    $('#sel_speed').attr('disabled', false);
                    $('#sel_border').attr('disabled', false);
                    $('#bt_zoom_in').removeClass("disabled");
                    $('#bt_zoom_out').removeClass("disabled");
                    $('#bt_step').removeClass("disabled");
                };
                me.automat.callbacks.step = function(generation, population){
                    $("#txt_population").text(population);
                    $("#txt_generation").text(generation);
                };
                me.automat.callbacks.status = function(status){
                    $("#div_status").html("");
                    $("#div_status").append("<span style='background-color: #fff;' />");
                    $.each(status, function(key, status){
                        $("#div_status").append("<span style='background-color: " + status.color + ";' />");
                    });
                };

                me.automat.init("div_paint");
                
             });
            
         },
         
         set_cell: function(e){
             this.automat.set_cell(e);
         },
         
         single_step: function(){
             this.automat.single_step();
         },
         
         start_stop: function(){
             this.automat.start_stop();
         },
         
         zoom_in: function(){
             this.automat.zoom(-1);
         },
         
         zoom_out: function(){
             this.automat.zoom(1);
         },
         
         select_automat: function(){
            var name = $("#sel_automat").val();
            $("#sel_grid option[value!='']").remove();

            if(name){
                this.load_automat(this.config.automat[name].file);

                //Grids setzen        
                $.each(this.config.automat[name].grid, function(key, grid){
                    var opt = $("<option/>");
                    opt.text(grid.name);
                    opt.attr("value", grid.file);
                    $("#sel_grid").append(opt);
                });
            } else {
                this.load_automat("");
            }
        },
        
        load_automat: function(file){
            if(!file){
                this.automat.load_automat(this.automat.standard.automat);
                return;
            }
            
            var me = this;
            $.ajax({
                url: "data/" + file,
                dataType: 'json',
                success: function(resp){
                    me.automat.load_automat(resp);
                }
            });
        },
        
        load_config: function(){
            var me = this;
            $.ajax({
                url: "data/config.json",
                dataType: 'json',
                success: function(config){
                    me.config = config;

                    var sel_automat = $("#sel_automat");
                    $.each(me.config.automat, function(key, automat){
                        var opt = $("<option/>");
                        opt.text(automat.name);
                        opt.attr("value", key);
                        sel_automat.append(opt);
                    });
                }
            });
        },
        
         set_border: function(){
            this.automat.set_border($("#sel_border").val());  
        },

        set_speed: function(){
            this.automat.set_speed(parseInt($("#sel_speed").val()));  
        },

        load_grid: function(){
            var file = $("#sel_grid").val();
            if(!file){
                this.automat.load_grid(this.automat.standard.grid);
                return;
            }
            
            var me = this;
            $.ajax({
                url: "data/" + file,
                dataType: 'json',
                success: function(grid){
                    me.automat.load_grid(grid);
                }
            });
        },
     });

var automatClass = Class.$extend({
    translation: {},
    d: 1,
    status: [],
    wait: 250,
    border: "loop",
    run: false,
    generation: 0,
    
    callbacks: {
        start: function(){},
        stop: function(){},
        step: function(generation, population){},
        status: function(status){}
    },
    
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
        this.container_id = container_id;
        this.grid.grid_size_px = $('#' + this.container_id).innerWidth();
        this.load_automat(this.standard.automat)
        this.load_grid(this.standard.grid);
        this.callbacks.stop();
    },
    
    load_script: function(path){
        var id = path.replace(/[^A-Za-z0-9\s!?]/g,'');

        if (document.getElementById(id)) {
            return;
        }

        var js, fjs = document.getElementsByTagName('script')[0];
        js = document.createElement('script'); 
        js.id = id;
        js.async = true; 
        js.src = path; 
        fjs.parentNode.insertBefore(js, fjs);
    },
    
    /**
     * Fängt click event auf Zeichenfläsche ab und ändert angeklickte Zelle
     * @param {type} e
     * @returns {undefined}
     */
    set_cell: function(e){
        var elm = $("svg", '#' + this.container_id);
        var xPos = e.pageX - elm.offset().left;
        var yPos = e.pageY - elm.offset().top;

        var i_row = Math.floor(yPos / this.grid.cell_size_px);
        var i_col = Math.floor(xPos / this.grid.cell_size_px);
        
        var value = (this.grid.cell_values[i_row][i_col] + 1) % (this.status.length + 1);
        if(value > 0){
            this.grid.cells[i_row][i_col].attr("fill", this.status[value - 1].color);
            this.grid.cells[i_row][i_col].attr("stroke", this.status[value - 1].color);
        } else {
            this.grid.cells[i_row][i_col].attr("fill", "#fff");
            this.grid.cells[i_row][i_col].attr("stroke", "#ccc");
        }               
        this.grid.cell_values[i_row][i_col] = value; 
        
    },
    
    set_border: function(type){
        this.border = type;
    },
    
    set_speed: function(wait){
        this.wait = wait;
    },
    
    start_stop: function(){
        if(this.run){
            this.run = false;
        }
        else {
            this.callbacks.start();
            this.run = true;
            var me = this;
            
            setTimeout(function(){me.loop.apply(me)}, 10);
        }
    },
    
    loop: function(){
        if(!this.run){
            this.callbacks.stop();
            return;
        }
        
        if(this.d == 1){
            this._step_d1();
        } else {
            this._step_d2();
        }
        var me = this;
        setTimeout(function(){me.loop.apply(me)}, this.wait);
    },
    
    single_step: function(){
        this.callbacks.start();
        
        var me = this;
        setTimeout(function(){
            if(me.d == 1){
                me._step_d1();
            } else {
                me._step_d2();
            }
            
            me.callbacks.stop();
        }, 10);
        
    },
    
    _step_d1: function(){
        var cells = [];
        var population = 0;
        
        for (i_row = 0; i_row < this.grid.cell_values.length; i_row++) {
            cells[i_row] = [];
            
            for (i_col = 0; i_col <  this.grid.cell_values[i_row].length; i_col++) {
                var i_col_bevore = i_col - 1;
                var i_col_after = i_col + 1;
                
                if (i_col_bevore < 0){
                    if(this.border == "loop"){
                        i_col_bevore = this.grid.cell_values[i_row].length - 1;
                    } else {
                        i_col_bevore = -1;
                    }
                }

                if (i_col_after >= this.grid.cell_values[i_row].length){
                    if(this.border == "loop"){
                        i_col_after = 0;
                    } else {
                        i_col_after = -1;
                    }
                }
                
                var signatur = "";
                var value = this.grid.cell_values[i_row][i_col];
                
                //aktuelle zeile
                if(i_col_bevore < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row][i_col_bevore]}
                signatur += value;
                if(i_col_after < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row][i_col_after]}
                
                
                if(this.translation[signatur] !== null){
                    value = this.translation[signatur];
                }
                
                if(value){population++;}
                
                cells[i_row][i_col] = value;
            }
        }
        
        this._draw_cells(cells);
        
        this.generation++;
        this.callbacks.step(this.generation, population);
    },
    
    _step_d2: function(){
        var cells = [];
        var population = 0;
        
        for (i_row = 0; i_row < this.grid.cell_values.length; i_row++) {
            cells[i_row] = [];
            var i_row_bevore = i_row - 1;
            var i_row_after = i_row + 1;
            if (i_row_bevore < 0){
                if(this.border == "loop"){
                    i_row_bevore = this.grid.cell_values.length - 1;
                } else {
                    i_row_bevore = -1;
                }
            }
            
            if (i_row_after >= this.grid.cell_values.length){
                if(this.border == "loop"){
                    i_row_after = 0;
                } else {
                    i_row_after = -1;
                }
            }
            
            for (i_col = 0; i_col <  this.grid.cell_values[i_row].length; i_col++) {
                var i_col_bevore = i_col - 1;
                var i_col_after = i_col + 1;
                
                if (i_col_bevore < 0){
                    if(this.border == "loop"){
                        i_col_bevore = this.grid.cell_values[i_row].length - 1;
                    } else {
                        i_col_bevore = -1;
                    }
                }

                if (i_col_after >= this.grid.cell_values[i_row].length){
                    if(this.border == "loop"){
                        i_col_after = 0;
                    } else {
                        i_col_after = -1;
                    }
                }
                
                var signatur = "";
                var value = this.grid.cell_values[i_row][i_col];
                
                //zeile davor
                if(i_row_bevore < 0){
                    signatur += "000";
                } else {
                    if(i_col_bevore < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row_bevore][i_col_bevore]}
                    signatur += this.grid.cell_values[i_row_bevore][i_col];
                    if(i_col_after < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row_bevore][i_col_after]}
                }
                
                //aktuelle zeile
                if(i_col_bevore < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row][i_col_bevore]}
                signatur += value;
                if(i_col_after < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row][i_col_after]}
                
                //zeile danach
                if(i_row_after < 0){
                    signatur += "000";
                } else {
                    if(i_col_bevore < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row_after][i_col_bevore]}
                    signatur += this.grid.cell_values[i_row_after][i_col];
                    if(i_col_after < 0) {signatur += 0;} else {signatur += this.grid.cell_values[i_row_after][i_col_after]}
                }
                
                if(typeof this.translation === "string"){
                    value = window[this.translation].apply(this, [signatur]);
                }
                else if(this.translation[signatur] !== null){
                    value = this.translation[signatur];
                }
                
                if(value){population++;}
                
                cells[i_row][i_col] = value;
            }
        }
        
        this._draw_cells(cells);
        
        this.generation++;
        this.callbacks.step(this.generation, population);
    },
    
    zoom: function(diff){
        this.load_grid({
            col_count: this.grid.grid_size_cells + diff,
            row_count: this.grid.grid_size_cells + diff,
            cells: this.grid.cell_values
        });
    },
    
    load_automat: function(conf){
        this.status = conf.status;
        this.translation = conf.translation;
        this.generation = 0;
        this.d = conf.d;
        
        if(conf.file){
            this.load_script("data/" + conf.file);
        }
        
        this.callbacks.status(conf.status);
    },
    
    load_grid: function(grid){
        this.grid.grid_size_cells = Math.max(grid.col_count, grid.row_count);
        this.grid.cell_size_px = Math.floor(this.grid.grid_size_px / this.grid.grid_size_cells);
        if(this.grid.cell_size_px > 40){
            this.grid.cell_size_px = 40;
            this.grid.grid_size_cells = Math.floor(this.grid.grid_size_px / this.grid.cell_size_px);
        }
        
        if(this.paper){
            this.paper.clear();
        } else {
            this.paper = Raphael(this.container_id, this.grid.grid_size_px , this.grid.grid_size_px);
        }
        
        this.grid.cells = [];
        this.grid.cell_values = [];
        
        var set = this.paper.set();

        var radius = Math.floor(this.grid.cell_size_px / 2);
        for (i_row = 0; i_row < this.grid.grid_size_cells; i_row++) {
            this.grid.cells[i_row] = [];
            this.grid.cell_values[i_row] = [];
            
            for (i_col = 0; i_col < this.grid.grid_size_cells; i_col++) {
                var circle = this.paper.circle(i_col * this.grid.cell_size_px, i_row * this.grid.cell_size_px, radius);
                circle.attr("fill", "#fff");
                circle.attr("stroke", "#ccc");
                set.push(circle);
                
                this.grid.cells[i_row][i_col] = circle;
                this.grid.cell_values[i_row][i_col] = 0;
            }
        }

       set.translate(this.grid.cell_size_px/2 + 1, this.grid.cell_size_px/2 + 1);
        
       grid.cells = this._center_cells(this.grid.grid_size_cells,grid.cells);
       this._draw_cells(grid.cells);
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
        var me = this;
        $.each(cells, function(i_row, row){
            $.each(row, function(i_col, value){
                if(value != me.grid.cell_values[i_row][i_col]){
                    if(value > 0 && me.status.length >= value){
                        me.grid.cell_values[i_row][i_col] = value;
                        me.grid.cells[i_row][i_col].attr("fill", me.status[value - 1].color);
                        me.grid.cells[i_row][i_col].attr("stroke", me.status[value - 1].color);
                    } else {
                        me.grid.cell_values[i_row][i_col] = 0;
                        me.grid.cells[i_row][i_col].attr("fill", "#fff");
                        me.grid.cells[i_row][i_col].attr("stroke", "#ccc");
                    }
                }
            });
        });
    },
});

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