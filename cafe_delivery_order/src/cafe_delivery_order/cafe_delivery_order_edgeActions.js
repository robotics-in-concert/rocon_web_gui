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
      var ros;
      var deliver_order_client;
      
      Symbol.bindElementAction(compId, symbolName, "document", "compositionReady", function(sym, e) {
         // insert code to be run when the composition is fully loaded here
         /*
         menu.json으로부터 주문 가능한 메뉴의 이미지와 이름을 불러옴
         */
         console.log("menu.json loaded");
         
         var menu_data;
         var arr = new Array();
         sym.setVariable("menuArray", arr);
         
         $.getJSON('menu.json', function(menu_data) {
         	console.log("menu list size :" + menu_data.length);
         
         	var compId = sym.getComposition().getCompId();	
         	for(var i=0; i<menu_data.length; i++){
         		//var j = "menu"+i.toString();
         		//console.log(j);
         		//Create an instance element of a symbol as a child of the given parent element 
         		var s = sym.createChildSymbol("menu","Stage");
         		//Symbol.bindSymbolAction(compId, "menu", "creationComplete", function(sym, e) {
         			//console.log("creation Complete");    
         		//});
         		//set the value of a Symbol variable
         		s.setVariable("id", i);
         		s.setVariable("name", menu_data[i].title);
         		s.setVariable("qty", 0);
         		s.$("photo").css({"background-image":"url('"+menu_data[i].image+"')"});
         		s.$("title").html(s.getVariable("name"));
         		s.getSymbolElement().css({"float":"left", "margin":"10px", "top" : "100px"});
         		//push it into the array
         		arr.push(s);
         	}	
         
         	arr.forEach(function(symbolInTheArray){
         		var menuItem = $(symbolInTheArray);
         		//create a jQuery reference to the DIV element inside the symbol.
         		var menuElement = $(symbolInTheArray.getSymbolElement());
         		//now you can bind interactivity to the menu items' DIVs
         		menuElement.bind ("click",function(){
         			//console.log("Clicked " + symbolInTheArray.getVariable("id"));
         			//console.log(menuItem);
         			var qty = symbolInTheArray.getVariable("qty");
         			//3 should be parameterize later
         			if(qty < 3) {
         				qty = qty + 1;
         			} else {
         				qty = 0;
         			}
         			symbolInTheArray.setVariable("qty", qty);
         			var div = symbolInTheArray.$("menu_bg")[0];
         			if(qty > 0) {
         				symbolInTheArray.$("title").html(symbolInTheArray.getVariable("name")+"  Qty: "+qty.toString());
         				div.style.backgroundColor = "#3c5dd4";
         			}
         			else {
         				div.style.backgroundColor = "#c8d1f3";
         				//sym.getSymbol("order_btn").$("order_btn_txt").toggle();
         
         				symbolInTheArray.$("title").html(symbolInTheArray.getVariable("name"));
         			}
         			update_order_msg();
         		});
         		//menuElement.bind ("mouseover",function(){menuElement.animate({opacity: 0.2, left:"-=25px"});});
         		//menuElement.bind ("mouseout",function(){menuElement.animate({opacity: 1, left:"+=25px"});});
         	});
         });
         
         function update_order_msg(){
         	if(typeof arr == "undefined") {
         		console.log("stored menu array is undefined");
         		return false;
         	}
         	else {
         		var total_qty = 0;
         		var menus = ""
         		for(var i=0; i<arr.length; i++) {
         			var order_in_array = arr[i];
         			var temp_qty = order_in_array.getVariable("qty");
         			total_qty = total_qty + temp_qty;
         			if(temp_qty > 0)
         				menus = menus + order_in_array.getVariable("name")+":"+temp_qty.toString()+",";
         			//console.log(order_array.getVariable("qty"));
         		}	           
         		sym.setVariable("total_qty",total_qty);
         		sym.setVariable("menus",menus);
         		if(total_qty > 0) {
         			sym.getSymbol("order_btn").$("order_btn_txt").html("Order");
         			sym.getSymbol("order_btn").$("order_btn_txt").css("color","white");
         			sym.getSymbol("order_btn").$("order_btn_bg")[0].style.backgroundColor = "#3c5dd4";
         		}
         		else {
         			sym.getSymbol("order_btn").$("order_btn_txt").html("Select");
         			sym.getSymbol("order_btn").$("order_btn_txt").css("color","#3c5dd4");
         			sym.getSymbol("order_btn").$("order_btn_bg")[0].style.backgroundColor = "#c8d1f3";
         		}
         		console.log("Total:"+total_qty.toString(10));
         		console.log(menus);
         		return true;
         	}
         };
         

      });
      //Edge binding end
      
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         // insert code to be run when the symbol is created here
         console.log("Loading ROS libraries");
         ros = new ROSLIB.Ros();
         console.log("remapping rules setting");
         var send_order_pub = "send_order";
         var send_order_pub_type = "simple_delivery_msgs/DeliveryOrder";
         //sub
         var delivery_status_sub_topic = "delivery_status";
         var delivery_status_sub_type = "simple_delivery_msgs/DeliveryStatus";
         var defaultUrL = "";
         var discard_btn_list = "";
         
         //parameter setting
         if (rocon_interactions.hasOwnProperty('rosbridge_uri')){
         	defaultUrL = rocon_interactions.rosbridge_uri;
         }else{
         	defaultUrL = 'localhost';
         }
         console.log("defaultUrL : " + defaultUrL);
         if (rocon_interactions.parameters.hasOwnProperty('discard_btn_name')){
         	discard_btn_list = rocon_interactions.parameters.discard_btn_name;
         }else{
         	discard_btn_list = "";
         }
         console.log(rocon_interactions.parameters);
         console.log(discard_btn_list);
                  
         if(send_order_pub in rocon_interactions.remappings)
         	send_order_pub = rocon_interactions.remappings[send_order_pub];
         
         // remapping rules setting
         if(delivery_status_sub_topic in rocon_interactions.remappings)
           delivery_status_sub_topic = rocon_interactions.remappings[delivery_status_sub_topic];
         
         delivery_status_list = {
         "10" : "IDLE",
         "20" : "GO_TO_FRONTDESK",
         "30" : "ARRIVAL_AT_FRONTDESK",
         "40" : "WAITING_FOR_FRONTDESK",
         "51" : "GO_TO_RECEIVER",
         "52" : "ARRIVAL_AT_RECEIVER",
         "53" : "WAITING_CONFIRM_RECEIVER",
         "54" : "COMPLETE_DELIVERY",
         "60" : "COMPLETE_ALL_DELIVERY",
         "70" : "RETURN_TO_DOCK",
         "80" : "COMPELTE_RETURN",
         "-10" : "ERROR"
         }
         
         // public var
         var row_max_num = 3;
         var delivery_goal = "";
         var parsing_list = ['Distance','Remain Time','Message'];
         var id = ''
                  
         settingROSCallbacks();
         ros.connect(defaultUrL);
         
         function settingROSCallbacks()
         {
         	 ros.on('connection',function() {
         	 console.log("Connected");
         	 // subscribe to order list
         
         	 deliver_order_client = new ROSLIB.Topic({
         		ros : ros,
         		name: send_order_pub,
         		messageType: send_order_pub_type 
         	 });
         
         	var delivery_status_listener = new ROSLIB.Topic({
         		ros : ros,
         		name : delivery_status_sub_topic,
         		messageType: delivery_status_sub_type
         		});
         	 delivery_status_listener.subscribe(processDeliveryStatusUpdate);
         	}
         
         	);
         	ros.on('error',function(e) {
         	 	console.log("Error!",e);
         	});
         
         	ros.on('close',function() {
         		console.log("Connection Close!");
         	 	//alert("ROS Connection Close!");
         	});
         };
         
         function parsingDeliveryStatus(data, parsing_list){
         	var parsing_data ={}
         	var main_status = data.replace(/\s/g,'').split('[')[0].split('Status:')[1];
         	var detail_status = data.replace(/\s/g,'').split('[')[1].replace(']','').split(',');
         	parsing_data["Status"] = main_status;
         	for (var i = 0; i < detail_status.length; i++) {
         	 var value = detail_status[i];
         	 parsing_list.forEach(function(parsing_text){
         		var parsing_text_without_space = parsing_text.replace(/\s/g,'');
         		if(value.indexOf(parsing_text_without_space ) != -1){
         		  parsing_data[parsing_text]  = value.replace(parsing_text_without_space ,'').split(':')[1];
         		}
         	 })
         	};
         	return parsing_data;
         }
         
         function showDeliveryStatus(data){
           //$(".sd-delivery-status-layer").html(delivery_status_list[current_order_status+""]);
         };
         
         /*
         랜드마크 목록의 정렬
         */
         /*
         function processFilterSortMenu(data){
         	var menu = [];
         	var sortable = [];
         	//filter
         	for (var i = 0; i < data.length; i++) {
         	 var allow_flag = true;
         	 var disard_btns = "";
         	 if( typeof(discard_btn_list) === "string"){
         		 disard_btns = discard_btn_list.replace(/\[/g,'').replace(/\]/g,'').replace(/\s/g,'').split(',');
         	 }
         	 else if(typeof(discard_btn_list) === "object"){
         		disard_btns = discard_btn_list;
         	 }
         
         	 disard_btns.forEach(function(discard_name){
         		if (discard_name.indexOf(data[i].name) == -1){
         		  allow_flag = allow_flag&true;
         		}
         		else{
         		  allow_flag = allow_flag&false;
         		}      
         	 });
         
         	 if(allow_flag){
         		menu.push(data[i]);
         	 }
         	 else{
         	 }
         	};
         	//sort by name
         	sortable_menu = menu.sort(function (a,b) {
         	 if (a.name < b.name)
         		 return -1;
         	 if (a.name > b.name)
         		 return 1;
         	});
         	for (var i = 0; i < sortable_menu.length; i++) {
         	console.log("table :"+sortable_menu[i].name);
         	}
         
         	return sortable_menu;
         
         }
         */
         
         /*
         랜드마크 정보를 받아서 화면에 버튼으로 표시
         */
         /*
         function processTableListUpdate(data){
           var menu = processFilterSortMenu(data.waypoints);
           settingMainMenu(menu);
         }
         */
         
         function setBattPecent(obj, data){
         	 //var text = $(obj).text();
         	 //$(obj).text(text.split(':')[0]+': ' + data+' %');
         }
         
         function getBattPecent(data){
         	 var percent = '-1';
         	 var charge = -1;
         	 var capacity = -1;
         	 for (var i = 0; i < data.length; i++) {
         		var key = data[i].key;
         		if(key === 'Charge (Ah)'){
         			charge = data[i].value;
         		}
         		else if(key === 'Capacity (Ah)'){
         			capacity = data[i].value;
         		}
         	 };
         	 if( charge === -1 || capacity === -1){
         		percent = -1;  
         	 }
         	 else{
         		percent = 100 * charge / capacity;
         	 } 
         	 return percent.toFixed(2);
         };
         
         /*
         function settingMainMenu(data){
           var row_num = 0;
           $('.sd-main-menu').html("");
           for (var i = 0; i < data.length; i++) {
         	 var table_name = data[i].name;
         	 if(i % row_max_num === 0){
         		row_num += 1;
         		$('.sd-main-menu').append('<div class="row-fluid sd-table-row-num-' + row_num + '">');
         	 }
         	 $('.sd-table-row-num-' + row_num).append('<button type="button" class="span4 btn btn-primary btn-large sd-table-list sd-table-' + table_name + '">' + table_name + '</button>')  
         
         	 $('.sd-table-'+table_name).click(function(data){
         		var order_location = data.currentTarget.outerText;
         		$('.sd-goal-msg').text(order_location);
         		send order
         		id = uuid();
         		hardcoded
         		var order = new ROSLIB.Message({
         		  order_id : id,
         		  receivers : [{location: order_location, qty : 1, menus:[]}]
         		});
         		deliver_order_client.publish(order);
         		showMainMenu(false);
         	 });
           };
         };
         
         
         function showMainMenu(flag){
         	 if(flag === true){
         				$('.sd-main-menu-layer').show();
         				$('.sd-delivery-status').hide();
         		 }
         	 else{
         		$('.sd-main-menu-layer').hide();
         		$('.sd-delivery-status').show();
         	 }
         };
         */
         
         current_order_status = 10;
         function processDeliveryStatusUpdate(data){
           console.log("Process Deliver Status: "+data);
           if (data.order_id == id) {
         	 current_order_status = data.status;
         	 //$(".sd-delivery-status-layer").html(delivery_status_list[current_order_status+""]);
         	 if(current_order_status == 60) {
         		//showMainMenu(true);
         	 }
           }
           else{
         	 console.log('other delivery status');
         	 console.log(id);
         	 console.log(data.id);
           }
         };

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

   //=========================================================
   
   //Edge symbol: 'menu'
   (function(symbolName) {   
   
      

   })("menu");
   //Edge symbol end:'menu'

   //=========================================================
   
   //Edge symbol: 'order_btn'
   (function(symbolName) {   
   
   })("order_btn");
   //Edge symbol end:'order_btn'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "EDGE-67918046");