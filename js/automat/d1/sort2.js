app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

/**
 * Odd-Even-Transposition-Sort von n-Zuständen
 * @type type
 */
app.automat.d1.sort2 = {
    
        default_value: "afdcbe",
        finish_count: 0,
        finish_conf: "",
    
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
            
            //init
            if(self.length == 1){
                ret = [self[0], "_"]
                return ret;
            }
            
            //normal step
            ret = [self[0], self[1]];
            
            //for sort
            if(left[1] == "R" && self[1] == "L"){
                ret[0] = left[0] > self[0] ? left[0]: self[0];
                ret[1] = "R";
                return ret;
            }
            if(right[1] == "L" && self[1] == "R"){
                ret[0] = right[0] < self[0] ? right[0]: self[0];
                ret[1] = "L";
                return ret;
            }
            if(left[0] == "_" && self[1] == "L"){
                ret[1] = "R";
                return ret;
            }
            if(right[0] == "_" && self[1] == "R"){
                ret[1] = "L";
                return ret;
            }
            
            //for iitialisation
            if(left[0] == "_" && self[1] == "_"){
                ret[1] = "L";
                return ret;
            }
            if(left[1] == "L" && self[1] == "_"){
                ret[1] = "L";
                return ret;
            }
            
            return ret;
        },
        
        check_finish: function(band){
            if( band[band.length - 1][1] == "_"){
                return false;
            }
            
            var str = "";
            
            for (var i=1; i < band.length;i++){
                str += band[i][0];
            }
            
            if( this.finish_conf != str){
                this.finish_count = 0;
                this.finish_conf = str;
                return false;
            } else {
                this.finish_count++;
            }
            
            if(this.finish_count > 2){
                return true;
            }
           
            return false;
        }
    }
