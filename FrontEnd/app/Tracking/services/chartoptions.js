angular.module('Tracking')

.service('ChartOptionsService', function(UtilitiesService) {

	this.getTrackSummaryAcqFunnel = function(data) {

		return {
			chart:{
//				height:300
			},
			legend: {
				align: "right",
				layout: "vertical",
				itemMarginTop: 15,
				itemMarginBottom: 5,
				//padding: 50,
				verticalAlign: 'middle',
				itemStyle: {
					color: '#000000',
					font: '10pt Carrois Gothic, sans-serif'
				},
				itemWidth: 150,
				symbolWidth: 10,
				symbolHeight:10,
				height: 100	,
				y:1,
				x:0
			},
			yAxis: {
				title:{
					text:'New Customers',
					style:{
						color: '#000000',
						font: '10pt Carrois Gothic, sans-serif'
					}
				}
			}
		};
	};



	this.getSparkleLineData = function(data){
		return{
			chart:{
				//height:100,
				//width:240
			}
		};
	};	

	this.getTrackSummaryAcqTrend = function(data) {

		return {
			
			legend: {
				align: "right",
				symbolPadding:20,
				layout: "vertical",
				itemMarginTop:20,
				itemMarginBottom:15,
				//padding: 50,
				verticalAlign: 'middle',
				itemStyle: {
					color: '#000000',
					font: '10pt Carrois Gothic, sans-serif'
				},
				//fill:'none',
				itemWidth: 100,
				symbolWidth: 20,
				symbolHeight:18,
				height: 250	,
				y:1,
				x:-50
			}
		};
	};	
	
	this.getBusinessImpactTrend = function() {	
		return {	
			chart:{
				//width:1024,
				height:300
			},
			legend: {
				align: "right",
				symbolPadding:20,
				layout: "vertical",
				itemMarginTop:28,
				itemMarginBottom:15,
				//padding: 50,
				verticalAlign: 'middle',
				itemStyle: {
					color: '#000000',
					font: '10pt Carrois Gothic, sans-serif'
				},
				//fill:'none',
				itemWidth: 100,
				symbolWidth: 20,
				symbolHeight:18,
				height: 250	,
				y:1,
				x:-50
			},
			yAxis: {
				gridLineWidth: 0,
				min: 0,
				title: {
					text: UtilitiesService.getLabel('track_BI_trend_title'),
					style:{
						color: '#000000',
						font: '12pt arial, sans-serif',
						fontWeight:'bold'
					}
				},
				labels:{
					formatter: function(){
						var val = this.value;
						return (parseInt(val) / 1000).toLocaleString()+' K';
					},
					style:{
						color: '#000000',
						font: '10pt arial, sans-serif'
					}
				}
			},

		};
	};

	

	this.getEngagementActivityScoreData = function(data) {	

		return {
			chart:{
				//height:225
			},
			xAxis: {
				labels:{
					rotation :40
				}
			},
			legend: {
				align: "right",
				layout: "vertical",
				itemMarginTop:0,
				itemMarginBottom:25,
				//padding: 50,
				verticalAlign: 'middle',
				itemStyle: {
					color: '#000000',
					font: '10pt Carrois Gothic, sans-serif'
				},
				itemWidth: 100,
				symbolWidth: 20,
				symbolHeight:18,
				height: 100	,
				y:1,
				x:-50
			},
			yAxis: {
				min:0,
				max:100,
				title: {
					text: UtilitiesService.getLabel('track_EA_engagement_score'),
					style:{
						color: '#000000',
						font: '11pt arial',
						fontWeight:'bold'
					}
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}],
				labels:{
					style:{
						color: '#000000',
						font: '10pt arial'
					}
				}
			}

		};
	};	
	
	this.getEngagementActivityTrendData = function(data) {	

		return {
			chart:{
				//width:1024,
				//height:300,

			},
			legend: {
				align: "right",
				symbolPadding:20,
				layout: "vertical",
				itemMarginTop:40,
				itemMarginBottom:15,
				//padding: 50,
				verticalAlign: 'middle',
				itemStyle: {
					color: '#000000',
					font: '10pt Carrois Gothic, sans-serif'
				},
				//fill:'none',
				itemWidth: 100,
				symbolWidth: 20,
				symbolHeight:18,
				height: 250	,
				y:1,
				x:-50
			},
			xAxis: {
				labels:{
					rotation :40
				}
			},
			yAxis: {
				min:0,
				max:100,
				title: {
					text: UtilitiesService.getLabel('track_UG_trend_title'),
					style:{
						color: '#000000',
						font: '12pt arial',
						fontWeight:'bold'
					}
				},
				gridLineWidth:0,
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}],
				labels:{
					enabled:true,
					formatter: function(){
						var val = this.value;
						return val+ ' K';
					},
					style:{
						color: '#000000',
						font: '10pt arial, sans-serif',
					}
				}
			}
		};
	};	
	this.getChannelSummary = function(){
		return{
			chartOptions:{
				chart:{
					height:260
				},
				legend: {
					enabled:false

				},
				tooltip:{
					backgroundColor:'#FFFF99',
					style: {
						padding: 20,
						fontWeight: 'bold',
						fontSize:'11px'
					}
				}

			}
		};
	};


	this.getChannelTrend = function(){
		return {
			chartOptions:{
				chart:{
					//width:1024,
//					height:300
				},
				legend: {
					align: "right",
					layout: "vertical",
					itemMarginTop: 15,
					itemMarginBottom: 5,
					verticalAlign: 'middle',
					itemStyle: {
						color: '#000000',
						font: '10pt Carrois Gothic, sans-serif'
					},
					itemWidth: 100,
					symbolWidth: 10,
					symbolHeight:10,
					height: 100	,
					y:1,
					x:-50
				},
			}
		};
	};

	this.getTopCampaign = function(){
		return{
			chartOptions:{
				chart:{
					height:200
				},
				legend: {
					align: "right",
					layout: "vertical",
					itemMarginTop: 15,
					itemMarginBottom: 5,
					//padding: 50,
					verticalAlign: 'middle',
					itemStyle: {
						color: '#000000',
						font: '10pt Carrois Gothic, sans-serif'
					},
					itemWidth: 200,
					symbolWidth: 10,
					symbolHeight:10,
					height: 100	,
					y:1,
					x:130
				},
				xAxis: {
					categories: ['Campaigns 1', 'Campaigns 2', 'Campaigns 3', 'Campaigns 4', 'Campaigns 5','Campaigns 6']
				},
			}
		};
	};

	this.getCampaignConvActivity = function(){
		return{
			chartOptions:{
				chart:{
					height:200
				},
				legend: {
					enabled:false
				},
			}

		};
	};

	this.getCampaignTrend = function(){
		return{
			chartOptions:{
				legend: {
					align: "right",
					layout: "vertical",
					itemMarginTop: 15,
					itemMarginBottom: 5,
					verticalAlign: 'middle',
					itemStyle: {
						color: '#000000',
						font: '10pt Carrois Gothic, sans-serif'
					},
					itemWidth: 100,
					symbolWidth: 10,
					symbolHeight:10,
					height: 100	,
					y:1,
					x:-100
				},
				yAxis: {
					title: {
						text: 'Number of NewSubs',
						style:{
							color: '#000000',
							font: '10pt Carrois Gothic, sans-serif'
						}
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}],
					labels:{
						style:{
							color: '#000000',
							font: '10pt Carrois Gothic, sans-serif'
						}
					}
				}
			}
		}
	};


	this.getCampaignStackedColumn = function(){
		return{
			chartOptions:{

				legend: {
					align: "right",
					layout: "vertical",
					itemMarginTop: 15,
					itemMarginBottom: 5,
					//padding: 50,
					verticalAlign: 'middle',
					itemStyle: {
						color: '#000000',
						font: '10pt Carrois Gothic, sans-serif'
					},
					itemWidth: 100,
					symbolWidth: 10,
					symbolHeight:10,
					height: 100	,
					y:1,
					x:-70
				},
				xAxis: {
					categories: ['Campaigns 1'],
					labels:{
						style: {
							color: '#000000',
							font: '10pt Carrois Gothic, sans-serif'
						}
					}
				},
				yAxis: {
					title: {
						text: 'Number of Users',
						style:{
							color: '#000000',
							font: '10pt Carrois Gothic, sans-serif'
						}
					},
					labels:{
						style:{
							fontFamily:'Open Sans, sans-serif',
							color:'black',
							fontSize:'13px'
						}
					}
				}
			}
		};
	};

	
	this.getUserGroupTrendData = function(data) {	
		return {

			chart:{
				//width:1024,
				height:300
			},
			legend: {
				align: "right",
				symbolPadding:20,
				layout: "vertical",
				itemMarginTop:40,
				itemMarginBottom:15,
				//padding: 50,
				verticalAlign:'middle',
				itemStyle: {
					color: '#000000',
					font: '10pt Carrois Gothic, sans-serif'
				},
				//fill:'none',
				itemWidth: 100,
				symbolWidth: 20,
				symbolHeight:18,
				height: 250	,
				y:1,
				x:-50
			},
			yAxis: {
				title: {
					text: UtilitiesService.getLabel('track_UG_trend_title'),
					style: {
						font:'12pt arial',
						color:'black',
						fontWeight:'bold'
					}
				},
				labels:{
					style:{
						color: '#000000',
						font: '10pt arial'
					}
				}
			}

		};
	};	
});