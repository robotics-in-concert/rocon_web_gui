/*
  Video Streamer Interface
  
  Dependency
  - rocon_web_common/www/js/ros/robotwebtools/roslib.js
*/

VideoStreamerInterface = function(options){
  var that = this;
  options = options || {};
  
  // Not yet used
  // It will be used when implemetation of streaming via rosbridge is finished.
  /*
  that.ros = options.ros;
  that.imageStreamTopicName = options.imageStreamTopicName || 'compressed_image';
  that.imageStreamTopicType = options.imageStreamTopicType || 'sensor_msgs/CompressedImage';
  that.imageStreamCallback = options.imageStreamCallback || function(){};

  var subImageStream = new ROSLIB.Topic({
    ros: that.ros,
    name : that.imageStreamTopicName, 
    messageType : that.imageStreamTopicType,
  });
  
  subImageStream.subscribe(function(msg) {
    that.imageStreamCallback(msg)
  })
  */

  that.regChangeStreamCallback = function(callback){
    that.changeStreamCallback = callback;
  }

  that.changeVideoStreamTopic = function(msg){
    if(subImageStream !== undefined){
      subImageStream.unsubscribe();
    }
    var remappings = msg.response.remappings;
    var imageStreamTopicName = that.imageStreamTopicName;
    if(remappings.length !== 0){
      remappings.forEach(function(item){
        if (item['remap_from'] == that.imageStreamTopicName){
            imageStreamTopicName = item['remap_to']
        }
      });
    }
    
    // Not yet used
    // It will be used when implemetation of streaming via rosbridge is finished.
    // subImageStream = new ROSLIB.Topic({
    //   ros: that.ros,
    //   name : imageStreamTopicName,
    //   messageType : that.imageStreamTopicType,
    // });
    
    if (that.changeStreamCallback !== undefined) {
      that.changeStreamCallback(imageStreamTopicName);  
    }
  }

};

VideoStreamerInterface.prototype.__proto__ = EventEmitter2.prototype;