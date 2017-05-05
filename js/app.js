/*app.js*/
var app={
    config: {},
    
    start: function(){
        $("#div_paint").html("");
        app.load_config();
        app.set_events();
        automat.init("div_paint");
        $.publish("automat.stop",[]);
    },
    
    
    load_config: function(){
        $.ajax({
            async: false,
            url: "data/config.json",
            dataType: 'json',
            success: function(config){
                app.config = config;
            }
        });

        var sel_automat = $("#sel_automat");
        $.each(app.config.automat, function(key, automat){
            var opt = $("<option/>");
            opt.text(automat.name);
            opt.attr("value", key);
            sel_automat.append(opt);
        });
    },
    
    set_events: function(){
        $("#sel_automat").change(app.select_automat);
        $("#sel_grid").change(function(){app.load_grid($(this).val());});
        $("#bt_zoom_in").click(function(){automat.zoom(-1);});
        $("#bt_zoom_out").click(function(){automat.zoom(1);});
        $("#bt_start_stop").click(automat.start_stop);
        $("#bt_step").click(automat.single_step);
        $("#sel_speed").change(app.set_speed);
        $("#sel_border").change(app.set_border);
        
        $.subscribe("automat.step", function(a, population, generation){
            $("#txt_population").text(population);
            $("#txt_generation").text(generation);
        });
        
        $.subscribe("automat.start", function(){
             $('#sel_automat').attr('disabled', true);
             $('#sel_grid').attr('disabled', true);
             $('#sel_speed').attr('disabled', true);
             $('#sel_border').attr('disabled', true);
             $('#bt_zoom_in').addClass("disabled");
             $('#bt_zoom_out').addClass("disabled");
             $('#bt_step').addClass("disabled");
        });
        
        $.subscribe("automat.stop", function(){
            $('#sel_automat').attr('disabled', false);
            $('#sel_grid').attr('disabled', false);
            $('#sel_speed').attr('disabled', false);
            $('#sel_border').attr('disabled', false);
            $('#bt_zoom_in').removeClass("disabled");
            $('#bt_zoom_out').removeClass("disabled");
            $('#bt_step').removeClass("disabled");
        });
        
        $.subscribe("automat.status", function(a, status){
            $("#div_status").html("");
            $("#div_status").append("<span style='background-color: #fff;' />");
            $.each(status, function(key, status){
                $("#div_status").append("<span style='background-color: " + status.color + ";' />");
            });
        });
        
    },
    
    set_border: function(){
        automat.set_border($("#sel_border").val());  
    },
    
    set_speed: function(){
        automat.set_speed(parseInt($("#sel_speed").val()));  
    },
    
    load_grid: function(file){
        
        if(!file){
            automat.load_grid(automat.standard.grid);
            return;
        }
        
        $.ajax({
            async: false,
            url: "data/" + file,
            dataType: 'json',
            success: function(grid){
                automat.load_grid(grid);
            }
        });
    },
    
    
    select_automat: function(){

        var name = $("#sel_automat").val();
        $("#sel_grid option[value!='']").remove();
        app.load_automat("");

        if(name){
            app.load_automat(app.config.automat[name].file);

            //Grids setzen        
            $.each(app.config.automat[name].grid, function(key, grid){
                var opt = $("<option/>");
                opt.text(grid.name);
                opt.attr("value", grid.file);
                $("#sel_grid").append(opt);
            });
        }
    },

    load_automat: function(file){
        if(!file){
            automat.load_automat(automat.standard.automat);
            return;
        }
        
        $.ajax({
            async: false,
            url: "data/" + file,
            dataType: 'json',
            success: function(resp){
                automat.load_automat(resp);
            }
        });
    }
};

$(document).ready(function(){
    app.start();
});

function load_script(path){
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
}