/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

   //Edge symbol: 'stage'
   (function(symbolName) {
      
      
      Symbol.bindElementAction(compId, symbolName, "document", "compositionReady", function(sym, e) {
         // insert code to be run when the composition is fully loaded here
         /*
         menu.json으로부터 주문 가능한 메뉴의 이미지와 이름을 불러옴
         */
         console.log("menu.json loaded");
         var menu_data;
         $.getJSON('menu.json', function(menu_data) {
         console.log(menu_data.length);
         for(var i=0; i<menu_data.length; i++){
         	var s = sym.createChildSymbol("menu","Stage");
         	s.$("photo").css({"background-image":"url('"+menu_data[i].image+"')"});
         	s.$("title").html(menu_data[i].title);
         	s.getSymbolElement().css({"float":"left", "margin":"10px", "top" : "100px"});
         	}
         });

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

   //=========================================================
   
   //Edge symbol: 'menu'
   (function(symbolName) {   
   
   })("menu");
   //Edge symbol end:'menu'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "EDGE-67918046");