var ros = new ROSLIB.Ros();
var defaultUrL = rocon_interactions.rosbridge_uri;

var robots = {}

var viewer;
var map_origin;
var gridClient;
var waypoint_poller;
var ar_region_poller;
var pickup_nav_div;
var vm_nav_div;

//set sub
var pickup_order_list_sub_topic_name = 'pickup_order_list';
var vm_order_list_sub_topic_name = 'vm_order_list';
var order_list_sub_topic_type = 'simple_delivery_msgs/OrderList';


//remapping pub
if(pickup_order_list_sub_topic_name in rocon_interactions.remappings)
  pickup_order_list_sub_topic_name = rocon_interactions.remappings[pickup_order_list_sub_topic_name];

if(vm_order_list_sub_topic_name in rocon_interactions.remappings)
  vm_order_list_sub_topic_name = rocon_interactions.remappings[vm_order_list_sub_topic_name];

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


$().ready(function(e) {
  pickup_nav_div= $('#nav-pickup-orders');
  vm_nav_div= $('#nav-vm-orders');
  var nw = $('#nav-wrapper');
  nw.css('margin-top','20pt');
  initRobotList();
  initHeader();
  initViewer();

});

function initHeader()
{
  settingROSCallbacks();
  ros.connect(defaultUrL);
  $('#focusedInput').val(''+defaultUrL);
}

function initViewer() {

  createViewer();
  addMap();
  addRegionViz();
  addNavigators();
  addRobotStatus();
}

function initRobotList(){
  var robot1 = rocon_interactions.parameters['robot1'];
  var robot2 = rocon_interactions.parameters['robot2'];
  var robot3 = rocon_interactions.parameters['robot3'];

  [robot1, robot2, robot3].forEach(function(r){
    robots[r] = {};
    robots[r]['name'] = r;
    robots[r]['pose_topic'] = '/' + r + '/robot_pose';
    robots[r]['status_topic'] = '/' + r + '/robot_status';
    robots[r]['viewer_obj'] = null;
    robots[r]['status_obj'] = null;
  })
}

function createViewer() {
  
  div = $('#view');
  div.css('margin-top','20pt');

  var width = div.width();
  var half_window = $(window).height() -300;
  var height = half_window;// < 200?200:half_window;
  console.log('half_window: ', half_window);
  $(".order-list").css('max-height',height);
  viewer = new ROS2D.Viewer({
    divID : 'view',
    width: width,
    height: height,
    background: '#DDDDDD'
  });

  viewer.scene.mouseEnabled = true;
  createjs.Touch.enable(viewer.scene);
  

   $(window).resize(function(e) {
     console.log("resize event");
     div = $('#view');
     div.css('margin-top','20pt');
     var width = div.width();
     var half_window = $(window).height()-300;
     var height = half_window;// < 200?200:half_window;
     viewer.resizeCanvas(width,height);
     viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
   });
}

function addMap() {
  var continuous = false;
  var map_topic = rocon_interactions.remappings['map'] || 'map';

  gridClient = new ROS2D.OccupancyGridClient({
    ros : ros,
    topic : map_topic,
    rootObject : viewer.scene,
    compression: 'none'
  });

  // Scale the canvas to fit to the map
  gridClient.on('change', function(map_origin) {
     map_origin = map_origin;
     viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
  });
}

function addRobotStatus() {
  gridClient.on('change', function(map_origin) {
    var robot_status_topic_type = 'simple_delivery_msgs/RobotStatus';
    for (var r in robots){
      var robot = robots[r];
      var robot_name = robot['name'];

      var context = '';
      context += '<div class="span3">'
      context += '<div class="input-group"><input type="text" class="form-control robot-names ' + robot_name + '-robot-name" \
                    placeholder="Robot name" aria-describedby="basic-addon1" value="' + robot_name + '"></div>'
      context += '<h5 class=' + robot_name + '-robot-status>' + 'None' + '</h5>'
      context += '<div class="progress"><div class="progress-bar ' + robot_name + '-battery-status" \
                    role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 100%;">\
                    100%\
                    </div></div>';
      context += '</div>'

      $('.robots-status').append(context);
      $('.' + robot_name + '-robot-status').css('word-break','break-word');
      $('.' + robot_name + '-robot-name').change(function(evt) {
        robot_name = evt.currentTarget.className.split(" ")[2].split("-robot-name")[0];
        changed_robot_name = $(this).val();
        robots[robot_name]['status_obj'] = new RobotStatus({
            ros : ros,
            robot_name : robot_name,
            topicName : '/' + changed_robot_name + '/robot_status',
            topicType : robot_status_topic_type,
        });

        robots[robot_name]['viewer_obj'] = new ROS2D.Robot({
            ros: ros,
            map_origin : map_origin,
            name       : changed_robot_name,
            size       : 20,
            topicName  : '/' + changed_robot_name + '/robot_pose',
            topicType  : 'geometry_msgs/PoseStamped',
            fillColor  : createjs.Graphics.getRGB(255,64,128,0.66),
            rootObject : viewer.scene
        });
      });

      robot['status_obj'] = new RobotStatus({
            ros : ros,
            robot_name : robot_name,
            topicName : robot['status_topic'],
            topicType : robot_status_topic_type,
      });
    }
  });

}

