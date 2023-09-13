// Do not edit this file; automatically generated by build.py.
'use strict';

/*

 Visual Blocks Editor

 Copyright 2016 Massachusetts Institute of Technology
 All rights reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
Blockly.Colours={motion:{primary:"#4C97FF",secondary:"#4280D7",tertiary:"#3373CC"},looks:{primary:"#9966FF",secondary:"#855CD6",tertiary:"#774DCB"},sounds:{primary:"#CF63CF",secondary:"#C94FC9",tertiary:"#BD42BD"},control:{primary:"#FFAB19",secondary:"#EC9C13",tertiary:"#CF8B17"},event:{primary:"#FFBF00",secondary:"#E6AC00",tertiary:"#CC9900"},sensing:{primary:"#5CB1D6",secondary:"#47A8D1",tertiary:"#2E8EB8"},pen:{primary:"#0FBD8C",secondary:"#0DA57A",tertiary:"#0B8E69"},operators:{primary:"#59C059",
secondary:"#46B946",tertiary:"#389438"},data:{primary:"#FF8C1A",secondary:"#FF8000",tertiary:"#DB6E00"},data_lists:{primary:"#FF661A",secondary:"#FF5500",tertiary:"#E64D00"},more:{primary:"#FF6680",secondary:"#FF4D6A",tertiary:"#FF3355"},more2:{primary:"#673AB7",secondary:"#5D30AD",tertiary:"#5326A3"},text:"#575E75",workspace:"#F9F9F9",toolboxHover:"#4C97FF",toolboxSelected:"#e9eef2",toolboxText:"#575E75",toolbox:"#FFFFFF",flyout:"#F9F9F9",scrollbar:"#CECDCE",scrollbarHover:"#CECDCE",textField:"#FFFFFF",
insertionMarker:"#000000",insertionMarkerOpacity:.2,dragShadowOpacity:.3,stackGlow:"#FFF200",stackGlowSize:4,stackGlowOpacity:1,replacementGlow:"#FFFFFF",replacementGlowSize:2,replacementGlowOpacity:1,colourPickerStroke:"#FFFFFF",fieldShadow:"rgba(0,0,0,0.1)",dropDownShadow:"rgba(0, 0, 0, .3)",numPadBackground:"#547AB2",numPadBorder:"#435F91",numPadActiveBackground:"#435F91",numPadText:"white",valueReportBackground:"#FFFFFF",valueReportBorder:"#AAAAAA"};
Blockly.Colours.overrideColours=function(c){if(c)for(var a in c)if(c.hasOwnProperty(a)&&Blockly.Colours.hasOwnProperty(a)){var b=c[a];if(goog.isObject(b))for(var d in b)b.hasOwnProperty(d)&&Blockly.Colours[a].hasOwnProperty(d)&&(Blockly.Colours[a][d]=b[d]);else Blockly.Colours[a]=b}};Blockly.Blocks.control={};
Blockly.Blocks.control_repeat={init:function(){this.jsonInit({id:"control_repeat",message0:"%1 %2 %3",args0:[{type:"input_statement",name:"SUBSTACK"},{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/control_repeat.svg",width:40,height:40,alt:"*",flip_rtl:!0},{type:"input_value",name:"TIMES",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.control,colour:Blockly.Colours.control.primary,colourSecondary:Blockly.Colours.control.secondary,colourTertiary:Blockly.Colours.control.tertiary})}};
Blockly.Blocks.control_forever={init:function(){this.jsonInit({id:"control_forever",message0:"%1 %2",args0:[{type:"input_statement",name:"SUBSTACK"},{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/control_forever.svg",width:40,height:40,alt:"*",flip_rtl:!0}],inputsInline:!0,previousStatement:null,category:Blockly.Categories.control,colour:Blockly.Colours.control.primary,colourSecondary:Blockly.Colours.control.secondary,colourTertiary:Blockly.Colours.control.tertiary})}};
Blockly.Blocks.control_repeat={init:function(){this.jsonInit({id:"control_repeat",message0:"%1 %2 %3",args0:[{type:"input_statement",name:"SUBSTACK"},{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/control_repeat.svg",width:40,height:40,alt:"*",flip_rtl:!0},{type:"input_value",name:"TIMES",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.control,colour:Blockly.Colours.control.primary,colourSecondary:Blockly.Colours.control.secondary,
colourTertiary:Blockly.Colours.control.tertiary})}};Blockly.Blocks.control_stop={init:function(){this.jsonInit({id:"control_stop",message0:"%1",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/control_stop.svg",width:40,height:40,alt:"Stop"}],inputsInline:!0,previousStatement:null,category:Blockly.Categories.control,colour:Blockly.Colours.control.primary,colourSecondary:Blockly.Colours.control.secondary,colourTertiary:Blockly.Colours.control.tertiary})}};
Blockly.Blocks.control_wait={init:function(){this.jsonInit({id:"control_wait",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/control_wait.svg",width:40,height:40,alt:"Wait"},{type:"input_value",name:"DURATION",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.control,colour:Blockly.Colours.control.primary,colourSecondary:Blockly.Colours.control.secondary,colourTertiary:Blockly.Colours.control.tertiary})}};Blockly.Blocks.defaultToolbox='<xml id="toolbox-categories" style="display: none"><category name="Events"><block type="event_whenflagclicked"></block><block type="event_whenbroadcastreceived"><value name="CHOICE"><shadow type="dropdown_whenbroadcast"><field name="CHOICE">blue</field></shadow></value></block><block type="event_broadcast"><value name="CHOICE"><shadow type="dropdown_broadcast"><field name="CHOICE">blue</field></shadow></value></block></category><category name="Control"><block type="control_forever"></block><block type="control_repeat"><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value></block><block type="control_stop"></block><block type="control_wait"><value name="DURATION"><shadow type="math_positive_number"><field name="NUM">1</field></shadow></value></block></category><category name="Wedo"><block type="wedo_setcolor"><value name="CHOICE"><shadow type="dropdown_wedo_setcolor"><field name="CHOICE">mystery</field></shadow></value></block><block type="wedo_motorclockwise"><value name="DURATION"><shadow type="math_positive_number"><field name="NUM">1</field></shadow></value></block><block type="wedo_motorcounterclockwise"><value name="DURATION"><shadow type="math_positive_number"><field name="NUM">1</field></shadow></value></block><block type="wedo_motorspeed"><value name="CHOICE"><shadow type="dropdown_wedo_motorspeed"><field name="CHOICE">fast</field></shadow></value></block><block type="wedo_whentilt"><value name="CHOICE"><shadow type="dropdown_wedo_whentilt"><field name="CHOICE">forward</field></shadow></value></block><block type="wedo_whendistanceclose"></block></category></xml>';
Blockly.Blocks.defaultToolboxSimple='<xml id="toolbox-simple" style="display: none"><block type="event_whenflagclicked"></block><block type="event_whenbroadcastreceived"><value name="CHOICE"><shadow type="dropdown_whenbroadcast"><field name="CHOICE">blue</field></shadow></value></block><block type="event_broadcast"><value name="CHOICE"><shadow type="dropdown_broadcast"><field name="CHOICE">blue</field></shadow></value></block><block type="control_forever"></block><block type="control_repeat"><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">4</field></shadow></value></block><block type="control_stop"></block><block type="control_wait"><value name="DURATION"><shadow type="math_positive_number"><field name="NUM">1</field></shadow></value></block></xml>';Blockly.Blocks.event={};Blockly.Blocks.event_whenflagclicked={init:function(){this.jsonInit({id:"event_whenflagclicked",message0:"%1",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_whenflagclicked.svg",width:40,height:40,alt:"When green flag clicked",flip_rtl:!0}],inputsInline:!0,nextStatement:null,category:Blockly.Categories.event,colour:Blockly.Colours.event.primary,colourSecondary:Blockly.Colours.event.secondary,colourTertiary:Blockly.Colours.event.tertiary})}};
Blockly.Blocks.dropdown_whenbroadcast={init:function(){this.appendDummyInput().appendField(new Blockly.FieldIconMenu([{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_blue.svg",value:"blue",width:48,height:48,alt:"Blue"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_green.svg",value:"green",width:48,height:48,alt:"Green"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_coral.svg",value:"coral",
width:48,height:48,alt:"Coral"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_magenta.svg",value:"magenta",width:48,height:48,alt:"Magenta"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_orange.svg",value:"orange",width:48,height:48,alt:"Orange"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_purple.svg",value:"purple",width:48,height:48,alt:"Purple"}]),"CHOICE");this.setOutput(!0);this.setColour(Blockly.Colours.event.primary,
Blockly.Colours.event.secondary,Blockly.Colours.event.tertiary)}};
Blockly.Blocks.event_whenbroadcastreceived={init:function(){this.jsonInit({id:"event_whenbroadcastreceived",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_when-broadcast-received_blue.svg",width:40,height:40,alt:"Broadcast received"},{type:"input_value",name:"CHOICE"}],inputsInline:!0,nextStatement:null,category:Blockly.Categories.event,colour:Blockly.Colours.event.primary,colourSecondary:Blockly.Colours.event.secondary,colourTertiary:Blockly.Colours.event.tertiary})}};
Blockly.Blocks.dropdown_broadcast={init:function(){this.appendDummyInput().appendField(new Blockly.FieldIconMenu([{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_broadcast_blue.svg",value:"blue",width:48,height:48,alt:"Blue"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_broadcast_green.svg",value:"green",width:48,height:48,alt:"Green"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_broadcast_coral.svg",value:"coral",width:48,height:48,alt:"Coral"},{src:Blockly.mainWorkspace.options.pathToMedia+
"icons/event_broadcast_magenta.svg",value:"magenta",width:48,height:48,alt:"Magenta"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_broadcast_orange.svg",value:"orange",width:48,height:48,alt:"Orange"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_broadcast_purple.svg",value:"purple",width:48,height:48,alt:"Purple"}]),"CHOICE");this.setOutput(!0);this.setColour(Blockly.Colours.event.primary,Blockly.Colours.event.secondary,Blockly.Colours.event.tertiary)}};
Blockly.Blocks.event_broadcast={init:function(){this.jsonInit({id:"event_broadcast",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/event_broadcast_blue.svg",width:40,height:40,alt:"Broadcast"},{type:"input_value",name:"CHOICE"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.event,colour:Blockly.Colours.event.primary,colourSecondary:Blockly.Colours.event.secondary,colourTertiary:Blockly.Colours.event.tertiary})}};Blockly.Blocks.wedo={};
Blockly.Blocks.dropdown_wedo_setcolor={init:function(){this.appendDummyInput().appendField(new Blockly.FieldIconMenu([{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_mystery.svg",value:"mystery",width:48,height:48,alt:"Mystery"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_yellow.svg",value:"yellow",width:48,height:48,alt:"Yellow"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_orange.svg",value:"orange",width:48,height:48,alt:"Orange"},{src:Blockly.mainWorkspace.options.pathToMedia+
"icons/set-led_coral.svg",value:"coral",width:48,height:48,alt:"Coral"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_magenta.svg",value:"magenta",width:48,height:48,alt:"Magenta"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_purple.svg",value:"purple",width:48,height:48,alt:"Purple"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_blue.svg",value:"blue",width:48,height:48,alt:"Blue"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_green.svg",
value:"green",width:48,height:48,alt:"Green"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_white.svg",value:"white",width:48,height:48,alt:"White"}]),"CHOICE");this.setOutput(!0);this.setColour(Blockly.Colours.looks.primary,Blockly.Colours.looks.secondary,Blockly.Colours.looks.tertiary)}};
Blockly.Blocks.wedo_setcolor={init:function(){this.jsonInit({id:"wedo_setcolor",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/set-led_blue.svg",width:40,height:40,alt:"Set LED Color"},{type:"input_value",name:"CHOICE"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.looks,colour:Blockly.Colours.looks.primary,colourSecondary:Blockly.Colours.looks.secondary,colourTertiary:Blockly.Colours.looks.tertiary})}};
Blockly.Blocks.wedo_motorclockwise={init:function(){this.jsonInit({id:"wedo_motorclockwise",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_motor-clockwise.svg",width:40,height:40,alt:"Turn motor clockwise"},{type:"input_value",name:"DURATION",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.motion,colour:Blockly.Colours.motion.primary,colourSecondary:Blockly.Colours.motion.secondary,colourTertiary:Blockly.Colours.motion.tertiary})}};
Blockly.Blocks.wedo_motorcounterclockwise={init:function(){this.jsonInit({id:"wedo_motorcounterclockwise",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_motor-counterclockwise.svg",width:40,height:40,alt:"Turn motor counter-clockwise"},{type:"input_value",name:"DURATION",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.motion,colour:Blockly.Colours.motion.primary,colourSecondary:Blockly.Colours.motion.secondary,
colourTertiary:Blockly.Colours.motion.tertiary})}};
Blockly.Blocks.dropdown_wedo_motorspeed={init:function(){this.appendDummyInput().appendField(new Blockly.FieldIconMenu([{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_motor-speed_slow.svg",value:"slow",width:48,height:48,alt:"Slow"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_motor-speed_med.svg",value:"medium",width:48,height:48,alt:"Medium"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_motor-speed_fast.svg",value:"fast",width:48,height:48,alt:"Fast"}]),"CHOICE");
this.setOutput(!0);this.setColour(Blockly.Colours.motion.primary,Blockly.Colours.motion.secondary,Blockly.Colours.motion.tertiary)}};
Blockly.Blocks.wedo_motorspeed={init:function(){this.jsonInit({id:"wedo_motorspeed",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_motor-speed_fast.svg",width:40,height:40,alt:"Motor Speed"},{type:"input_value",name:"CHOICE"}],inputsInline:!0,previousStatement:null,nextStatement:null,category:Blockly.Categories.motion,colour:Blockly.Colours.motion.primary,colourSecondary:Blockly.Colours.motion.secondary,colourTertiary:Blockly.Colours.motion.tertiary})}};
Blockly.Blocks.dropdown_wedo_whentilt={init:function(){this.appendDummyInput().appendField(new Blockly.FieldIconMenu([{type:"placeholder",width:48,height:48},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_when-tilt-forward.svg",value:"forward",width:48,height:48,alt:"Tilt forward"},{type:"placeholder",width:48,height:48},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_when-tilt-left.svg",value:"left",width:48,height:48,alt:"Tilt left"},{src:Blockly.mainWorkspace.options.pathToMedia+
"icons/wedo_when-tilt.svg",value:"any",width:48,height:48,alt:"Tilt any"},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_when-tilt-right.svg",value:"right",width:48,height:48,alt:"Tilt right"},{type:"placeholder",width:48,height:48},{src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_when-tilt-backward.svg",value:"backward",width:48,height:48,alt:"Tilt backward"}]),"CHOICE");this.setOutput(!0);this.setColour(Blockly.Colours.event.primary,Blockly.Colours.event.secondary,Blockly.Colours.event.tertiary)}};
Blockly.Blocks.wedo_whentilt={init:function(){this.jsonInit({id:"wedo_whentilt",message0:"%1 %2",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_when-tilt.svg",width:40,height:40,alt:"When tilted"},{type:"input_value",name:"CHOICE"}],inputsInline:!0,nextStatement:null,category:Blockly.Categories.event,colour:Blockly.Colours.event.primary,colourSecondary:Blockly.Colours.event.secondary,colourTertiary:Blockly.Colours.event.tertiary})}};
Blockly.Blocks.wedo_whendistanceclose={init:function(){this.jsonInit({id:"wedo_whendistanceclose",message0:"%1",args0:[{type:"field_image",src:Blockly.mainWorkspace.options.pathToMedia+"icons/wedo_when-distance_close.svg",width:40,height:40,alt:"When distance close"}],inputsInline:!0,nextStatement:null,category:Blockly.Categories.event,colour:Blockly.Colours.event.primary,colourSecondary:Blockly.Colours.event.secondary,colourTertiary:Blockly.Colours.event.tertiary})}};
Blockly.constants={};Blockly.DRAG_RADIUS=3;Blockly.FLYOUT_DRAG_RADIUS=10;Blockly.SNAP_RADIUS=48;Blockly.CONNECTING_SNAP_RADIUS=68;Blockly.CURRENT_CONNECTION_PREFERENCE=20;Blockly.BUMP_DELAY=0;Blockly.COLLAPSE_CHARS=30;Blockly.LONGPRESS=750;Blockly.LINE_SCROLL_MULTIPLIER=15;Blockly.SOUND_LIMIT=100;Blockly.DRAG_STACK=!0;Blockly.HSV_SATURATION=.45;Blockly.HSV_VALUE=.65;Blockly.SPRITE={width:96,height:124,url:"sprites.png"};Blockly.SVG_NS="http://www.w3.org/2000/svg";Blockly.HTML_NS="http://www.w3.org/1999/xhtml";
Blockly.INPUT_VALUE=1;Blockly.OUTPUT_VALUE=2;Blockly.NEXT_STATEMENT=3;Blockly.PREVIOUS_STATEMENT=4;Blockly.DUMMY_INPUT=5;Blockly.ALIGN_LEFT=-1;Blockly.ALIGN_CENTRE=0;Blockly.ALIGN_RIGHT=1;Blockly.DRAG_NONE=0;Blockly.DRAG_STICKY=1;Blockly.DRAG_BEGIN=1;Blockly.DRAG_FREE=2;Blockly.OPPOSITE_TYPE=[];Blockly.OPPOSITE_TYPE[Blockly.INPUT_VALUE]=Blockly.OUTPUT_VALUE;Blockly.OPPOSITE_TYPE[Blockly.OUTPUT_VALUE]=Blockly.INPUT_VALUE;Blockly.OPPOSITE_TYPE[Blockly.NEXT_STATEMENT]=Blockly.PREVIOUS_STATEMENT;
Blockly.OPPOSITE_TYPE[Blockly.PREVIOUS_STATEMENT]=Blockly.NEXT_STATEMENT;Blockly.TOOLBOX_AT_TOP=0;Blockly.TOOLBOX_AT_BOTTOM=1;Blockly.TOOLBOX_AT_LEFT=2;Blockly.TOOLBOX_AT_RIGHT=3;Blockly.OUTPUT_SHAPE_HEXAGONAL=1;Blockly.OUTPUT_SHAPE_SQUARE=3;Blockly.OUTPUT_SHAPE_ROUND=2;Blockly.OUTPUT_SHAPE_SQUARE=3;Blockly.Categories={motion:"motion",looks:"looks",sound:"sounds",pen:"pen",data:"data",dataLists:"data-lists",event:"events",control:"control",sensing:"sensing",operators:"operators",more:"more"};
Blockly.DELETE_AREA_NONE=null;Blockly.DELETE_AREA_TRASH=1;Blockly.DELETE_AREA_TOOLBOX=2;Blockly.VARIABLE_CATEGORY_NAME="VARIABLE";Blockly.PROCEDURE_CATEGORY_NAME="PROCEDURE";Blockly.RENAME_VARIABLE_ID="RENAME_VARIABLE_ID";Blockly.DELETE_VARIABLE_ID="DELETE_VARIABLE_ID";Blockly.NEW_BROADCAST_MESSAGE_ID="NEW_BROADCAST_MESSAGE_ID";Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE="broadcast_msg";Blockly.LIST_VARIABLE_TYPE="list";Blockly.SCALAR_VARIABLE_TYPE="";Blockly.PROCEDURES_DECLARATION_BLOCK_TYPE="procedures_declaration";
Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE="procedures_definition";Blockly.PROCEDURES_DEFINITION_RETURN_BLOCK_TYPE="procedures_definition_return";Blockly.PROCEDURES_PROTOTYPE_BLOCK_TYPE="procedures_prototype";Blockly.PROCEDURES_PROTOTYPE_RETURN_BLOCK_TYPE="procedures_prototype_return";Blockly.PROCEDURES_CALL_BLOCK_TYPE="procedures_call";Blockly.PROCEDURES_CALL_RETURN_BLOCK_TYPE="procedures_call_return";Blockly.StatusButtonState={READY:"ready",NOT_READY:"not ready"};
