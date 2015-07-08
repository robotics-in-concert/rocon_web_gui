var ros = new ROSLIB.Ros();

var defaultUrL = "";
var target = "";
var config_values = {};

//pub
var send_order_publisher;
var send_order_pub_topic = "send_order";
var send_order_pub_type = "simple_delivery_msgs/DeliveryOrder"

//sub
var delivery_status_sub_topic = "delivery_status";
var delivery_status_sub_type = "simple_delivery_msgs/DeliveryStatus";

// remapping rules setting
if(delivery_status_sub_topic in rocon_interactions.remappings)
  delivery_status_sub_topic = rocon_interactions.remappings[delivery_status_sub_topic];

if(send_order_pub_topic in rocon_interactions.remappings)
  send_order_pub_topic = rocon_interactions.remappings[send_order_pub_topic];


//parameter setting
if (rocon_interactions.hasOwnProperty('rosbridge_uri')){
    defaultUrL = rocon_interactions.rosbridge_uri;
}else{
    defaultUrL = 'localhost';
}
if (rocon_interactions.parameters.hasOwnProperty('extra_data')){
    target = rocon_interactions.parameters.extra_data;
}else{
    target = "conf_room";
}

config_values['target'] = target;

// public variable
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

//menu item setting
var menu_list = {
                    "COKE":{"name":'COKE',
                     "disable_img":"./img/coke_disable.png",
                     "img_qty_1"   :"./img/coke.png",
                     "img_qty_2"   :"./img/coke_2.png",
                     "click_count" : 0},
                    "WELCHS":{"name":'WELCHS',
                     "disable_img" :"./img/welchs_disable.png",
                     "img_qty_1"    :"./img/welchs.png",
                     "img_qty_2"    :"./img/welchs_2.png",
                     "click_count" : 0},
                    }; 

//ui setting
var currentDiv = 0;
var divList = ['intro-layer', 'menu-layer', 'deliverying-layer', 'waiting-confirm-layer','end-layer'];
var max_order_count = 2;
var is_showing_modal = false;
var cur_order_drinks = [];

//order setting
var id = "";
var current_order_status = 10;

$().ready(function(e){
  initDiv();
  initEvent();
  // setting ros callbacks
  settingROSCallbacks();
  ros.connect(defaultUrL);
});

function initEvent(){
  // intro-layer
  $(".yes-btn-intro-layer").click(function(){
    updateDiv(currentDiv + 1);
    initMenu();
  });
  
  //menu-layer
  $(".yes-btn-menu-layer").click(function(){
    showConfirmModal()
  });
  $(".no-btn-menu-layer").click(function(){
    updateDiv(currentDiv - 1);
  });

  //confirm modal
  $(".yes-btn-modal-layer").click(function(){
    updateDiv(currentDiv + 1);
    sendOrder();
  });
}

function initDiv(){
  updateDiv(currentDiv);
}

