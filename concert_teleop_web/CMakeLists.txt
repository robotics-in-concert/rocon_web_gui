cmake_minimum_required(VERSION 2.8.3)
project(concert_teleop_web)

## Find catkin macros and libraries
## if COMPONENTS list like find_package(catkin REQUIRED COMPONENTS xyz)
## is used, also find other catkin packages
find_package(catkin REQUIRED COMPONENTS
  rocon_web_common
)

catkin_package()
