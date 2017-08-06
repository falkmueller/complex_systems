app.automat = app.automat  || {};
app.automat.d2 = app.automat.d2  || {};

app.automat.d2.r184 = {
    
    name: "Regel 184",
    
    default_value: {
        "standard":  {
            "name": "Regel 184 Beispiel",
            "col_count": 30, 
            "row_count": 3, 
            "cells": [
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0],
                [1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0],
                [0],
                [1,0,1,0,1,0,1,0,0,0,1,1,1,1,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0],
                [0],
                [1,1,1,1,1,1,1,1,1,1],
                [0],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
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
        var signatur = "";
        signatur += this._get_value(grid, pos.x, pos.y - 1, loop);
        signatur += this._get_value(grid, pos.x, pos.y, loop);
        signatur += this._get_value(grid, pos.x, pos.y + 1, loop);

        switch (signatur) {
            case "110": return 0;
            case "101": return 1;
            case "100": return 1;
            case "011": return 1;
            case "010": return 0;
            case "001": return 0;
            case "000": return 0;
        }
        
        return this._get_value(grid, pos.x, pos.y, loop);
    },
    
     check_finish: function(grid){
         return false;
     }
};