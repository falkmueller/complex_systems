if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
    
app.views.automatD1 = app.view.$extend({

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
        var default_value = app.automat.d1[$("#sel-type", this.$el).val()].default_value;
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
        this.automat = app.automat.d1[$("#sel-type", this.$el).val()];

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
