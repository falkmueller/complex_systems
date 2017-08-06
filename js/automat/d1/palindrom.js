app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

/**
 * Palindromerkennung
 * @type type
 */
app.automat.d1.palindrom = {
        
        default_value: "abcdcba",
        
        cell_step: function (band, pos){
            var left, right, self, ret = ["_", "_", "_", "_"];
            
            self = band[pos];
            
            if(pos == 0 ){
                left = ["_", "_", "_", "_"]
            } else {
                left = band[pos - 1];
            }
            
            if(pos >= band.length - 1 ){
                right = ["_", "_", "_", "_"]
            } else {
                right = band[pos + 1];
            }
            
            //init step
            if(self.length == 1){
                ret = [self[0], self [0], "+"]

                if(left[0] == "_" &&  right[0] == "_" ){
                    ret.push("<+");
                }
                else if(left[0] == "_"){
                    ret.push(">");
                }
                else if(right[0] == "_"){
                    ret.push("<");
                } else {
                    ret.push("_");
                }
                
                return ret;
            }
            
            //normal step
            ret[0] = right[0];
            ret[1] = left[1];
            
            if(self[2] == "+" && right[0] == left[1]){
                ret[2] = "+";
            } else {
                ret[2] = "-";
            }
            
            if(left[3] == ">" && right[3] == "<"){ /*treffen in der Mitte*/
                ret[3] = "<" + ret[2];
            }
            else if(self[3] == ">" && right[3] == "<"){ /*treffen nicht in der Mitte*/
                ret[3] = "<-";
            }
            else if (right[3] == "<-" || right[3] == "<+"){ /*Transport des ergebnisses*/
                ret[3] = right[3];
            }
            else if(left[3] == ">" && self[3] == "_"){
                ret[3] = left[3];
            }
            else if(right[3] == "<"){
                ret[3] = right[3];
            }
            else {
                ret[3] = "_";
            }
            
            return ret;
        },
        
        check_finish: function(band){
            if(band[0][3] == "<+" || band[0][3] == "<-"){
               return true;
            }
            
            return false;
        }
    }
