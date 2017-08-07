app.views.automatD2 = app.view.$extend({
    
    automat: null,
    generation: 0,
    
    events: [
             ["change", "#sel_automat", "selectAutomat"],
             ["change", "#sel_grid", "selectGrid"],
             ["click", "#bt_zoom_in", "zoomIn"],
             ["click", "#bt_zoom_out", "zoomOut"],
             ["click", "#bt_start_stop", "start_stop"],
             ["click", "#bt_step", "single_step"]
         ],
    
    render: function(){
             var me = this;
             this.grid.paper = null;
             
             this.$el.load( "views/automatD2.html", function() {
                 //load automats
                 Object.keys(app.automat.d2).forEach(function(aKey) {
                    if('active' in app.automat.d2[aKey] && !app.automat.d2[aKey].active) {return;}
                    var opt = $("<option/>");
                    opt.text(app.automat.d2[aKey].name);
                    opt.attr("value", aKey);
                    $("#sel_automat", me.$el).append(opt);
                 });
                 
                 //init automat
                 me.selectAutomat.apply(me);
             });
         },
         
    selectAutomat: function(){
        var automat_key =  $("#sel_automat", this.$el).val();
        console.log("select automat", automat_key);
        this.automat = app.automat.d2[automat_key];
        
        //load grids
        var me = this;
        $("#sel_grid option[value!='']", this.$el).remove();
        var selected_grid_key = "";
        Object.keys(this.automat.default_value).forEach(function(gKey) {
            var opt = $("<option/>");
            opt.text(me.automat.default_value[gKey].name);
            opt.attr("value", gKey);
            $("#sel_grid", this.$el).append(opt);
            if(selected_grid_key == ""){
                selected_grid_key = gKey;
            }
        });
        
        $("#sel_grid", this.$el).val(selected_grid_key);
        
        //init Grid
        this.selectGrid();
    },
    
    selectGrid: function(){
        var grid_key = $("#sel_grid", this.$el).val();
        
        var grid_config = {
            col_count: 30, 
            row_count: 30, 
            cells: []
        }
        
        if(grid_key != ""){
            grid_config = this.automat.default_value[grid_key];
        }
        
        //grid initialisieren
        this.generation = 0;
        this.grid.init(this.automat, "div_paint", grid_config.col_count, grid_config.row_count, grid_config.cells);
    },
    
    zoomIn: function(){
             this.grid.init(this.automat, "div_paint", this.grid.cells.length -2, this.grid.cells[0].length -2, this.grid.cell_values);
         },
         
    zoomOut: function(){
        this.grid.init(this.automat, "div_paint", this.grid.cells.length + 2, this.grid.cells[0].length + 2, this.grid.cell_values);
    },
    
    
    start_stop: function(){
        if(this.timeout){
            clearTimeout(this.timeout);
            this.timeout = null;
            $('#sel_automat').attr('disabled', false);
            $('#sel_grid').attr('disabled', false);
            $('#sel_speed').attr('disabled', false);
            $('#sel_border').attr('disabled', false);
            $('#bt_zoom_in').removeClass("disabled");
            $('#bt_zoom_out').removeClass("disabled");
            $('#bt_step').removeClass("disabled");
            return;
        }
        
        $('#sel_automat').attr('disabled', true);
        $('#sel_grid').attr('disabled', true);
        $('#sel_speed').attr('disabled', true);
        $('#sel_border').attr('disabled', true);
        $('#bt_zoom_in').addClass("disabled");
        $('#bt_zoom_out').addClass("disabled");
        $('#bt_step').addClass("disabled");
        
        var me = this;
        setTimeout(function(){me.step.apply(me,[true]);}, 10);
    },
    
    single_step: function(){
        var me = this;
        setTimeout(function(){me.step.apply(me,[false]);}, 10);
        
        
    },
    
    step: function(loop_step){
        loop_step = loop_step || false;
        this.generation++;
        var population = 0;
        var me = this;
        
        var loop_cells = $("#sel_border").val() == "loop";
        
        var new_cells = [];
        var size_x = this.grid.cell_values.length;
        var size_y = this.grid.cell_values[0].length;
        for (var i_row = 0; i_row < size_x; i_row++) {
                new_cells.push([]);
            
                for (var i_col = 0; i_col < size_y; i_col++) {
                    var value = this.automat.cell_step(this.grid.cell_values, {x: i_row, y: i_col}, loop_cells);
                    if (value > 0) {population++;}
                    new_cells[i_row].push(value);
                
                }
        }
        
        $("#txt_population").text(population);
        $("#txt_generation").text(this.generation);
        
        if(loop_step){
            if(this.timeout){
                clearTimeout(this.timeout);
            }
            
            this.timeout = setTimeout(function(){me.step.apply(me,[true]);}, parseInt($("#sel_speed").val()));
        }
        
        this.grid._draw_cells(new_cells);
    },
    
    grid: {
        
        cells: null,
        cell_values: null,
        paper: null,
        automat: null,
        
        toggleCell: function(i_row, i_col){
            var value = (this.cell_values[i_row][i_col] + 1) % 2;
            if(value > 0){
                this.cells[i_row][i_col].attr("fill", "#AAD562");
                this.cells[i_row][i_col].attr("stroke", "#AAD562");
            } else {
                this.cells[i_row][i_col].attr("fill", "#fff");
                this.cells[i_row][i_col].attr("stroke", "#ccc");
            }               
            this.cell_values[i_row][i_col] = value; 

        },
        
        init: function(automat, container_id, col_count, row_count, values){
            this.automat = automat;
            var me = this;
             var grid_size_px = $('#' + container_id).innerWidth();
             var grid_size_cells = Math.max(col_count, row_count);
             var cell_size_px = Math.floor(grid_size_px / grid_size_cells);
             
             if(cell_size_px > 36){
                cell_size_px = 36;
                grid_size_cells = Math.floor(grid_size_px / cell_size_px);
             }
             
             if(this.paper){
                this.paper.clear();
            } else {
                $('#' + container_id).html("");
                this.paper = Raphael(container_id, grid_size_px , grid_size_px);
            }
            
            this.cells = [];
            this.cell_values = [];
            
            var set = this.paper.set();
            
            var radius = Math.floor(cell_size_px / 2);
            for (var i_row = 0; i_row < grid_size_cells; i_row++) {
                this.cells[i_row] = [];
                this.cell_values[i_row] = [];

                for (var i_col = 0; i_col < grid_size_cells; i_col++) {
                    var circle = this.paper.circle(i_col * cell_size_px, i_row * cell_size_px, radius);
                    circle.attr("fill", this.automat.getColor(0));
                    circle.attr("stroke", "#ccc");
                    circle.data("cell_x", i_row);
                    circle.data("cell_y", i_col);
                    circle.click(function () {
                        me.toggleCell.apply(me, [this.data("cell_x"), this.data("cell_y")]);
                     });
                    set.push(circle);

                    this.cells[i_row][i_col] = circle;
                    this.cell_values[i_row][i_col] = 0;
                }
            }

           set.translate(cell_size_px/2 + 1, cell_size_px/2 + 1);

           values = this._center_cells(grid_size_cells,values);
           this._draw_cells(values);
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
    
    _draw_cells: function(values){
        var me = this;
        $.each(values, function(i_row, row){
            $.each(row, function(i_col, value){
                if(value !== me.cell_values[i_row][i_col]){
                    me.cell_values[i_row][i_col] = value;
                    me.cells[i_row][i_col].attr("fill", me.automat.getColor(value));
                    me.cells[i_row][i_col].attr("stroke", "#ccc");
                }
            });
        });
    }, 
    
    }
    
});
