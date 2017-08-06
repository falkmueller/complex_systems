app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

/**
 * Spiegeln ohne Signal
 * @type type
 */
app.automat.d1.mirror1 = {
        
        default_value: "abcdef",
        
        cell_step: function (band, pos){
            var left, right, self, ret = ["_", "_"];
            
            self = band[pos];
            
            if(pos == 0 ){
                left = ["_", "_"]
            } else {
                left = band[pos - 1];
            }
            
            if(pos >= band.length - 1 ){
                right = ["_", "_"]
            } else {
                right = band[pos + 1];
            }
            
            //init step
            if(self.length == 1){
                ret = [self[0], "_"]
                return ret;
            }
            
            //normal step
            ret = [self[0], self[1]];
            
            //linker rand
            if (left[1] == "_" && left[0] == "_"){
                ret[0] = right[0];
                ret[1] = self[0];
                return ret;
            }
            
            //oberes band nach links
            ret[0] = right[0];
            
            //unteres band nach rechts
            ret[1] = left[1];
            
            return ret;
        },
        
        check_finish: function(band){
            if(band[band.length - 1][1] != "_"){
               return true;
            }
            
            return false;
        }
    }
