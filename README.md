rocon_web_gui
=============

Web interface and libraries for rocon

## Installation

```
> sudo apt-get install ros-indigo-roswww
> <cd to work space src directory>
> wstool init . https://raw.githubusercontent.com/robotics-in-concert/rocon_web_gui/indigo/web.rosinstall
> cd ..
> catkin_make
```

## Execution

1. Start Webserver
```
> rosrun roswww webserver.py -p 8888
```

2. Open web remocon in Chrome

* Open url - localhost:8888

![Web remocon](https://raw.githubusercontent.com/robotics-in-concert/rocon_demos/demo_concert/imgs/web_remocon_intro.png)
