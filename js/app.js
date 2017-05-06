var app = {
         config: {},
         views: {},
         store:{},
         
         route: function(viewName, params){
             if(app._currentView){
                 app._currentView._off(); 
                 app._currentView.off();
             }
             
             if(app.views[viewName]){
                app._currentView = new app.views[viewName]($("main"),params);
                app._currentView.render();
             } else {
                console.log("ROUTE NOT FOUND");
             }
         },
         
         view: Class.$extend({
             params: {},
             $el: null,
             
             events: [],
             
             render: function(){
                 console.log("render function not implemented");
             },
     
             __init__ : function($el, params) {
                 this.params = params;
                 this.$el = $el;
                 this._bindEvents(this.events);
             },
             
             _bindEvents: function(){
                 var me = this;
                 $(this.events).each(function(i, event){
                     if(me[event[2]]){
                         me._on(event[0], event[1], me[event[2]]);
                     }
                 });
             },
             
             off: function(){
                
             },
             
             _off: function(event, selector){
                 if (typeof event === "undefined" || event === null) { 
                     this.$el.off();
                 }
                 else if (typeof selector === "undefined" || selector === null){
                     this.$el.off(event);
                 } else {
                     this.$el.off(event, selector);
                 }
             },
             
             _on: function(event, selector, callback){
                 var me = this;
                 this.$el.on(event, selector, function(){ callback.apply(me, arguments)} );
             }
         }),
         
         start: function(){
             routie({
                '': function() {
                  app.route('automat', {});
                },
                '/:view': function(viewrName) {
                   app.route(viewrName, {});
                },
                '/:view/*': function(viewrName, params) {
                    var paramsObj = {};
                    var params_split = params.split("/");
                    for(var i = 0; i < params_split.length; i = i + 2){
                        if(params_split[i].length > 0){
                            paramsObj[params_split[i]] = params_split[i+1];
                        }
                    }

                   app.route(viewrName, paramsObj);
                }
              });
         }
     };
