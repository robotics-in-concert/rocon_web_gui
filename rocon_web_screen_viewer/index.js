var ros = new ROSLIB.Ros();

var defaultUrL = rocon_interactions.rosbridge_uri;
var screen_id = rocon_interactions.parameters['screen'];
var config_values = {};

var res_path = './video/'
config_values['screen_id'] = screen_id;

var show_video_sub_topic_name = 'show_video'
var show_video_sub_topic_type = 'simple_media_msgs/ShowVideo'

if(show_video_sub_topic_name in rocon_interactions.remappings)
  show_video_sub_topic_name = rocon_interactions.remappings[show_video_sub_topic_name];

$().ready(function(e) {
    
    initRos();
    initScreen();
    initConfig(config_values);
});

function initScreen(){
  console.log(config_values['screen_id'])
  $('.video-screen-viewer').css("height",$( window ).height()).css("width",$( window ).width());
  
  if(config_values['screen_id'].indexOf('left')>=0){
    $(".video-screen-viewer").attr("src","./video/TV_Left_0_Default.mp4");
  }
  else if(config_values['screen_id'].indexOf('right')>=0){    
    $(".video-screen-viewer").attr("src","./video/TV_Right_0_Default.mp4");
  }
  else{
    $(".video-screen-viewer").attr("src","./video/TV_Default.mp4");
  }
}

function initRos()
{
  settingROSCallbacks();
  ros.connect(defaultUrL);
  $(".rosbridge-ip-info").html(defaultUrL);
}

function settingROSCallbacks()                      
{
  ros.on('connection',function() {
    console.log("Connected");
    $(".rosbridge-connection-info").html("Connection");
    // subscribe to order list                                                       
    
    var showvideo_listener = new ROSLIB.Topic({
      ros : ros,
      name : show_video_sub_topic_name,
      messageType: show_video_sub_topic_type
      });
    showvideo_listener.subscribe(processShowVideo);
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

}

function processShowVideo(msg) {
  if (config_values['screen_id']  == msg.screen_id){
    console.log(msg.video_url);
    $(".video-screen-viewer").attr("src",msg.video_url);
  }
  else{
  }
}
  
