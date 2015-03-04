angular.module('DecisionWorkbench')

.service('ChartOptionsService',['UtilitiesService', function( UtilitiesService ) {

this.getSetGoalsData = function(data) {	
		return {
			
			title : {
			floating : true,
			align : 'left',
			style : {
				fontSize : '16px',
				color : '#0070c0',
				fontWeight : '400',
				fontFamily : 'Arial, sans-serif'
			}

		},
		xAxis : {
			categories : [ 'Current', 'Base Expected',
					'Deficit', 'Target' ],
			labels : {
				
					style : {
						fontFamily : 'Arial, sans-serif',
						color : 'black',
						fontSize : '10pt'
				
				}
			}
		},
		 plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    formatter: function(){
	                    	console.log("this:", this.point.isApplicable)
	                    	yVal = this.y;
	    					if(yVal < 0){
	    						yVal = -(yVal);
	    					}else if(yVal == 0 && this.point.isApplicable==false){
	    						yVal = 'Not Applicable ';
	    					}else if(yVal == 0){
	    						yVal = 'Zero '+this.x;
	    					}
	    					return UtilitiesService.getLocaleString(yVal);
	    				
	                    }
	                }
	            }
	        },
		
		legend : {
			enabled : false
		}
	}
	};
	
	this.getTopLeastEngagedData = function(data) {	
		return {	

			title : {
				text : ""
			}

		}
	};
	
	this.getTopLeastEngagedUserData = function(data) {	
		return {

			title : {
				text : ""
			}
		}
	};
	
	this.getBuildDoData = function(data) {	
		return {
	
		title : {
			floating : true,
			align : 'left',
			style : {
				fontSize : '16px',
				color : '#0070c0',
				fontWeight : '400',
				fontFamily : 'Carrois Gothic, sans-serif'
			}
		},
		xAxis : {
			categories : [ 'Current', 'Base Expected',
					'Deficit', 'Target', 'Conv Uplift',
					'Achievable' ],
			labels : {
				style : {
					fontFamily : 'Arial, sans-serif',
					color : 'black',
					fontSize : '10tpx'
				}
			}
		},
		legend : {
			enabled : false
		}
		}
	};
	
	this.getReviewDoBubbleData = function(data) {	
		return {
		title : {
			
			// floating: true,
			align : 'left',
			style : {
				fontSize : '16px',
				color : '#0070c0',
				fontWeight : '400',
				fontFamily : 'Open Sans,sans-serif'
			}
		},
		legend : {
			enabled : false
		},
		tooltip : {
			enabled : false
		}
		}
	};
	
	this.getReviewDoWaterfallData= function(data) {	
		return {
			
				title : {
				
					floating : true,
					align : 'left',
					style : {
						fontSize : '16px',
						color : '#0070c0',
						fontWeight : '400',
						fontFamily : 'Arial, sans-serif'
					}
				},
				
				legend : {
					enabled : false
				},
				tooltip : {
					enabled : false
				},
				xAxis : {
				
					
					categories : [ 'Current', 'Base Expected',
							'Deficit', 'Target', 'Conv Uplift DO1,2,5',
							'Achievable' ],
					labels : {
						style : {
							fontFamily : 'Arial, sans-serif',
							color : 'black',
							fontSize : '10pt'
						}
					}
				}
		
	
		}
	};
	
}]);