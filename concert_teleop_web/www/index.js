var ros = new ROSLIB.Ros();

//var defaultUrL = rocon_interactions.rosbridge_uri;
var defaultUrl = 'ws://192.168.10.24:9090';
var videoSteamerHost = '192.168.10.24';
var videoSteamerPort = 8080;

//var videoSteamTopicName = "/camera/rgb/image_color";
var videoSteamTopicName = "/teleop/compressed_image";
var videoSteamTopicType = "sensor_msgs/Image";

var controllerTopicName = '/teleop/cmd_vel';
var controllerTopicType = 'geometry_msgs/Twist';

var availableTeleopTopicName = 'services/teleop/available_teleops';
var availableTeleopTopicType = 'rocon_std_msgs/StringArray';

var captureResourcePairName = '/services/teleop/capture_teleop';
var captureResourcePairType = 'concert_service_msgs/CaptureResourcePair';

var modal;
var vsInterface;
var vsUI;
var cInterface;
var cUI;
var rcInterface;
var rcUI;

$().ready(function(e) {
  initHeader();  
});

window.onbeforeunload = function(e){
  if (rcInterface !== undefined){
    rcInterface.releaseAllResource();
  }
  console.log("onbeforeunload");
  return null;
}

function initHeader()
{  
  settingROSCallbacks();
  ros.connect(defaultUrl);
  $('#focusedInput').val(''+ defaultUrl);
}

function initUI(){

  loadVideoStreamer();
  loadController();
  loadResourceChooser();

  if(cInterface !== undefined && rcInterface !== undefined){
    rcInterface.regCaptureResourceCallbacks([cInterface.setcmdVelTopic]);
  }
  if(vsInterface !== undefined && rcInterface !== undefined){
    rcInterface.regCaptureResourceCallbacks([vsInterface.changeVideoStreamTopic]);
  }
}

function loadVideoStreamer() {
  vsInterface = new VideoStreamerInterface({
    ros: ros,
    imageStreamTopicName: videoSteamTopicName,
    imageStreamTopicType: videoSteamTopicType
  });
  vsUI = new VideoStreamerUI({
    divID : 'video_streamer',
    width : 640,
    height: 480,
    host : videoSteamerHost,
    port  : videoSteamerPort,
    videoStreamerInterface : vsInterface,
  });
  vsUI.initVideoCanvas();
}

function loadController(){
  cInterface = new ControllerInterface({
    ros: ros,
    cmdVelTopicName: controllerTopicName,
    cmdVelTopicType: controllerTopicType
  });
  cUI = new ControllerUI({
    divID : 'contoller',
    controllerInterface : cInterface,
  });
  cUI.initContolloer();
}

function loadResourceChooser(){
  rcInterface = new ResourceChooserInterface({
    ros: ros,
    availableTeleopTopicName: availableTeleopTopicName,
    availableTeleopTopicType: availableTeleopTopicType,
    captureResourcePairName: captureResourcePairName,
    captureResourcePairType: captureResourcePairType,
  });

  rdUI = new ResourceChooserUI({
    divID : 'resource_chooser',
    resourceChooserInterface : rcInterface,
  });
  rdUI.initResourceChooser();

}

function settingROSCallbacks()
{
  ros.on('connection',function() {
    console.log("Connected");
    // subscribe to order list                                                       
    $('#focusedInput').val('Connected');
    $('#focusedInput').attr('disabled',true);
    //loadVideoStreamer();
    //loadController();
    initUI();
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
