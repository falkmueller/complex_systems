app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

app.automat.d1.translation = {
    
    name: "Translation nach Links (Leerzeichen/Unterstriche verwenden)",
        
        default_value: "___abcdef",
        
        cell_step: function (band, pos){
            var left, right, self, ret = ["_", "_"];
            
            self = band[pos];
            
            if(pos == 0 ){
                left = ["#", "#"]
            } else {
                left = band[pos - 1];
            }
            
            if(pos >= band.length - 1 ){
                right = ["#", "#"]
            } else {
                right = band[pos + 1];
            }
            
            //init step
            if(self.length == 1){
                ret = [self[0], "_"];
                
                if(self[0] == " "){
                    ret[0] = "_";
                }
                
                if(left[0] == "#"){
                    ret[1] = "v";
                }
                return ret;
            }
            
            //normal step
            ret = [self[0], self[1]];
            
            //signal durchschieben
            ret[1] = left[1];
            if(left[0] == "#"){
                if (self[0] != "_" || right[0] != "_"){
                    ret[1] = "v2";
                } else {
                    ret[1] = "v";
                }
            }
            
            if(self[1] == "v"){
                ret[0] = right[0];
                if(right[0] == "#"){
                    ret[0] = "_";
                }
            }
            
            return ret;
        },
        
        check_finish: function(band){
            if(band[band.length -1][1] == "v2"){
                return true;
            }
            
            return false;
        }
    }
