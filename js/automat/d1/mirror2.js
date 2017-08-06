app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

app.automat.d1.mirror2 = {
    
        default_value: "abcdef",
    
        cell_step: function (band, pos){
            var left, right, self, ret = ["_", "_", "_", "_"];
            
            self = band[pos];
            
            if(pos == 0 ){
                left = ["#", "#", "#", "#"]
            } else {
                left = band[pos - 1];
            }
            
            if(pos >= band.length - 1 ){
                right = ["#", "#", "#", "#"]
            } else {
                right = band[pos + 1];
            }
            
            //init step
            if(self.length == 1){
                ret = [self[0], "_", "_", 0]
                return ret;
            }
            
            //normal step
            if(self[2] == "v"){
                return self;
            }
            
            ret = [self[0], self[1],  self[2], self[3] + 1];
            
            
            
            //oberes Band: nach westen verschieben mit einen Takt Pause           
            if(self[3] + 1 > 1){
                ret[0] = right[0] == "#" ? "_" : right[0];
                ret[3] = 0;
            }
            
            //Mittleres Band: signal nach osten
            if (left[0] == "#"){
                if(self[3] + 1 > 1){
                    ret[1] = "_";
                } else {
                    ret[1] = self[0];
                }
            } else {
                ret[1] = left[1];
            }
            
            if((right[0] == "#" && self[1] != "_") || right[2] == "v"){
                ret = ["#", self[1],  "v", "#"];
            }
            
            return ret;
        },
        
        check_finish: function(band){
            if(band[0][2] == "v"){
                return true;
            }
            
            return false;
        }
    }
