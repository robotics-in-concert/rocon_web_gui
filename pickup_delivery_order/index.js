var ros = new ROSLIB.Ros();

// remapping rules setting
var send_order_pub = "send_order"
var send_order_pub_type = "simple_delivery_msgs/DeliveryOrder"

//sub
var delivery_status_sub_topic = "delivery_status";
var delivery_status_sub_type = "simple_delivery_msgs/DeliveryStatus";


var tables_sub_topic = "tables";
var tables_sub_topic_type = "yocs_msgs/WaypointList"

var defaultUrL = "";
var discard_btn_list = "";

//parameter setting
if (rocon_interactions.hasOwnProperty('rosbridge_uri')){
    defaultUrL = rocon_interactions.rosbridge_uri;
}else{
    defaultUrL = 'localhost';
}

if (rocon_interactions.parameters.hasOwnProperty('discard_btn_name')){
    discard_btn_list = rocon_interactions.parameters.discard_btn_name;
}else{
    discard_btn_list = "";
}

console.log(rocon_interactions.parameters);
console.log(discard_btn_list);

if(tables_sub_topic in rocon_interactions.remappings)
  tables_sub_topic = rocon_interactions.remappings[tables_sub_topic];

if(send_order_pub in rocon_interactions.remappings)
	send_order_pub = rocon_interactions.remappings[send_order_pub];

// remapping rules setting
if(delivery_status_sub_topic in rocon_interactions.remappings)
  delivery_status_sub_topic = rocon_interactions.remappings[delivery_status_sub_topic];


// public var
var row_max_num = 3;
var delivery_goal = "";
var parsing_list = ['Distance','Remain Time','Message'];
var uuid = ''
//ros action
var deliver_order_client;


$().ready(function(e){
  // setting ros callbacks()
  settingROSCallbacks();
  ros.connect(defaultUrL);
});

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
    
    var tables_listener = new ROSLIB.Topic({
      ros : ros,
      name : tables_sub_topic,
      messageType: tables_sub_topic_type
      });
    tables_listener.subscribe(processTableListUpdate);

    var delivery_status_listener = new ROSLIB.Topic({
      ros : ros,
      name : delivery_status_sub_topic,
      messageType: delivery_status_sub_type
      });
    delivery_status_listener.subscribe(processDeliveryStatusUpdate);

    showMainMenu(true);
  }

  );
  ros.on('error',function(e) {
    console.log("Error!",e);
  }
  );

  ros.on('close',function() {
    console.log("Connection Close!");
    //alert("ROS Connection Close!");
  }
  );
}

function settingDummyGreenButton(){
  var option = {};
  option["ros"] = ros;
  option["topic_type"] = "kobuki_msgs/DigitalInputEvent";
  option["topic_name"] = "mobile_base/events/digital_input";
  initDummyGreenButton(option);
  $(".sd-dummy-green-btn").click(pubDummyGreenButtonPressingSignal);
}

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
  $(".sd-delivery-status-layer").html("");
}


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
  return sortable_menu;
}

function processTableListUpdate(data){
  var menu = processFilterSortMenu(data.waypoints);
  settingMainMenu(menu);
}

function setBattPecent(obj, data){
    var text = $(obj).text();
    $(obj).text(text.split(':')[0]+': ' + data+' %');
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
      var order_location = data.currentTarget.outerText
      $('.sd-goal-msg').text(order_location);
      //send order
      uuid = generateUUID()
      //hardcoded
      var order = new ROSLIB.Message({
        order_id : uuid,
        receivers : [{location: order_location, qty : 1, menus:[]}]
      });
      deliver_order_client.publish(order)
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

current_order_status = 10
function processDeliveryStatusUpdate(data){
  console.log(data);
  if (data.order_id == uuid) {
    current_order_status = data.status;

    if(current_order_status == 80) {
      showMainMenu(true);
    }
  }
  else{
    console.log(uuid)
    console.log(data.uuid)
    console.log('other delivery status')
  }
};
