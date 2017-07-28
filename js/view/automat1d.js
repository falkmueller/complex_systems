app.automat1d = {};
    app.automat1d.palindrom = {
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
            else if(left[3] == ">"){
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
    
    app.views.automat1d = app.view.$extend({
        
        events: [
             ["click", "#bt-reset", "reset"],
             ["click", "#bt-step", "step"],
         ],
        
        render: function(){
             
             this.$el.load( "views/automat1d.html", function() {
                 
             });
         },
         
         band: null,
         automat: null,
         
         start: function(){
            var word = $("#text-input", this.$el).val();
            if(word.length == 0){
                alert("Bitte gebe ein Wort ein.");
                return;
            } 

            $("#sel-type", this.$el).prop("disabled", true);
            $("#text-input", this.$el).prop("disabled", true);
            this.band = [];
            this.automat = app.automat1d.palindrom;

            for (var i = 0, len = word.length; i < len; i++) {
                this.band.push([word[i]]);
            }

            this.print_band();
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
            
            $("#output", this.$el).append("<div class='clearfix' style='background-color: #EFEFEF; margin-bottom: 10px;'>" + band_content + "</div>");
        },
         
         reset: function(){
             this.automat = null;
             $("#output", this.$el).html("");
             $("#sel-type", this.$el).prop("disabled", false);
             $("#text-input", this.$el).prop("disabled", false);
         }
    });
