ResourceChooserUI = function(options){
  var that = this;
  options = options || {};
  that.resourceChooserInterface = options.resourceChooserInterface || new ResourceChooserInterface();
  
  var currentSelectedResource = '';
  var capturedResource = '';
  var rcModal = new Modal({
    divId: 'resource-chooser-modal'
  });

  //init ui
  //mapping ui item with interface function
  that.initResourceChooser = function(){
    rcModal.initModal();

    that.resourceChooserInterface.regRefreshListCallbacks([updateResourceList]);
    that.resourceChooserInterface.regCaptureResourceCallbacks([updateCaptureResource]);
    that.resourceChooserInterface.regReleaseResourceCallbacks([updateReleaseResource]);
    that.resourceChooserInterface.regResourceErrorCallbacks([updateCaptureErrorResource]);
    
    $('.teleop-resource-capture').click(function(e){
        if(capturedResource.length === 0){
          that.resourceChooserInterface.captureResource(currentSelectedResource);
          $('.teleop-resource-capture').prop('disabled', true);
          $('.teleop-resource-release').prop('disabled', true);
          message = 'Captureing [' + currentSelectedResource + ']\n Wait for a moment..';
        }
        else{
          message = 'Error: Already captured resource: [' + capturedResource + ']';
        }
        rcModal.show('Capture',message);
        
    });

    $('.teleop-resource-release').click(function(e){
        var message = '';
        if(capturedResource.length !== 0){
            that.resourceChooserInterface.releaseResource(currentSelectedResource);
            capturedResource = '';
            message = 'Releasing: [' + currentSelectedResource + ']';
        }
        else{
            message = 'Error: None captured resource: ['+ capturedResource + ']';
        }
        rcModal.show('Release',message);
    });

    $('.teleop-resource-all-release').click(function(e){
        that.resourceChooserInterface.releaseAllResource();
        capturedResource = '';
    });
  }

  var updateCaptureResource = function(msg){
    //rcModal.hide();
    capturedResource = currentSelectedResource;
    $('.teleop-resource-capture').prop('disabled', false);
    $('.teleop-resource-release').prop('disabled', false);
    rcModal.show('Success', 'Captured: ' + capturedResource);
    
  }

  var updateReleaseResource = function(msg){
    //rcModal.hide();
    $('.teleop-resource-capture').prop('disabled', false);
    $('.teleop-resource-release').prop('disabled', false);
    rcModal.show('Success', 'Released');
  }

  var updateCaptureErrorResource = function(msg){
    //rcModal.hide();
    $('.teleop-resource-capture').prop('disabled', false);
    $('.teleop-resource-release').prop('disabled', false);
    rcModal.show('Error', JSON.stringify(msg));
  }

  var updateResourceList = function(resourceList){
    $('.teleop-resource-list').html('<li class="nav-header">Resource List</li>');
    for(resource in resourceList){        
        resourceItem = '<li class="teleop-resource-item"><a href="#">' + resourceList[resource] + '</a></li>';
        $('.teleop-resource-list').append(resourceItem);
    }
    $('.teleop-resource-item').click(function(e){
        currentSelectedResource = e.currentTarget.innerText.replace(/[^A-Za-z0-9\/\:_]/g, '');
    })
  }
}

ResourceChooserUI.prototype.__proto__ = EventEmitter2.prototype;