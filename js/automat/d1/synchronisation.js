app.automat = app.automat  || {};
app.automat.d1 = app.automat.d1  || {};

app.automat.d1.synchronisation = {
        
        default_value: "ssssssssss",
        
        cell_step: function (band, pos){
            var left, right, self, ret = ["_", "_", "_"];
            
            self = band[pos];
            
            if(pos == 0 ){
                left = ["#", "#", "#"]
            } else {
                left = band[pos - 1];
            }
            
            if(pos >= band.length - 1 ){
                right = ["#", "#", "#"]
            } else {
                right = band[pos + 1];
            }
            
            //init step
            if(self.length == 1){
                ret = [self[0], "_", "_"];
                
                if(left[0] == "#"){
                    ret = ["|",">", "1>"];
                }
                return ret;
            }
            
            //normal step
            ret = [self[0], self[1], self[2]];
            
            if(self[0] == "f"){
                return ret;
            }
            
            //band 1 signal mit geschwindigkeit 1
            if(left[1] == ">" || left[1] == "<>"){
                ret[1] = ">";
                if(right[0] == "#" || self[0] == "|"){
                    ret[1] = "<";
                    ret[0] = "|";
                }
            }
            if(right[1] == "<" || right[1] == "<>"){
                ret[1] = "<";
                if(left[0] == "#" || self[0] == "|"){
                    ret[1] = ">";
                    ret[0] = "|";
                }
            }
            if((left[1] == ">" || left[1] == "<>") && (right[1] == "<" || right[1] == "<>")){
                ret[0] = "|";
                ret[1] = "<>";
            }
            if(self[1] == ">" || self[1] == "<" || self[1] == "<>"){
                ret[1] = "_";
            }
            
            //band 2 singnam mir geschwingifkeit 1/3
            if(self[2] == "1>"){
                ret[2] = "2>";
            }
            else if (self[2] == "2>"){
                ret[2] = "3>";
            }
            else if(self[2] == "<1"){
                ret[2] = "<2";
            }
            else if (self[2] == "<2"){
                ret[2] = "<3";
            }
            else if(self[2] == "<1>"){
                ret[2] = "<2>";
            }
            else if (self[2] == "<2>"){
                ret[2] = "<3>";
            }
            else {
                ret[2] = "_";
            }
            
            if(left[2] == "3>" || left[2] == "<3>"){
                ret[2] = "1>";
                if(right[0] == "#" || self[0] == "|"){
                    ret[2] = "<1";
                    ret[0] = "|";
                }
            }
            if(right[2] == "<3" || right[2] == "<3>"){
                ret[2] = "<1";
                if(left[0] == "#" || self[0] == "|"){
                    ret[2] = "1>";
                    ret[0] = "|";
                }
            }
            
            //signale spiegeln, wenn Sie sich treffen
            //signale treffen sich in einer zelle
            if(((left[1] == ">" || left[1] == "<>") && (right[2] == "<3" || right[2] == "<3>")) ||
                    ((right[1] == "<" || right[1] == "<>") && (left[2] == "3>" || left[2] == "<3>"))){
                
                ret[0] = "|";
                ret[1] = "<>";
                ret[2] = "<1>";
                
            }
            //Signale treffen sich in zwei zellen
            else if(((self[1] == ">" || self[1] == "<>") &&(right[2] == "<1" || right[2] == "<2" || right[2] == "<3" || right[2] == "<1>" || right[2] == "<2>" || right[2] == "<3>")) ||
                    ((right[1] == "<" || right[1] == "<>") &&(self[2] == "1>" || self[2] == "2>" || self[2] == "3>" || self[2] == "<1>" || self[2] == "<2>" || self[2] == "<3>"))){
                //nach links
                ret[0] = "|";
                ret[1] = "<";
                ret[2] = "<1";
            }
            else if(((left[1] == ">" || left[1] == "<>") &&(self[2] == "<1" || self[2] == "<2" || self[2] == "<3" || self[2] == "<1>" || self[2] == "<2>" || self[2] == "<3>")) ||
                    ((self[1] == "<" || self[1] == "<>") &&(left[2] == "1>" || left[2] == "2>" || left[2] == "3>" || left[2] == "<1>" || left[2] == "<2>" || left[2] == "<3>"))){
                //nach rechts
                ret[0] = "|";
                ret[1] = ">";
                ret[2] = "1>";
            }
            
            //endbedingung
            if(self[0] == "|" && (left[0] == "|" || left[0] == "#") && (right[0] == "|" || right[0] == "#")){
                ret[0] = "f"; 
            }
            
            return ret;
        },
        
        check_finish: function(band){
            if(band[0][0] == "f"){
                return true;
            }
            
            return false;
        }
    }