function addNavigators() {
  gridClient.on('change', function(map_origin) {
    map_origin = map_origin;
    for (var r in robots){
      var robot = robots[r];
      robot['viewer_obj'] = new ROS2D.Robot({
        ros: ros,
        map_origin : map_origin,
        name       : robot.name,
        size       : 20,
        topicName  : robot.pose_topic,
        topicType  : 'geometry_msgs/PoseStamped',
        fillColor  : createjs.Graphics.getRGB(255,64,128,0.66),
        rootObject : viewer.scene
      });
    }
  });
}

function addRegionViz(){
  var table_topic = rocon_interactions.remappings['tables'] || 'tables';
  var ar_marker_topic = rocon_interactions.remappings['ar_markers'] || 'ar_markers';

  gridClient.on('change', function(map_origin) {
    map_origin = map_origin;
    waypoint_poller = new REGIONVIZ.Waypoint({
      ros: ros,
      map_origin : map_origin,
      rootObject : viewer.scene,
      topicName : table_topic,
    });

    ar_region_poller = new REGIONVIZ.AlvarAR({
       ros: ros,
       map_origin : map_origin,
       rootObject : viewer.scene,
       topicName : ar_marker_topic
     });

  });
}

function settingROSCallbacks()                      
{
  ros.on('connection',function() {
    console.log("Connected");
    // subscribe to order list
    $('#focusedInput').val('Connected');
    $('#focusedInput').attr('disabled',true);
    settingSubscriber();
    settingPublisher();
    }
  );
  ros.on('error',function(e) {
    console.log("Error!",e);
  }
  );                                               
  ros.on('close',function() {
    console.log("Connection Close!");
    $('#focusedInput').val('Disconnected');
  }
  );
}

function settingPublisher(){
  
}

function settingSubscriber(){
    var pickup_order_list_listener = new ROSLIB.Topic({
      ros : ros,
      name : pickup_order_list_sub_topic_name,
      messageType: order_list_sub_topic_type
    });
    pickup_order_list_listener.subscribe(processPickupOrderList);

    var vm_order_list_listener = new ROSLIB.Topic({
      ros : ros,
      name : vm_order_list_sub_topic_name,
      messageType: order_list_sub_topic_type
    });
    vm_order_list_listener.subscribe(processVMOrderList);

}

function processVMOrderList(msg) {
  var i;
  vm_nav_div.empty();
  for(i in msg.orders) {
      // add into navigation bar
      var navli = createOrderLi(i, msg.orders[i]); 
      vm_nav_div.append(navli);
  }
}

function processPickupOrderList(msg) {
  var i;
  pickup_nav_div.empty();
  for(i in msg.orders) {
      // add into navigation bar
      var navli = createOrderLi(i, msg.orders[i]); 
      pickup_nav_div.append(navli);
  }
}

function msec2Time(msec){
  var sec = msec / 1000;
  return parseInt(sec / 60) + ":" + parseInt(sec % 60);
}

function createOrderLi(order_number, order) {
  var li = document.createElement('li');
  var p = document.createElement('p');
  p.innerHTML = "<b>#" + order_number + "</b>"+
             "<br/><b> location : </b>" + order.location+
             "<br/><b> menu : </b>" + order.menus.toString()+
             "<br/><b> Robot : </b>" + (order.robot || "Not Assign")+  
             "<br/><b> Status : </b>" + delivery_status_list[order.status+""]+
             "<br/><b> Elapsed Time : </b>" + msec2Time(order.elapsed_time) +
             "<br/><b> uuid : </b>" + order.order_id;
  li.appendChild(p);
  if (delivery_status_list[order.status+""] === "ERROR"){
    $(li).css("color","red")
          .hover(
           function() { this.style.background= "gray"; },
           function() { this.style.background= "";      });  
  }else{
    $(li).hover(
      function() { this.style.background= "gray"; },
      function() { this.style.background= "";      }
    );  
  }
  
  $(li).click(function() {
  });

  return li;
}

RobotStatus = function(options) {
  var robot_status = this;
  options = options || {};
  robot_status.ros = options.ros;
  robot_status.robot_name = options.robot_name || 'None';
  robot_status.topicName = options.topicName || 'robot_status';
  robot_status.topicType = options.topicType || 'simple_delivery_msgs/RobotStatus';

  robot_status.status_listener = new ROSLIB.Topic({
    ros: robot_status.ros,
    name: robot_status.topicName,
    messageType : robot_status.topicType,
    throttle_rate : 100
  });

  robot_status.status_listener.subscribe(function(msg){
     battery = Number((msg.battery_status.toFixed(1)));
     if ($('.'+robot_status.robot_name+'-battery-status').length){
        $('.'+robot_status.robot_name+'-battery-status').css('width', battery + '%');
        $('.'+robot_status.robot_name+'-battery-status').html(battery + '%');
        $('.'+robot_status.robot_name+'-robot-status').html(robot_status.robot_name+' : '+ delivery_status_list[msg.robot_status]);
     }
  })
}
