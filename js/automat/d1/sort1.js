app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

/**
 * sortieren zweier zustände
 * @type type
 */
 app.automat.d1.sort1 = {
     
     name: "einfaches Sortieren zweier Zustände",
        
        default_value: "1010101",
        finish_count: 0,
        finish_conf: "",
        
        cell_step: function (band, pos){
            var left, right, self, ret = ["_", "_"];
            
            self = band[pos];
            
            if(pos == 0 ){
                left = ["_"]
            } else {
                left = band[pos - 1];
            }
            
            if(pos >= band.length - 1 ){
                right = ["_"]
            } else {
                right = band[pos + 1];
            }
            
            //normal step
            ret = [self[0]];
            
            if (left[0] != "_" && left[0] > self[0]){
                ret[0] = left[0];
                return ret;
            }
            
            
            if (right[0] != "_" && right[0] < self[0]){
                ret[0] = right[0];
                return ret;
            }
            
            return ret;
        },
        
        check_finish: function(band){
            
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
