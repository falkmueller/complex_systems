app.automat = app.automat  || {};
app.automat.d2 = app.automat.d2  || {};

app.automat.d2.copy = {
    
    name: "Kopier Automat",
    
    default_value: {
        "standard":  {
            "name": "Standard",
            col_count: 30, 
            row_count: 30, 
            cells: [
                [1,0,1],
                [1,1,1],
                [1,0,1]
                ]
        }
    },
    
    _get_value: function(grid, x, y, loop){
        if(x < 0 || y < 0 || x >= grid.length || y >= grid[x].length){
            if(!loop){
                return 0;
            }
            
            if (x < 0) { x = grid.length - 1;} else if( x >= grid.length) { x = 0;}
            if (y < 0) { y = grid[x].length - 1;} else if( y >= grid[x].length) { y = 0;}
        }
        
        return grid[x][y];  
    },
    
    cell_step: function (grid, pos, loop){
        var livings = 0;
        livings += this._get_value(grid, pos.x -1, pos.y - 1, loop);
        livings += this._get_value(grid, pos.x -1, pos.y, loop);
        livings += this._get_value(grid, pos.x -1, pos.y + 1, loop);
        livings += this._get_value(grid, pos.x, pos.y - 1, loop);
        livings += this._get_value(grid, pos.x, pos.y, loop);
        livings += this._get_value(grid, pos.x, pos.y + 1, loop);
        livings += this._get_value(grid, pos.x + 1, pos.y - 1, loop);
        livings += this._get_value(grid, pos.x + 1, pos.y, loop);
        livings += this._get_value(grid, pos.x + 1, pos.y + 1, loop);

        if(livings % 2 == 0){
            return 0;
        }
        
        return 1;
    },
    
     check_finish: function(grid){
         return false;
     }
};