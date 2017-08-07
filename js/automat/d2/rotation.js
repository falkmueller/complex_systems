app.automat = app.automat  || {};
app.automat.d2 = app.automat.d2  || {};

app.automat.d2.rotation = {
    
    name: "Rotation",
    active: true,
    
    default_value: {
        "standard":  {
            "name": "Standard",
            col_count: 24, 
            row_count: 24, 
            cells: [
                [0,0,1,1,0,1,1,0,0],
                [0,0,0,1,0,1,0,0,0],
                [1,1,1,1,1,1,1,1,1],
                [0,0,0,1,0,1,0,0,0],
                [0,0,1,1,0,1,1,0,0],
                ]
        }
    },
    
     getColor: function(value){
         var str = "" + value;
         var val = str.substr(0,1);
         var signal = str.substr(1,1);
         
        if(val == "1"){
            return "#AAD562";
        } else{
            
            if(signal == "→"){
                return "#EEE"
            } else if (signal == "↓"){
                return "#DDD"
            } else if (signal == "←"){
                return "#CCC"
            } else if (signal == "↑"){
                return "#BBB"
            } else if (signal == "s"){
                return "#E3FFE7"
            }
            
            return "#FFF";
        }

    },
    
    _get_value: function(grid, x, y, loop){
        if(x < 0 || y < 0 || x >= grid.length || y >= grid[x].length){
            if(!loop){
                return "#";
            }
            
            if (x < 0) { x = grid.length - 1;} else if( x >= grid.length) { x = 0;}
            if (y < 0) { y = grid[x].length - 1;} else if( y >= grid[x].length) { y = 0;}
        }
        
        return '' + grid[x][y];  
    },
    
    cell_step: function (grid, pos, loop){
        
        var nab = [
            [this._get_value(grid, pos.x - 1, pos.y - 1),   this._get_value(grid, pos.x, pos.y - 1),    this._get_value(grid, pos.x + 1, pos.y - 1)],
            [this._get_value(grid, pos.x - 1, pos.y),       this._get_value(grid, pos.x, pos.y),        this._get_value(grid, pos.x + 1, pos.y)],
            [this._get_value(grid, pos.x - 1, pos.y + 1),   this._get_value(grid, pos.x, pos.y + 1),    this._get_value(grid, pos.x + 1, pos.y + 1)]
        ];
        
        var ret = nab[1][1];
        
        //wen fertig, dan nichts tun
        if(nab[1][1].substr(1,1) == 's'){
            return ret;
        }
        
        //markier signal zur Mitte hin
        if(nab[1][1].substr(1,1) == ""){
            //außengreis markieren
            if (nab[0][1] == "#" && nab[1][0] == "#"){ return nab[1][1].substr(0,1) + '↑→'; }
            if (nab[0][1] == "#" && nab[1][2] == "#"){ return nab[1][1].substr(0,1) + '→↓'; }
            if (nab[2][1] == "#" && nab[1][2] == "#"){ return nab[1][1].substr(0,1) + '↓←'; }
            if (nab[2][1] == "#" && nab[1][0] == "#"){ return nab[1][1].substr(0,1) + '←↑'; }

            if (nab[0][1] == "#"){ return nab[1][1].substr(0,1) + '→'; }
            if (nab[1][2] == "#"){ return nab[1][1].substr(0,1) + '↓'; }
            if (nab[2][1] == "#"){ return nab[1][1].substr(0,1) + '←'; }
            if (nab[1][0] == "#"){ return nab[1][1].substr(0,1) + '↑'; }
            
            //inneren kreis markieren
            if(nab[1][0].substr(1,1) == "↑" && nab[1][2].substr(1,1) == "↓"){
                //wenn mitte aus einer zelle besteht
                return nab[1][1].substr(0,1) + 's';
            }
            
            if (nab[0][0].substr(1,2) == "↑→"){ return nab[1][1].substr(0,1) + '↑→'; }
            if (nab[0][2].substr(1,2) == "→↓"){ return nab[1][1].substr(0,1) + '→↓'; }
            if (nab[2][2].substr(1,2) == "↓←"){ return nab[1][1].substr(0,1) + '↓←'; }
            if (nab[2][0].substr(1,2) == "←↑"){ return nab[1][1].substr(0,1) + '←↑'; }

            if (nab[0][1].substr(1,1) == "→"){ return nab[1][1].substr(0,1) + '→'; }
            if (nab[1][2].substr(1,1) == "↓"){ return nab[1][1].substr(0,1) + '↓'; }
            if (nab[2][1].substr(1,1) == "←"){ return nab[1][1].substr(0,1) + '←'; }
            if (nab[1][0].substr(1,1) == "↑"){ return nab[1][1].substr(0,1) + '↑'; }
        }
        
        //stoppsignal
        if(nab[0][0].substr(1,1) == "s" || nab[0][1].substr(1,1) == "s" || nab[0][2].substr(1,1) == "s"||
                nab[1][0].substr(1,1) == "s" || nab[1][2].substr(1,1) == "s" || 
                nab[2][0].substr(1,1) == "s" || nab[2][1].substr(1,1) == "s" || nab[2][2].substr(1,1) == "s" ||
                
                (nab[1][1].substr(1,2) == "↑→" && nab[1][2].substr(1,2) == "→↓") ||
                (nab[1][1].substr(1,2) == "→↓" && nab[2][1].substr(1,2) == "↓←") ||
                (nab[1][1].substr(1,2) == "↓←" && nab[1][0].substr(1,2) == "←↑") ||
                (nab[1][1].substr(1,2) == "←↑" && nab[0][1].substr(1,2) == "↑→") ){
           
            if (nab[1][1].substr(1,1) == "→"){ return nab[1][0].substr(0,1) + "s"; }
            if (nab[1][1].substr(1,1) == "↓"){ return nab[0][1].substr(0,1) + "s"; }
            if (nab[1][1].substr(1,1) == "←"){ return nab[1][2].substr(0,1) + "s"; }
            if (nab[1][1].substr(1,1) == "↑"){ return nab[2][1].substr(0,1) + "s"; }
           
        }
        
        //schieben
        if (nab[1][1].substr(1,1) == "→"){ return nab[1][0].substr(0,1) + nab[1][1].substr(1,2); }
        if (nab[1][1].substr(1,1) == "↓"){ return nab[0][1].substr(0,1) + nab[1][1].substr(1,2); }
        if (nab[1][1].substr(1,1) == "←"){ return nab[1][2].substr(0,1) + nab[1][1].substr(1,2); }
        if (nab[1][1].substr(1,1) == "↑"){ return nab[2][1].substr(0,1) + nab[1][1].substr(1,2); }
        
        return ret;
    },
    
     check_finish: function(grid){
         return false;
     }
};
