   //ost-west: 632 km, n-s:  876 km
    app.views.ants = app.view.$extend({
        events: [
            ["click", "#div_paint svg", "set_point"],
            ["click", "#btn-start", "start"]
        ],
        
        paper: null,
        points: [],
        pathes: [],
        px_km_factor: 1,
        
        render: function(){
            var me = this;
            
            this.$el.load( "views/ants.html", function() {
                $('#div_paint').html("<span>klicken Sie auf die Karte um Orte hinzu zu fügen order zu entfernen</span>");
                var width = $('#div_paint').innerWidth();
                
                me.paper = Raphael('div_paint', width , width * 1.35);
                me.paper.image("img/germany.svg", 0, 0, width, width * 1.35);
                
                me.px_km_factor = 632 / width;
            });
        },
        
        set_point: function(e){
            var elm = $("#div_paint svg");
            var xPos = e.pageX - elm.offset().left;
            var yPos = e.pageY - elm.offset().top;
            
            for(var i = 0; i < this.points.length; i++){
                var p = this.points[i];
                if(p.x > xPos - 10 && p.x < xPos + 10 &&
                        p.y > yPos - 10 && p.y < yPos + 10){
                    p.circle.remove();
                    this.points.splice(i, 1);
                    return;
                }
            }
            
            var circle = this.paper.circle(xPos,yPos, 10);
            circle.attr("fill", "#fff");
            circle.attr("stroke", "#aaa");
            this.points.push({
                x: xPos,
                y: yPos,
                circle: circle
            });
            
        
        },
        
        start: function(){
            //init matrix####################################
            var cost_matrix = {};
            var pheromone_matrix = {};
            var ph0 = 1;
            var cities_general = [];
            
            var k_total = parseInt($("#numAnts").val());
            if(!k_total || k_total < 0){
                k_total = 1;
                $("#numAnts").val(k_total);
            }
            else if (k_total > 10000){
                 k_total = 10000;
                $("#numAnts").val(k_total);
            } 
            
            var r_total = parseInt($("#numRuns").val());
            if(!r_total || r_total < 0){
                r_total = 1;
                $("#numRuns").val(r_total);
            }
            else if (r_total > 10000){
                 r_total = 10000;
                $("#numRuns").val(r_total);
            } 
            
            var Evaporation =  parseInt($("#numEvaporation").val());
            if(Evaporation > 99){
                Evaporation = 99;
                $("#numEvaporation").val(Evaporation);
            }
            else if(Evaporation < 0){
                Evaporation = 0;
                $("#numEvaporation").val(Evaporation);
            }
            
            Evaporation = Evaporation / 100;
            
            var only_best = $("#onlyBest").is(":checked");
            
            $(this.pathes).each(function(i, path){ path.remove(); });
            
            for(var i = 0; i < this.points.length; i++){
                var p1 = this.points[i];
                
                if(!cost_matrix[i]){
                    cost_matrix[i] = {};
                    pheromone_matrix[i] = {};
                    cities_general.push(i);
                }
                
                
                
                for(var j = 0; j < this.points.length; j++){
                    var p2 = this.points[j];
                    
                    
                    
                    if (j == i){
                        cost_matrix[i][j] = -1;
                        pheromone_matrix[i][j] = 0;
                        continue;
                    }
                    
                    pheromone_matrix[i][j] = ph0;
                    cost_matrix[i][j] = Math.ceil(Math.sqrt(Math.pow(p2.x - p1.x , 2) + Math.pow(p1.y - p2.y, 2)));
                }
            }
            
            console.log(cost_matrix);
            
            //run#####################################################################
            var start_distance = 0;
            
            for(var r = 0;r < r_total;r++){
                var ants = [];
                var best_ant = null;
                
               for(var k = 0;k < k_total;k++){
                    var ant = {cities: [], route_distance: 0};
                    //add random start
                    var curent_city = cities_general[Math.floor(Math.random()*cities_general.length)];
                    ant.cities.push(curent_city);
                    var cities_possible = $(cities_general).not(ant.cities).get();
                     
                    while(cities_possible.length > 0){
                        var ph_posibble = 0;
                        
                        $(cities_possible).each(function(index, j){
                                ph_posibble += pheromone_matrix[curent_city][j];
                        });
                        
                        var random = Math.random();
                        var p_current = 0;
                        for(var ji = 0; ji < cities_possible.length;ji++){
                            p_current += pheromone_matrix[curent_city][cities_possible[ji]] / ph_posibble;
                            if(p_current >= random){
                                ant.cities.push(cities_possible[ji]);
                                ant.route_distance += cost_matrix[curent_city][cities_possible[ji]];
                                curent_city = cities_possible[ji];
                                break;
                            }
                        } 
                        
                        cities_possible = $(cities_general).not(ant.cities).get();
                    }
                   
                    if (!best_ant || best_ant.route_distance > ant.route_distance){
                        best_ant = ant;
                        
                    }
                    ants.push(ant);
                }
                
                //verdunstung
                for(var i = 0; i < this.points.length; i++){
                    for(var j = 0; j < this.points.length; j++){
                        pheromone_matrix[i][j] *= (1 - Evaporation);
                    }
                }
                
                //pheromone_matrix update
                if(only_best){
                    var last_city = -1;
                    $(best_ant.cities).each(function(i, c){
                        if(last_city == -1){
                            last_city = c;
                            return;
                        }

                        pheromone_matrix[last_city][c] += 1;
                        //anscheinend optional
                        pheromone_matrix[c][last_city] += 1;
                        last_city = c;

                    });
                } else {
                    $(ants).each(function(i, a){
                       var p_ant = Math.pow(best_ant.route_distance / a.route_distance,2);
                       console.log(p_ant);
                       var last_city = -1;
                        $(a.cities).each(function(i, c){
                            if(last_city == -1){
                                last_city = c;
                                return;
                            }

                            pheromone_matrix[last_city][c] += p_ant;
                            //anscheinend optional
                            pheromone_matrix[c][last_city] += p_ant;
                            last_city = c;

                        });
                   });   
                }
                
                if(start_distance == 0){start_distance = best_ant.route_distance;}
                
                console.log(best_ant.route_distance, best_ant.cities);
                //console.log(ants);
            }
            
           console.log(start_distance, best_ant.route_distance, best_ant.cities);
           console.log(pheromone_matrix);
            
            var info = "";
            info += "Beste Route von ersten Lauf: " + parseInt(start_distance * this.px_km_factor) + " km<br/>";
            info += "Beste Route von letzen Lauf: " + parseInt(best_ant.route_distance * this.px_km_factor) + " km<br/>";
            info += "Verbesserung: " + (100 - parseInt(best_ant.route_distance / start_distance * 100)) + " %";
            
            $("#p_info").html(info);
            
            //draw result
             var last_city = -1;
             var me = this;
                $(best_ant.cities).each(function(i, c){
                    if(last_city == -1){
                        last_city = c;
                        return;
                    }
                    
                    var path = me.paper.path("M" + me.points[last_city].x + "," + me.points[last_city].y + "L" + me.points[c].x + "," + me.points[c].y);
                    me.pathes.push(path);
                    
                    last_city = c;
                    
            });
            
        },
        
        start_old: function(){
            //init matrix####################################
            var cost_matrix = {};
            var pheromone_matrix = {};
            var ph0 = 1;
            var cities_general = [];
            
            for(var i = 0; i < this.points.length; i++){
                var p1 = this.points[i];
                
                if(!cost_matrix[i]){
                    cost_matrix[i] = {};
                    pheromone_matrix[i] = {};
                    cities_general.push(i);
                }
                
                
                
                for(var j = 0; j < this.points.length; j++){
                    var p2 = this.points[j];
                    
                    pheromone_matrix[i][j] = ph0;
                    
                    if (j == i){
                        cost_matrix[i][j] = -1;
                        continue;
                    }
                    
                    cost_matrix[i][j] = Math.ceil(Math.sqrt(Math.pow(p2.x - p1.x , 2) + Math.pow(p1.y - p2.y, 2)));
                }
            }
            
            console.log(cost_matrix);
            
            //run#####################################################################
            for(var r = 0;r < 100;r++){
                var ants = [];
                var best_ant = null;
                
               for(var k = 0;k < 20;k++){
                    var ant = {cities: [], route_distance: 0};
                    
                   
                    //run
                    for(var i = 0; i < this.points.length; i++){
                          var ph_posibble = 0;
                        var cities_possible = $(cities_general).not(ant.cities).get();
                        $(cities_possible).each(function(index, j){
                                ph_posibble += pheromone_matrix[i][j];
                        });
                        
                        var random = Math.random();
                        var p_current = 0;
                        for(var ji = 0; ji < cities_possible.length;ji++){
                            p_current += pheromone_matrix[i][cities_possible[ji]] / ph_posibble;
                            if(p_current >= random){
                                ant.cities.push(cities_possible[ji]);
                                if(ant.cities.length > 1){
                                    ant.route_distance += cost_matrix[ant.cities[ant.cities.length - 2]][ant.cities[ant.cities.length - 1]]
                                }
                                break;
                            }
                        } 
                    }
                   
                    if (!best_ant || best_ant.route_distance > ant.route_distance){
                        best_ant = ant;
                        
                    }
                    ants.push(ant);
                }
                
                //verdunstung
                for(var i = 0; i < this.points.length; i++){
                    for(var j = 0; j < this.points.length; j++){
                        pheromone_matrix[i][j] *= 0.8;
                    }
                }
                
                //pheromone_matrix update
                /*$(ants).each(function(i, a){
                    var p_ant = best_ant.route_distance / a.route_distance;
                    $(a.cities).each(function(i, c){
                        pheromone_matrix[i][c] += p_ant;
                    });
                });*/
                $(best_ant.cities).each(function(i, c){
                        pheromone_matrix[i][c] += 1;
                    });
                console.log(best_ant.route_distance, best_ant.cities);
                //console.log(ants);
            }
            
           console.log(best_ant.route_distance, best_ant.cities);
            console.log(pheromone_matrix);
            
        }
    });
