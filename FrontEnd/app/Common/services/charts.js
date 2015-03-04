angular.module('AnalyticsApp')

.service('chartsService',['$compile','UtilitiesService' ,function($compile, UtilitiesService){

	this.sparkleLine = function(data, chartOptions, scope) {
		var container = this[0];

		var $defaults = {
				chart: {
					renderTo:container,              
					type: 'column',
					margin: [2, 0, 2, 0]

				},
				title: {
					text: ''
				},
				credits: {
					enabled: false
				},

				yAxis: {
					gridLineWidth: 0,      
					endOnTick: false,
					startOnTick: false
				},
				tooltip: {
					enabled: false
				},
				legend:{
					enabled: false
				},
				plotOptions: {
					series: {
						animation : false,
						pointPadding : -0.2                
					}
				},
				series: [{
					data: data,
				}]
		};
		$.extend(true,$defaults,chartOptions);

		var _chart = new Highcharts.Chart($defaults);
		return _chart;

	};
	
	this.combinedStackedBarLine = function(data, chartOptions, scope) {
		if(data.plotBand){
			var from = data.plotBand[0][0];
			var to = data.plotBand[0][1];
		}
		var spline1Data = [];
		var spline2Data = [];
		var column1Data = [];
		var column2Data = [];
		var categories = [];

		var finalDate = [];
		$.each(data.data, function(i, data) {
			var date = {};
			spline1Data.push(data.cancellations);
			spline2Data.push(data.newSubs);
			column1Data.push(data.revenue);
			column2Data.push(data.mrr);
			date = {
					'startDate':data.startDate,
					'endDate':data.endDate,
					'name': data.name
			}
			categories.push(date);
			finalDate.push(date);
		});
		if((data.data[0].revenue !='undefined') && (data.data[0].cancellations!='undefined')){
			var yAxisLabelLeft = scope.chartVariables.track_summary_trend_left_title;
			var yAxisLabelRight = scope.chartVariables.track_summary_trend_right_title;
			var title = scope.chartVariables.track_summary_trend_title;
		}
		else if(data.data[0].revenue){
			var yAxisLabelLeft = scope.chartVariables.track_summary_trend_left_title;
			var yAxisLabelRight = '';
			var title = '';
		}else{
			var yAxisLabelLeft = '';
			var yAxisLabelRight = scope.chartVariables.track_summary_trend_right_title;
			var title = '';
		}
		var container = this[0];
		var $defaults = {
				
				chart: {
					plotBorderWidth:1,
					plotWidth:550,
					zoomType: 'xy',
					renderTo:container,
					spacingBottom: 15,
					spacingTop: 10,
					spacingLeft: 10,
					spacingRight: 10,
					// height:300
					events: {
						load: function(event) {
							$compile(this.container)(scope);
						},
						redraw: function(){
							$compile(this.container)(scope);
						}
					}        
				},
				legend: {

					itemStyle: {fontFamily:'20px arial' }                
				},
				title: {
					text:title,
					margin:35,
					style:{"color":"#000","font-size":"14px","font-family": "arial, sans-serif","font-weight":"bold","font-style": "italic","margin-left":"15px","margin-top":"-10px"}
					//x:28
				},
				xAxis: [{
					categories: categories,
					labels:{
						//rotation: 20,
						style: {
							color: '#000000',
							font: '10pt arial'
						},
						formatter: function() {
							var val = this.value;
							var startDate = this.value.startDate;
							var endDate = this.value.endDate;
							return '<span class="chartTooltipLabel" chart-label-tooltip start-date="'+startDate+'" end-date="'+endDate+'" title="">' + this.value.name + '</span>';
						},
						useHTML: true,
					},plotBands: [{ 
						from :from,
						to : to,
						color: '#EFFCFB'
					}]
				}],
				yAxis: [{ // Primary yAxis
					labels: {
						formatter: function(){
							//var val = this.value;
						//	val = parseInt(val) / 100000;
							//return val.toFixed(1) + ' Mn1';
							var val = UtilitiesService.getLocaleString(this.value);
							return val + '$';
						},

						style: {
							color: '#000000',
							font: '10pt arial'

						}
					},
					gridLineWidth:0,
					title: {
						text: yAxisLabelLeft,
						style: {
							font:'12pt arial',
							color:'black',
							fontWeight:'bold'

						}
					},
					min: 0,
					allowDecimals: false
					
				},{ // Secondary yAxis
					title: {
						text: yAxisLabelRight,
						style: {
							font:'12pt arial',
							color:'black',
							fontWeight:'bold'

						}

					},
					gridLineWidth:0,
					labels: {
						formatter: function(){
							var val = this.value;
							val = parseInt(val) / 1000;
							return val.toFixed(1)+' K';
						},
						style: {
							fontFamily:'arial',
							color:'black',
							fontSize:'13px'
						}
					},
					opposite: true,
					min: 0,
					allowDecimals: false
				}],

				tooltip: {
					enabled:true,
					formatter: function () {
						var value = UtilitiesService.getLocaleString(this.y);
		                return this.x.name +'<br><div style="position:relative;"><span style="color:'+this.series.color+';font-size: 40px;position:absolute;bottom:-12px;">&#8226;</span><span style ="font-size:13px;margin-left:25px;">'+ this.series.name +'</span></b> : <b>' + value + '</b></div>';
		            },
		            useHTML :true
				},
				
				credits:{
					enabled:false
				},
				plotOptions: {
					column: {
						stacking: 'normal',

					}, series: {
						events: {
							hide: function() {

								if(!this.chart.get('newRevenue').visible && !this.chart.get('mrr').visible) {
									this.chart.yAxis[0].axisTitle.hide();
								} 
								if(!this.chart.get('Actual').visible && !this.chart.get('Target').visible) {
									this.chart.yAxis[1].labelGroup.css({
										visibility:'hidden'
									})
									this.chart.yAxis[1].axisTitle.hide();
								} 
							},
							show: function() {
								if(this.chart.get('newRevenue').visible || this.chart.get('mrr').visible) {
									this.chart.yAxis[0].labelGroup.css({
										visibility:'visible'
									})
									this.chart.yAxis[0].axisTitle.show();
									if(!this.chart.get('Actual').visible && !this.chart.get('Target').visible) {
										this.chart.yAxis[1].axisTitle.hide();
									}
								}
								if(this.chart.get('Actual').visible || this.chart.get('Target').visible) {
									this.chart.yAxis[1].labelGroup.css({
										visibility:'visible'
									})
									this.chart.yAxis[1].axisTitle.show();
									if(!this.chart.get('newRevenue').visible && !this.chart.get('mrr').visible){
										this.chart.yAxis[0].axisTitle.hide();
									}

								} 
							}
						}
					}
				},
				series: data.seriesData,
		};

		$.extend(true,$defaults,chartOptions);
		var _chart = new Highcharts.Chart($defaults);
		return _chart;
	}

	this.splineArea = function(data, chartOptions, scope) {
		var xAxis = {};
		var categories = [];
		if(data.plotBand){
			var from = data.plotBand[0][0];
			var to = data.plotBand[0][1];
		}
		$.each(data.xAxis, function(i, eachData) {
			xAxis = {
					'startDate':data.startDate[i],
					'endDate':data.endDate[i],
					'xAxis': data.xAxis[i]
			};
			categories.push(xAxis);
		});
		if(data.data)
			data = data.data;
		else
			data = data[0];
		var container = this[0];

		var $defaults = {
				chart: {
					renderTo: container,
					type: 'areaspline',
					plotBorderWidth:1,
					height:300,
					events: {
						load: function(event) {
							$compile(this.container)(scope);
						},
						redraw: function(){
							$compile(this.container)(scope);
						}
					}  
				},
				legend: {
					itemStyle: {fontFamily:'20px arial' }                
				},
				plotOptions: {
					series: {
						events: {
							hide: function(e) {
								var clicked = true;
								for (var i = 0; i < this.chart.series.length;i++)
								{
									if (this.chart.series[i].visible)
									{
										clicked = false;
										break;
									}
									else{
										clicked = true;
										continue;
									}

								}
								if(!clicked){
									this.chart.yAxis[0].axisTitle.show();
								}
								else{
									this.chart.yAxis[0].axisTitle.hide();
								}
							}
						}
					}
				},
				title: { text: ''},
				xAxis: {
					categories: categories,

					labels:{
						style:{
							color: '#000000',
							font: '10pt arial, sans-serif'
						},
						formatter: function() {
							var val = this.value;
							var startDate = this.value.startDate;
							var endDate = this.value.endDate;
							return '<span class="chartTooltipLabel" chart-label-tooltip start-date="'+startDate+'" end-date="'+endDate+'" title="">' + this.value.xAxis + '</span>';
						},
						useHTML: true,
					},plotBands: [{ 
						from :from,
						to : to,
						color: '#EFFCFB'
					}]
				},
				yAxis:{
					gridLineWidth:0
				},
				credits: {
					enabled: false
				},
				tooltip: {
					enabled:true,
					formatter: function () {
						var value = UtilitiesService.getLocaleString(this.y);
		                return this.x.xAxis +'<br><div><span style="color:'+this.series.color+';font-size: 40px;position:absolute;top:-3px;">•</span><span style ="font-size:13px;margin-left:25px;">'+ this.series.name +'</span></b> : <b>' + value + '</b></div>';
		            },
		            useHTML :true
				},
				series: data
		};

		$.extend(true,$defaults,chartOptions);

		var _chart = new Highcharts.Chart($defaults);

		return _chart;

	};

	this.line = function(data, chartOptions, scope) {
		if(data.plotBand){
			var from = data.plotBand[0][0];
			var to = data.plotBand[0][1];
		}
		var data_copy = data;
		var xAxis = {};
		var categories = [];
		var axisLabels = [];
		var data = data.data;// for network call data[0]
		var container = this[0];
		$.each(data_copy.xAxis, function(i, eachData) {
			xAxis = {
					'startDate':data_copy.startDate[i],
					'endDate':data_copy.endDate[i],
					'xAxis': data_copy.xAxis[i]
			};
			categories.push(xAxis);
			axisLabels.push(xAxis.xAxis);
		});
		var $defaults = {
				chart: {
					renderTo: container,
					plotBorderWidth:1,
					events: {
						load: function(event) {
							$compile(this.container)(scope);
						},
						redraw: function(){
							$compile(this.container)(scope);
						}
					}	
				},
				title: { text: ''},
				plotOptions: {
					series: {
						events: {
							hide: function(e) {
								var clicked = true;
								for (var i = 0; i < this.chart.series.length;i++)
								{
									if (this.chart.series[i].visible)
									{
										clicked = false;
										break;
									}
									else{
										clicked = true;
										continue;
									}

								}
								if(!clicked){
									this.chart.yAxis[0].axisTitle.show();
								}
								else{
									this.chart.yAxis[0].axisTitle.hide();
								}
							}
						}
					}
				},
				xAxis: {
					categories: categories,
					labels:{
						style:{
							color: '#000000',
							font: '10pt arial'
						},
						formatter: function() {
							var val = this.value;
							var startDate = this.value.startDate;
							var endDate = this.value.endDate;
							return '<span class="chartTooltipLabel" chart-label-tooltip start-date="'+startDate+'" end-date="'+endDate+'" title="">' + this.value.xAxis + '</span>';
						},
						useHTML: true
					},plotBands: [{ 
						from :from,
						to : to,
						color: '#EFFCFB'
					}]
				},
				yAxis:{
					gridLineWidth:0
				},
				tooltip: {
					enabled:true,
					formatter: function () {
						var value = UtilitiesService.getLocaleString(this.y);
		                return this.x.xAxis +'<br><div style="position:relative;"><span style="color:'+this.series.color+';font-size: 40px;position:absolute;bottom:-12px;">•</span><span style ="font-size:13px;margin-left:25px;">'+ this.series.name +'</span></b> : <b>' + value + '</b></div>';
		            },
		            useHTML :true
				},
				credits:{
					enabled:false
				},
				series: data
		};


		$.extend(true,$defaults,chartOptions);

		var _chart = new Highcharts.Chart($defaults);

		return _chart;

	};

	this.treemap = function(data, chartOptions, scope) {
        	// Need to pass these variables too
		var key1 = "score", key2 = "conversionValue";
		var nodes = [];
		var treemaps = [];

        var container = this[0];
		$(container).html("");
		var jData = data;

		var margin = {top: 0, right: 0, bottom: 00, left: 0},
		width = 430,
		height = 260;

		var color = d3.scale.category20c();

		var treemap = d3.layout.treemap()
		.size([width, height])
		.sticky(true)
		.value(function(d) { return d[key1]; });

		var div = d3.select(container).append("div")
		.style("position", "relative")
		.style("width", (width) + "px")
		.style("height", (height) + "px")
		.style("float", "left");

		div.append("h4").text(data.name).attr("class", "heatmapHeading");

		var root = jData;
		var tooltip = d3.select("#tooltip");
        var node = div.datum(root).selectAll(".node")
		.data(treemap.nodes)
		.enter().append("div")
		.attr("class", "node")
		.call(position)
		.style("background", function(d) { return d.children ? color(d.name) : null; })
		.on("click", function(d){ 
			$(this).siblings().removeClass("highlight"); 
			$(this).addClass("highlight"); 
			$(this).closest('.heatMap1, .heatMap2').siblings('.heatMapTitle').html(d.name);
            $(this).closest('.heatMap1, .heatMap2').siblings('.heatMapTitleVisits').html(d.score.toLocaleString() + " visits " + d.conversionValue.toLocaleString() + "%");
		}).on("mouseover", function(d){
            $(this).addClass('transcend');
            if($(d3.event.toElement).hasClass('treeInnerText'))
                return false;
			tooltip.transition()        
			.duration(200)      
			.style("opacity", .9).style("left", d3.event.screenX-d3.event.offsetX + "px")    
			.style("top", d3.event.offsetY+70 + "px");      
			tooltip.html('<div><h3>'  + d.name + '</h3><p>Score : <span>' + d.score.toLocaleString() + '</span></p>' +
                '<p>Conv. rate : <span>' + d.conversionValue.toLocaleString() + ' %</span></p></div>');    
		}).on("mouseout", function(d) {  
            $(this).removeClass('transcend');
			tooltip.transition()        
			.duration(500)      
			.style("opacity", 0);   
		});

		node.append('div')
		.text(function(d) { return d.children ? null : d.name; }).attr("class", "treeInnerText") ;

		nodes.push(node);
		treemaps.push(treemap);
        $(".deepDive.heatMap").on("click", function change() {
			var val = "";
			if($(this).hasClass(key2)) {
				val = key2;
			}
			var value = val === key2
            ? function(d) { return d[key2]; }
			: function(d) { return d[key1]; };
            
			$.each(nodes, function(i, node){
				node.data(treemaps[i].value(value).nodes)
				.transition()
				.duration(1000)
				.call(position);
			});
		});

		function position() {
            
			this.style("left", function(d) {return d.x + "px"; })
			.style("top", function(d) { return d.y + "px"; })
			.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; })
			.attr("class", function(d) { return $(this).attr('class') + " " + d.level; });

		}
	};
	
	this.waterfall = function(data, chartOptions, scope) {
		var container = this[0];
		var _data;
		
		if(data.actualUplift){
			var actualUplift = data.actualUplift;
			delete data.actualUplift;
			_data = data.data;
		}
		else{
			_data = data;
		}
		function manipulateChart(){
			Highcharts.each(_chart.series[0].data, function(point,i,cols) {
				point.dataLabel.attr({y:point.plotY - 20});

				if(i == 1){
					yBase = point.graphic.attr('y');
				}
				if(i == 2){
					yDeficit = point.graphic.attr('y');
				}
				if(i == 4){
					var height = point.graphic.attr('height');
	                var yDiff = yBase - yDeficit;
					var yUplift = point.graphic.attr('y');
	                var yActual = yUplift + Math.abs(height - yDiff);
					point.graphic.attr({y:yActual});
	                point.dataLabel.textSetter(actualUplift);
					point.dataLabel.attr({y:point.plotY -15});
				}
	            if(i == 5){
	            
	            }
			});
		}
		var $defaults = {
				chart : {
					renderTo: container,
					type : 'waterfall',
					events: {
						redraw: function(){
							manipulateChart();
							console.log('THIZ',this)
						}
					},
					style: {
						fontFamily:'"Open Sans", sans-serif',
						// color:'black'
					}
						
				},
				title: {
					text: ''
				},
				yAxis: {
					title: {
						text:'Users',
						style: {
							color: '#000000',
							font: '11pt Arial, sans-serif',
							fontWeight:'bold'
						}
					},
					labels : {
						enabled : false
					},
					gridLineWidth:0
				},
				tooltip : {
					enabled : false
				},
				credits : {
					enabled:false
				},
				series : [ {
					data : _data,
					dataLabels : {
						enabled: true,
						style : {
							color : 'black',
							fontWeight : 'bold',
							// textShadow : '0px 0px 3px black',
							fontFamily:'Arial, sans-serif'
						},

					},
					borderColor:'#006600',
					borderWidth:0,
					borderRadius:2,
					shadow:false,
					pointWidth: 70
				}]
		};
		$.extend(true,$defaults,chartOptions);

		var _chart = new Highcharts.Chart($defaults);
		var yBase;
		var yDeficit
		manipulateChart();
		return _chart;

	};
	this.bubbleWithoutAxis = function(data, chartOptions, scope) {

		var container = this[0];
		var newData = [], xRange = 0;
		data = data.sort(function(a,b){ return b.data[0][2]-a.data[0][2]});

		$.each(data, function(i, obj){
			newData.push({
				name: obj.name,
				marker: {
					fillOpacity: 1
				},
				data: [[xRange,0,obj.data[0][2]]],
			});
			xRange+=1;
		});

		data = newData;

		var $defaults = {
				chart: {
					height:180,
					type: 'bubble',
					style: {
						fontFamily:'"Arial", sans-serif',
					},
					renderTo: container,
					plotBorderWidth: 1
				},
				title: { text: ''},
				xAxis:{
					labels: {
						enabled: false
					},
					title: {
						text: null
					},
					lineWidth: 0,
					minorGridLineWidth: 0,
					lineColor: 'transparent',
					minorTickLength: 0,
					tickLength: 0,
					minPadding: 0.1,
					maxPadding: 0.1
				},
				yAxis:{
					labels: {
						enabled: false,
						style:{
							color: '#000000',
							font: '10pt Arial, sans-serif'
						}
					},
					title: {
						text: null
					},
					lineWidth: 0,
					minorGridLineWidth: 0,
					lineColor: 'transparent',
					minorTickLength: 0,
					tickLength: 0,
					gridLineWidth:0,
					minPadding: 0.1,
					maxPadding: 0.1
				},
				credits :{
					enabled:false
				},
				legend:{
					enabled:false
				},
//				legend: {
//				align: "right",
//				layout: "vertical",
//				itemMarginTop: 3,
//				itemMarginBottom: 3,
//				padding: 15,
//				verticalAlign: 'middle',
//				itemStyle: {
//				color: '#000000',
//				fontWeight: 'bold',
//				fontSize: '12pt Arial',

//				},
//				itemWidth: 140,
//				symbolWidth: 30,
//				symbolHeight: 30,
//				height: 150	,
//				y:1
//				},
				tooltip: {
					enabled: false
				},
				plotOptions: {
					series: {
						dataLabels: {
							enabled: true,
							useHTML:true,
							formatter:function(){
								return "<div class='labeltext' style='color: black;text-shadow:none;font-weight: bold;position:relative;top:-"+(this.point.shapeArgs.r+10)+"px;text-align:center;font-size: 11px;'>"+this.series.name+"</div>";
								// return "<div class='labeltext'
								// style='-webkit-transform:
								// rotate(-30deg);left:40px;color:
								// black;text-shadow:none;font-weight:
								// bold;position:relative;top:-"+(this.point.shapeArgs.r+20)+"px;text-align:center;'>"+this.series.name+"</div>";
							}
						}
					},
					bubble:{
						minSize:'10%',
						maxSize:'40%'
					}
				},
				series: data

		};
		$defaults = $.extend($defaults,chartOptions);

		var _chart = new Highcharts.Chart($defaults);

		return _chart;

	};
	
	this.bubbleChart = function(data, chartOptions, scope) {
		var plotData = [];
		var container = this[0];
		var seriesData = [];
		var categoryLabel = "";
		$.each(data, function(key, effort){
			plotData.push([effort.time, effort.cost, effort.subs]);
			seriesData.push({
				data: [plotData[key]]
			});
			categoryLabel = "week";
		});
		var $defaults = {
				chart: {
					renderTo: container,
					style: {
						fontFamily:'"Arial", sans-serif',
						color:'black !important'
					},
					type: 'bubble',
					zoomType: 'y'
				},
				title: {
					text: ""
				},
				xAxis: {
					// gridLineWidth: 1,
					plotOptions: {
						series: {
							lineWidth: 1
						}
					},
					title : {
						text : 'Time to Implement',
						style: {
							color: '#000000',
							font: '11pt Arial, sans-serif',
							fontWeight:'bold'
						}
					},
					labels:{
						enabled:true,
						formatter: function(){
							var val = this.value;
							return val+ ' '+categoryLabel;
						},
					}
				},

				yAxis: {

					startOnTick: false,
					endOnTick: false,
					title : {
						text : 'Cost ($)',
						style: {
							color: '#000000',
							font: '11pt Arial, sans-serif',
							fontWeight:'bold'

						}
					},
					gridLineWidth: 0,
					lineWidth:1,
					labels: {
						enabled:true,
						formatter: function(){
							var val = this.value;
							val = parseInt(val) / 100000;
							return val.toFixed(1) + ' Mn';
						},

						style: {
							color: '#000000',
							font: '10pt arial'

						}
					},


				},
				series: seriesData,
				credits :{
					enabled:false
				},
				plotOptions: {
					bubble:{
						// minSize:100,
						// maxSize:200,
						minSize:'25%',
						maxSize:'40%'
					}
				},

		};
		$.extend(true,$defaults,chartOptions);
		var _chart = new Highcharts.Chart($defaults);
		return _chart;
	};

	
	
	
}])
