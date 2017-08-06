app.automat = app.automat  || {};
app.automat.d2 = app.automat.d2  || {};

app.automat.d2.gol = {
    
    name: "Game of Live",
    
    default_value: {
        "glide": {
            "name": "Gleider",
            "col_count": 21, 
            "row_count": 21, 
            "cells": [
                [1,1,0,0,0,1,1],
                [1,0,1,0,1,0,1],
                [1,0,0,0,0,0,1],
                [0,0,0,0,0,0,0],
                [1,0,0,0,0,0,1],
                [1,0,1,0,1,0,1],
                [1,1,0,0,0,1,1]
                ]
        },
        "perm": {
            "name": "Konstant und Permutierend",
            "col_count": 20, 
            "row_count": 20, 
            "cells": [
                [0,0,1,0,0,0,0],
                [0,0,1,0,0,1,1],
                [0,0,1,0,0,1,1],
                [0,0,1,0,0,0,0],
                [0],
                [0],
                [0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [1,0,0,0,0,0,1],
                [0,0,0,0,0,0,0],
                [0,0,1,1,1,0,0]]
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
        livings += this._get_value(grid, pos.x, pos.y + 1, loop);
        livings += this._get_value(grid, pos.x + 1, pos.y - 1, loop);
        livings += this._get_value(grid, pos.x + 1, pos.y, loop);
        livings += this._get_value(grid, pos.x + 1, pos.y + 1, loop);

        if(livings < 2 || livings > 3){
            return 0;
        } else if (livings == 3){
            return 1;
        }
        return this._get_value(grid, pos.x, pos.y, loop);
    },
    
     check_finish: function(grid){
         return false;
     }
};