function initMenu(){
  //init menu layer
  $(".menu-img-grp-menu-layer").html("");
  var menu_item_cnt = 0;
  var context = "";
  for (menu in menu_list){
    menu_list[menu].click_count = 0;
    switch(menu_item_cnt % 2){
      case 0:
        context += '<img src="'+ menu_list[menu].disable_img +'" class="col-xs-4 col-xs-offset-1 menu-layer-drink-img ' + menu_list[menu].name +'">'
      break;
      case 1:
        context += '<img src="'+ menu_list[menu].disable_img +'" class="col-xs-4 col-xs-offset-2 menu-layer-drink-img ' + menu_list[menu].name +'">'
      break;
    }
    menu_item_cnt +=1;
  }
  $(".menu-img-grp-menu-layer").html(context);
  cur_order_drinks = []
  //init menu layer event
  $(".menu-layer-drink-img").click(function(data){
    class_name = data.currentTarget.classList[data.currentTarget.classList.length -1];
    img_src = $("img."+class_name).attr("src");
    if (cur_order_drinks.length > max_order_count -1 ){
      for (var i = cur_order_drinks.length - 1; i >= 0; i--) {
        idx = jQuery.inArray( class_name, cur_order_drinks)
        if (idx >= 0 ){
          cur_order_drinks.splice(idx,1);
          $("img."+class_name).attr("src",menu_list[class_name].disable_img);
          menu_list[class_name].click_count = 0;
        }  
      };
    }
    else{
      if(menu_list[class_name].click_count == 0){
        $("img."+class_name).attr("src", menu_list[class_name].img_qty_1);
        cur_order_drinks.push(class_name);
        menu_list[class_name].click_count = 1;
      }
      else if(menu_list[class_name].click_count == 1){
        $("img."+class_name).attr("src", menu_list[class_name].img_qty_2);
        cur_order_drinks.push(class_name);
        menu_list[class_name].click_count = 2;
      }
      else{
        $("img."+class_name).attr("src",menu_list[class_name].disable_img);
        idx = jQuery.inArray( class_name, cur_order_drinks)
        cur_order_drinks.splice(idx,1);
        cur_order_drinks.splice(idx,1);
        menu_list[class_name].click_count = 0;
      }
    }
    if( cur_order_drinks.length === 0){
      $("img."+'cancel-img-btn').attr("src",'./img/3_order_button_cancel_disabled.png');
      $("img."+'order-img-btn').attr("src",'./img/3_order_button_order_disabled.png');
    }
    else{
      $("img."+'cancel-img-btn').attr("src",'./img/3_order_button_cancel_off.png');
      $("img."+'order-img-btn').attr("src",'./img/3_order_button_order_off.png');
    }
  }); 
}

function updateDiv(target_div){
  if(target_div < 0 || target_div > divList.length-1){
    target_div = 0;
  }

  for(var i = 0 ; i < divList.length ; i ++ ){
    if (target_div === i){
      $('.' + divList[i]).show();  
    }
    else{
      $('.' + divList[i]).hide();  
    }
  }
  currentDiv = target_div;
}

function showConfirmModal(){
  $('.drink-img-grp-modal-layer').html("");
  context = '';
  for (var i = 0 ; i < cur_order_drinks.length; i++) {
    menu = cur_order_drinks[i];
    switch(i % 2){
      case 0:
        context += '<img src="'+ menu_list[menu].img_qty_1 +'" class="col-xs-4 col-xs-offset-1">'
      break;
      case 1:
        context += '<img src="'+ menu_list[menu].img_qty_1 +'" class="col-xs-4 col-xs-offset-2">'
      break;
    }
  };  
  $('.drink-img-grp-modal-layer').html(context);
  $('#confirm-modal').modal('show');
}

function sendOrder(){
  id = uuid()
  //hardcoded
  var order = new ROSLIB.Message({
    order_id : id,
    receivers : [{location: config_values['target']+"", qty : 1, menus:cur_order_drinks}]
  });
  send_order_publisher.publish(order)
  console.log("order: ",order, send_order_publisher)
}

function settingROSCallbacks(){
  ros.on('connection',function() {
    console.log("Connected");
    var delivery_status_listener = new ROSLIB.Topic({
      ros : ros,
      name : delivery_status_sub_topic,
      messageType: delivery_status_sub_type
      });
    delivery_status_listener.subscribe(processDeliveryStatusUpdate);

    //setting publisher
    send_order_publisher = new ROSLIB.Topic({
        ros : ros,
        name : send_order_pub_topic,
        messageType : send_order_pub_type
    });
  }

  );
  ros.on('error',function(e) {
    console.log("Error!",e);
    $(".rosbridge-connection-info").html("Error: "+ e);
  }
  );

  ros.on('close',function() {
    console.log("Connection Close!");
    $(".rosbridge-connection-info").html("Connection Close!");
  }
  );
};


function processDeliveryStatusUpdate(data){
  if (data.order_id == id) {
    if(current_order_status != data.status){
      current_order_status = data.status;
      if(current_order_status == 53){ //"WAITING_CONFIRM_RECEIVER"
        updateDiv(currentDiv + 1);
      }
      else if(current_order_status == 60){ //"COMPLETE_ALL_DELIVERY"
        updateDiv(currentDiv + 1);
        setTimeout(function(){
          updateDiv(currentDiv + 1)
        },3000);
      }
    }
    $('.delivery-status-deliverying-layer').html('<b>'+ delivery_status_list[data.status].replace(/_/g,"-") +'</b>')
  }
};
