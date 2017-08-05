if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

app.automat1d = {};
    app.automat1d.palindrom = {
        
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
    
    app.automat1d.mirror1 = {
        
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
    
    app.automat1d.sort1 = {
        
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
    
    app.automat1d.sort2 = {
    
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
    
app.automat1d.mirror2 = {
    
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
    
    app.automat1d.translation = {
        
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
    
    app.automat1d.synchronisation = {
        
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
    
    app.views.automat1d = app.view.$extend({
        
        events: [
             ["click", "#bt-reset", "reset"],
             ["click", "#bt-step", "step"],
             ["change", "#sel-type", "setDefault"]
         ],
        
        render: function(){
             var me = this;
             this.$el.load( "views/automat1d.html", function() {
                 me.setDefault();
             });
         },
         
         band: null,
         automat: null,
         interval: null,
         
         setDefault: function(){
            var default_value = app.automat1d[$("#sel-type", this.$el).val()].default_value;
            $("#text-input", this.$el).val(default_value);
         },
         
         start: function(){
            var word = $("#text-input", this.$el).val();
            if(word.length == 0){
                alert("Bitte gebe ein Wort ein.");
                return;
            } 

            $("#sel-type", this.$el).prop("disabled", true);
            $("#text-input", this.$el).prop("disabled", true);
            $("#sel-output", this.$el).prop("disabled", true);
            this.band = [];
            this.automat = app.automat1d[$("#sel-type", this.$el).val()];

            for (var i = 0, len = word.length; i < len; i++) {
                this.band.push([word[i]]);
            }

            this.print_band();
            
           if($("#sel-output", this.$el).val().startsWith("interval")){
                $("#bt-step", this.$el).prop("disabled", true);
                $("#bt-step", this.$el).addClass("disabled");
                var me = this;
                this.interval = setInterval(function(){
                    me.step();
                }, parseInt($("#sel-output", this.$el).val().substr(8)));
            }
         },
         
         step: function(){
             //init
             if(!this.automat){
                this.start();
                return;
             }
             
            var new_band = [];
            for (var i = 0, len = this.band.length; i < len; i++) {
                new_band.push(this.automat.cell_step(this.band, i));
            }
            this.band = new_band;
            this.print_band();
            
            if(this.automat.check_finish(this.band)){
                 $("#output", this.$el).append("<div class='alert alert-success'>Fertig</div>");
                 if(this.interval){
                    clearInterval(this.interval);
                 }
            }
             
         },
         
         print_band: function(){
            var cell_width = 100 / this.band.length;
            var band_content = "";
            
            for (var i = 0, len = this.band.length; i < len; i++) {
                
                band_content += "<div style='float:left; width:" + cell_width + "%;'>";
                for (var i2 = 0, len2 = this.band[i].length; i2 < len2; i2++) {
                    band_content += "<div style='padding: 5px 0; text-align: center;'>" + this.band[i][i2] + "</div>";
                }
                 band_content += "</div>";   
            }
            
            if($("#sel-output", this.$el).val().startsWith("interval")){
                $("#output", this.$el).html("");
            }
            
            $("#output", this.$el).append("<div class='clearfix' style='background-color: #EFEFEF; margin-bottom: 10px;'>" + band_content + "</div>");
        },
         
         reset: function(){
             this.automat = null;
             $("#output", this.$el).html("");
             $("#sel-type", this.$el).prop("disabled", false);
             $("#text-input", this.$el).prop("disabled", false);
             $("#sel-output", this.$el).prop("disabled", false);
             $("#bt-step", this.$el).prop("disabled", false);
             $("#bt-step", this.$el).removeClass("disabled");
             
             if(this.interval){
                 clearInterval(this.interval);
             }
         }
    });
