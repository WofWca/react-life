(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,n){"use strict";n.r(t);var l=n(5),s=n(1),r=n(2),i=n(4),o=n(3),a=n(6),c=n(0),u=n.n(c),h=n(8),p=n.n(h);function g(e,t,n){var l=[];l.length=e;for(var s=0;s<e;s++){var r=[];r.length=t,r.fill(n,0,r.length),l[s]=r}return l}var d=function(e){function t(){return Object(s.a)(this,t),Object(i.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(a.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this;return u.a.createElement("td",{className:"square",onMouseOver:function(){return e.props.onMouseOver(e.props.rowI,e.props.columnI)},onMouseDown:function(){return e.props.onMouseDown(e.props.rowI,e.props.columnI)},style:{backgroundColor:this.props.alive?"black":"white",width:"10px",height:"10px",border:"solid gray 1px"}})}}]),t}(u.a.Component),v=function(e){function t(){var e,n;Object(s.a)(this,t);for(var l=arguments.length,r=new Array(l),a=0;a<l;a++)r[a]=arguments[a];return(n=Object(i.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(r)))).onMouseOverCell=function(e,t){n.mouseOverCell={rowI:e,columnI:t},f&&n.props.onCellToggle(e,t)},n}return Object(a.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this;return u.a.createElement("table",{style:{borderCollapse:"collapse"}},u.a.createElement("tbody",null,this.props.cells.map(function(t,n){return u.a.createElement("tr",{className:"gridRow",key:n.toString()},t.map(function(t,l){return u.a.createElement(d,{rowI:n,columnI:l,alive:t,key:"".concat(n,":").concat(l),onMouseOver:e.onMouseOverCell,onMouseDown:e.props.onCellToggle})}))})))}}]),t}(u.a.Component),m=function(e){function t(e){var n;Object(s.a)(this,t),(n=Object(i.a)(this,Object(o.a)(t).call(this,e))).togglePaused=function(){var e;n.state.paused?(n.timer=setInterval(function(){return n.step()},1/n.frequency*1e3),e=!1):(clearInterval(n.timer),e=!0),n.setState(Object(l.a)({},n.state,{paused:e}))},n.toggleCell=function(e,t){var s=n.state.cells;s[e][t]=!s[e][t],n.setState(Object(l.a)({},n.state,{cells:s}))},n.gridHeight="gridDimensions"in e?e.gridDimensions.height:20,n.gridWidth="gridDimensions"in e?e.gridDimensions.width:20;var r=g(n.gridHeight,n.gridWidth,!1);return n.state={cells:r,paused:!0},n.generationNum=0,n.frequency="frequency"in e?e.frequency:2,n.nextGenCells=g(n.gridHeight,n.gridWidth,!1),n}return Object(a.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return u.a.createElement("div",null,u.a.createElement("div",{className:"controls"},u.a.createElement("button",{onClick:this.togglePaused},this.state.paused?"Unpause":"Pause")),u.a.createElement(v,{cells:this.state.cells,onCellToggle:this.toggleCell}))}},{key:"cellIsAlive",value:function(e,t){return!(e<0||e>=this.gridHeight||t<0||t>=this.gridWidth)&&!1!==this.state.cells[e][t]}},{key:"cellGetNumNeighbors",value:function(e,t){var n=0;return this.cellIsAlive(e-1,t-1)&&n++,this.cellIsAlive(e-1,t)&&n++,this.cellIsAlive(e-1,t+1)&&n++,this.cellIsAlive(e,t-1)&&n++,this.cellIsAlive(e,t+1)&&n++,this.cellIsAlive(e+1,t-1)&&n++,this.cellIsAlive(e+1,t)&&n++,this.cellIsAlive(e+1,t+1)&&n++,n}},{key:"step",value:function(){for(var e=this,t=0;t<this.nextGenCells.length;t++)this.nextGenCells[t]=this.state.cells[t].slice();this.state.cells.forEach(function(t,n){t.forEach(function(t,l){var s=e.cellGetNumNeighbors(n,l);e.nextGenCells[n][l]=!!(3===s||2===s&&t)},e)},this);var n=this.state.cells;this.setState(Object(l.a)({},this.state,{cells:this.nextGenCells})),this.nextGenCells=n}}]),t}(u.a.Component),f=!1;document.onmousedown=function(){f=!0},document.onmouseup=function(){f=!1},p.a.render(u.a.createElement(m,{gridDimensions:{height:30,width:30}}),document.getElementById("root"))},9:function(e,t,n){e.exports=n(10)}},[[9,2,1]]]);
//# sourceMappingURL=main.36b66fac.chunk.js.map