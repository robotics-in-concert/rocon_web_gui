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
         		s.getSymbolElement().css({"float":"left", "margin":"10px", "top" : "100px", "left" : "50px"});
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
         //var discard_btn_list = "";
         sym.setVariable("order_progressing",false);
         
         //parameter setting
         if (rocon_interactions.hasOwnProperty('rosbridge_uri')){
         	defaultUrL = rocon_interactions.rosbridge_uri;
         }else{
         	defaultUrL = 'localhost';
         }
         console.log("defaultUrL : " + defaultUrL);
         /*
         if (rocon_interactions.parameters.hasOwnProperty('discard_btn_name')){
         	discard_btn_list = rocon_interactions.parameters.discard_btn_name;
         }else{
         	discard_btn_list = "";
         }
         */
         console.log(rocon_interactions.parameters);
         //console.log(discard_btn_list);
         
         if(send_order_pub in rocon_interactions.remappings)
         	send_order_pub = rocon_interactions.remappings[send_order_pub];
         
         // remapping rules setting
         if(delivery_status_sub_topic in rocon_interactions.remappings)
           delivery_status_sub_topic = rocon_interactions.remappings[delivery_status_sub_topic];
         /*
         var delivery_status_list = {
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
         */
         // public var
         var row_max_num = 3;
         var delivery_goal = "";
         var parsing_list = ['Distance','Remain Time','Message'];
         //var order_id = ''
         
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
         /*
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
         */
         function processDeliveryStatusUpdate(data){
           //console.log("Process Deliver Status - id :"+data.order_id);
           var current_order_id = sym.getVariable("order_id");
           //console.log("current order id :"+current_order_id);
           if (data.order_id == current_order_id) {
	        	 switch (data.status)
         	 {
         	 	case 10 : 
         	 		sym.getSymbol("progress_status").play();
         	 		sym.getSymbol("progress_status").$("status_txt").html("YujinRobot Smart Cafe");
         	 		break;
         	 	case 20 : 
         	 		sym.getSymbol("progress_status").stop(110);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Robot is going to frontdesk");
         	 		break;
         	 	case 30 : 
         	 		sym.getSymbol("progress_status").stop(220);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Arrived at frontdesk");
         	 		break;
         	 	case 40 : 
         	 		sym.getSymbol("progress_status").stop(330);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Preparing ordered drink");
         	 		break;
         	 	case 51 : 
         	 		sym.getSymbol("progress_status").stop(440);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Robot is going to receiver");
         	 		break;
         	 	case 52 : 
         	 		sym.getSymbol("progress_status").stop(550);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Arrived at receiver");
         	 		break;
         	 	case 53 : 
         	 		sym.getSymbol("progress_status").stop(660);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Take your order and press robot's green button");
         	 		break;
         	 	case 54 : 
         	 		sym.getSymbol("progress_status").stop(770);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Delivery complete");
	        	 		break;
         	 	case 70 : 
         	 		sym.getSymbol("progress_status").stop(880);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Return to dock");
         	 		break;
         	 	case 80 : 
         	 		sym.getSymbol("progress_status").stop(1000);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Return complete");
         	 		sym.getSymbol("order_btn").$("order_btn_bg")[0].style.backgroundColor = "#3c5dd4";
 						sym.setVariable("order_progressing",false);
         	 		break;
         	 	case -10 : 
         	 		sym.getSymbol("progress_status").stop(110);
         	 		sym.getSymbol("progress_status").$("status_txt").html("Error");
         	 		break;
         	 }
           }
           else{
         	 console.log('other delivery status');
         	 console.log(current_order_id);
         	 console.log(data.order_id);
           }
         };

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${order_btn}", "click", function(sym, e) {
         // insert code for mouse click here
        /*
        Order button action
        */
        var qty = sym.getVariable("total_qty");
        if(typeof qty != "undefined") {
         	console.log("total qty:"+qty.toString());
         	if(qty > 0 && sym.getVariable("order_progressing") == false) {
        		var menus = [];
        		menus.push(sym.getVariable("menus"));
        		//var menus = sym.getVariable("menus");
        		var order_id = uuid();
        		sym.setVariable("order_id",order_id);
        		var order = new ROSLIB.Message({
        			  order_id : order_id,
        			  receivers : [{'location': "sw_team", 'qty' : qty, 'menus':menus}]
        		});
         		console.log(order);
         		deliver_order_client.publish(order);
         		sym.setVariable("order_progressing",true);
         		sym.getSymbol("order_btn").$("order_btn_bg")[0].style.backgroundColor = "#c8d1f3";
         		sym.getSymbol("progress_status").$("status_txt").html("Order received.");
         	}
        }
        else {
         	console.log("qty is undefined");
         }
        
        

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

   //=========================================================
   
   //Edge symbol: 'progress_status'
   (function(symbolName) {   
   
   })("progress_status");
   //Edge symbol end:'progress_status'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "EDGE-67918046");