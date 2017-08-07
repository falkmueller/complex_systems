app.automat = app.automat  || {};
app.automat.d2 = app.automat.d2  || {};

app.automat.d2.rotation = {
    
    name: "Rotation",
    active: false,
    
    default_value: {
        "standard":  {
            "name": "Standard",
            col_count: 30, 
            row_count: 30, 
            cells: [
                [1,1,0,1,1],
                [0,1,0,1,0],
                [1,1,1,1,1],
                [0,1,0,1,0],
                [1,1,0,1,1],
                ]
        }
    },
    
     getColor: function(value){
         var str = "" + value;
        if(str == "1"){
            return "#AAD562";
        } else if(str == "0"){
            return "#FFF";
        }
        
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
          var value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
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

        //signal von den Ecken zum Zentrum senden
        if (nab[0][1] == "#" && nab[1][0] == "#"){ return nab[1][1].substr(0,1) + '1'; }
        if (nab[0][1] == "#" && nab[1][2] == "#"){ return nab[1][1].substr(0,1) + '2'; }
        if (nab[2][1] == "#" && nab[1][2] == "#"){ return nab[1][1].substr(0,1) + '3'; }
        if (nab[2][1] == "#" && nab[1][0] == "#"){ return nab[1][1].substr(0,1) + '4'; }
        
        if(nab[0][0].substr(1,1) == "1"){ return nab[1][1].substr(0,1) + '1'; }
        if(nab[0][2].substr(1,1) == "2"){ return nab[1][1].substr(0,1) + '2'; }
        if(nab[2][2].substr(1,1) == "3"){ return nab[1][1].substr(0,1) + '3'; }
        if(nab[2][0].substr(1,1) == "4"){ return nab[1][1].substr(0,1) + '4'; }
        
        //signal vom Zentrum nach außen zu stoppsignal umwandeln

        

        return ret;
    },
    
     check_finish: function(grid){
         return false;
     }
};
