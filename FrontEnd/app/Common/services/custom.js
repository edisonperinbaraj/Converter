angular.module('AnalyticsApp')

.service("CustomService",['$location','$rootScope', function ($location,$rootScope) {
	this.appInit = function() {

		if(!(window.navigator.userAgent.indexOf('Chrome')>0) && !(window.navigator.userAgent.indexOf('Firefox')>0) && !(window.navigator.userAgent.indexOf('Safari')>0) && !(window.navigator.userAgent.indexOf('Opera')>0)){
			webshims.setOptions('forms', {
			    //show custom styleable validation bubble
			    replaceValidationUI: true
			});
			webshims.polyfill('forms');
		}
		

		window.scrollTo(0,0);
		$('[rel]').on('click', function() {
			console.log("ss")
			var tab = $(this);
			var tabId = tab.attr('rel');
			tab.addClass('active').siblings().removeClass('active');
			tab.closest('.contentPanel').find('#'+tabId).fadeIn().siblings().hide();
		});
		
		/*
		*	Modify Dialog Button Events.
		*/
		var acc_link = $('.acc_link');
		if (acc_link.length > 0) {
			acc_link.click(function (event) {
				event.preventDefault();
				if (!$(this).hasClass('acc-active')) {
					$('.acc_link').removeClass('acc-active')
					$('.acc_container').slideUp().removeClass('acc-container-active');

				}
				$(this).toggleClass('acc-active');
				var id = $(this).attr('rel');
				$('#' + id).slideToggle().toggleClass('acc-container-active');
				$('.menu_head').toggle();
				$("html, body").animate({ scrollTop: $(document).height() }, 1000);
			});
			$('.acc_container #closeButton').click(function () {
				$('.acc_link').removeClass('acc-active');
				$('.menu_head').show();
				$(this).closest('.acc_container').slideUp();
			});
			$('.closeButton').click(function () {
				$('.acc_link').removeClass('acc-active');
				$('.menu_head').show();
				$(this).closest('.acc_container').slideUp();
			});
		}

		var lightbox = $('.lightboxclick');
		if (lightbox.length > 0) {
			lightbox.click(function () {
				$('#popup_box, .overlay').fadeIn();
				return false;
			});
			$('#popup_box #closeButton').click(function () {
				$('#popup_box, .overlay').fadeOut();
			});
		}


		var selectbox = $('select');
		if (selectbox.length > 0) {
			$("select:not([class^=ui-date])").each(function () {
				if(!$(this).parent().hasClass('select-wrapper')) {
					$(this).wrap("<span class='select-wrapper'></span>");
					$(this).after("<span class='holder'></span>");
				}
			});
			$("select:not([class^=ui-date])").change(function (e) {
				var selectedOption = $(this).find(":selected").text();
				$(this).next(".holder").text(selectedOption);
			}).trigger('change');
		}

		/* Generalised click event for xclose btns */
		$(document).off('click',".xclose").on('click',".xclose",function () {
			$(this).toggleClass("expandclose");
			$(this).closest('div').find('.filterContainer, .Acquisition').slideToggle("slow");
			$('html, body').animate({
				scrollTop: $(this).offset().top
			}, 1000);
		});
		
		//////////////////////POPOVER STARTS/////////////////////

		$(document).ready(function () {

			$('.options-filter').hide();
			
			//For temporary change in user group summary only 
			$('.pop').mouseleave(function (e) {
				e.preventDefault();
				if(!$(this).closest('.contentPanel1').find('.options-filter').is(':visible')) 
				$('.options-filter').hide();
				$(this).closest('.contentPanel1').find('.options-filter').toggle();
				$('.transparentMask').hide();
				$rootScope.$broadcast('menuSave');
			});




			//select all the a tag with name equal to modal
			$(document).off("click", 'a[name=modal]').on("click", 'a[name=modal]',function (e) {
				//Cancel the link behavior
				e.preventDefault();
                var id = $(this).data('modal');
				if(id == '#modifyDialog'){
					$rootScope.$broadcast('decisionModify',$(this).attr("data-id"))
				}
				if(id == '#modifyReviewdoDialog'){
					$rootScope.$broadcast('reviewdoModify',$(this).attr("data-id"))
				}
				if(id == '#dialog'){
					$rootScope.$broadcast('decisionValidate',$(this).attr("data-id"))
				}
				if(id == '#campaignDialog'){
					$rootScope.$broadcast('UGClicked',$(this).closest('tr').index());	
				}
				if(id == '#channelEditDialog'){
					$rootScope.$broadcast('channelEdit',$(this).attr("data-id"));	
				}
				if(id == '#deleteChannelDialog'){
					$rootScope.$broadcast('channelDelete',$(this).attr("data-id"));	
				}
				if(id == '#editPermissionsDialog'){
					$rootScope.$broadcast('permissionEdit',$(this).attr("data-id"));	
				}
				if(id == '#editUsersDialog'){
					$rootScope.$broadcast('userEdit',$(this).attr("data-id"));	
				}
				if(id == '#editGoalsDialog'){
					$rootScope.$broadcast('goalEdit',$(this).attr("data-id"));	
				}
				if(id == '#editRoleDialog'){
					$rootScope.$broadcast('roleEdit',$(this).attr("data-id"));	
				}
				if(id == '#deleteUserDialog'){
					$rootScope.$broadcast('userDelete',$(this).attr("data-id"));	
				}
				if(id == '#addModelDialog'){
					$rootScope.$broadcast('addModel');	
				}
				if(id == '#addChannelsDialog'){
					$rootScope.$broadcast('loadAddChannel');	
				}
				if(id == '#addUsersDialog'){
					$rootScope.$broadcast('loadAddUser');	
				}
				if(id == '#addRoleDialog'){
					$rootScope.$broadcast('loadAddRole');	
				}
				if(id == '#deleteRoleDialog'){
					$rootScope.$broadcast('roleDelete',$(this).attr("data-id"));	
				}
				if(id == '#labelEditDialog'){
					$rootScope.$broadcast('labelConfigEdit',$(this).attr("data-id"))
				}
				//Get the A tag
				
				//Get the screen height and width
				var maskHeight = $(document).height();
				var maskWidth = $(window).width();

				//Set height and width to mask to fill up the whole screen
				$('#mask').css({ 'width': maskWidth, 'height': maskHeight });

				//transition effect        
				$('#mask').fadeIn(500);
				$('#mask').fadeTo("slow", 0.8);

				//Get the window height and width
				var winH = $(window).height();
				var winW = $(window).width();
				//Set the popup window to center
				$(id).css('top', winH / 2 - $(id).height() / 2);
				$(id).css('left', winW / 2 - $(id).width() / 2);

				//transition effect
				$(id).fadeIn(2000);
			
			    //Populating fields
			    var thead = $(this).closest('tbody').siblings('thead');
			    var rowValues = $(this).closest('tr').find('td').map(function(i){
				    var key = thead.find('th:eq('+i+')').text().trim().replace(/\s+/g, " ");
				    var object = {};
				    object[key] = $(this).text().trim();
				    return object;
			    }).get();


			});

			//if close button is clicked
			$('.window .close').click(function (e) {
				//Cancel the link behavior
                e.preventDefault();
				$('#mask, .window').hide();
			});
			
			$('.window .cancel').click(function (e) {
				//Cancel the link behavior
                e.preventDefault();
				$('#mask, .window').hide();
			});
			//activate modal - activate - reviewdo tabel
			$('.window .activate').click(function (e) {
				//Cancel the link behavior
				e.preventDefault();
				$('#mask, .window').hide();
				$('.decision-option .switch').addClass('on');
				console.log("deactivated")
			});
			
//			//activate modal - save - reviewdo tabel
//			$('.window .save').click(function (e) {
//				//Cancel the link behavior
//				e.preventDefault();
//				$('#mask, .window').hide();
//			});
			//if mask is clicked
			$('#mask').click(function () {
                $(this).hide();
				$('.window').hide();
			});

		});
		$(document).ready(function () {
			$(window).resize(function () {
				var box = $('#boxes .window');
				//Get the screen height and width
				var maskHeight = $(document).height();
				var maskWidth = $(window).width();
				//Set height and width to mask to fill up the whole screen
				$('#mask').css({ 'width': maskWidth, 'height': maskHeight });
				//Get the window height and width
				var winH = $(window).height();
				var winW = $(window).width();
				//Set the popup window to center
				box.css('top', winH / 2 - box.height() / 2);
				box.css('left', winW / 2 - box.width() / 2);
			});
		});
		$(document).keyup(function (e) {
			if (e.keyCode == 27) {
				$('#mask').hide();
				$('.window').hide();
			}
		});

				window.createDataTables = function() {
					
				//Cleaning DataTables plugin extra containers
					$('.ADtable:not(.dataTable):not(.no-pagination), .GDtable:not(.dataTable):not(.no-pagination)').dataTable({
					
					//"scrollX": true,
					"scrollCollapse": false,
					"paging":         true,
					"iDisplayLength": 5,
					"bSort": true,
					"bInfo" : false,
					"bFilter" : false, 
					"bAutoWidth": false,
					"bFilter" : false,               
					"bLengthChange": false,
					// CODE FOR EXPORT ICON IN DATATABLES
					/*"dom": 'T<"dataTableContainer"t><p>',
					"tableTools": {
		            	"sSwfPath" : "js/lib/jquery/plugins/swf/copy_csv_xls_pdf.swf",
		            	aButtons: [
	            	                {
	            	                    "sExtends":    "collection",
	            	                    "sButtonClass": "path",
	            	                    "sButtonText":'',
	            	                    "aButtons":    [ "csv", "xls", "pdf" ]
	            	                }
	            	            ]
		            }*/
				});
				$('.no-pagination').dataTable({
					"scrollY": "80px",
					"paging": false,
					"bSort": true,
					"bInfo" : false,
					"bFilter" : false, 
					"bAutoWidth": false,
					"bFilter" : false,               
					"bLengthChange": false
				});
			};

			$(document).keyup(function (e) {
			  if (e.keyCode == 27) {
				$('#mask').hide();
				$('.window').hide();
			  }
			});

			//////////////////////POPOVER ENDS///////////////////////

			//Clear Filters red X
			/*$('.sclose').on('click', function(){
				$(this).prev().remove();
				$(this).remove();
			});*/

			//Activate toggle
			/*$(document).off('click', '[rel="activateBtn"]').on('click', '[rel="activateBtn"]', function(e) {
				console.log('SOMETHING');
				var id = $(this).data('modal');
				console.log("ID",id)
				if(id == 'responsibiltyModal'){
					$rootScope.$broadcast('activated',$(this).attr("data-id"))
				}
				if($(this).closest('div').hasClass('deactivated')) {
					e.preventDefault();
					return false;
			}
				if($(this).closest('div').hasClass('on')) {
					//Get the screen height and width
					var maskHeight = $(document).height();
					var maskWidth = $(window).width();

					//Set height and width to mask to fill up the whole screen
					$('#mask').css({ 'width': maskWidth, 'height': maskHeight });

					//transition effect        
					$('#mask').fadeIn(1000);
					$('#mask').fadeTo("slow", 0.8);

					//Get the window height and width
					var winH = $(window).height();
					var winW = $(window).width();
					
					var responsibiltyModal = $('#responsibiltyModal');
					//Set the popup window to center
					responsibiltyModal.css('top', winH / 2 - responsibiltyModal.height() / 2);
					responsibiltyModal.css('left', winW / 2 - responsibiltyModal.width() / 2);

					//transition effect
					responsibiltyModal.fadeIn(2000);
					window.temp = $(this);
				}
			})*/

			//Activate Table zoom
			$(document).off('click', '.zoomThis').on('click', '.zoomThis', function(e) {
				e.preventDefault();
				//Get the screen height and width
				var maskHeight = $(document).height();
				var maskWidth = $(window).width();

				//Set height and width to mask to fill up the whole screen
				$('#mask').css({ 'width': maskWidth, 'height': maskHeight });

				//transition effect        
				$('#mask').fadeIn(1000);
				$('#mask').fadeTo("slow", 0.8);

				//Get the window height and width
				var winH = $(window).height();
				var winW = $(window).width();

                /*  Cannot Fix "Sorting is not persistant while clicking zoomthis" due to a bug in the plugin. Refer link below
                    https://datatables.net/forums/discussion/19228/post-initialise-access-to-multiple-datatables-on-one-page
                */
				
				$(this).siblings('.dataTables_wrapper').find('.ADtable, .GDtable').dataTable().fnDestroy();
				$('#tableZoom .modalcontent').empty().append($(this).siblings('table').clone()).attr('data-controller', $(this).closest('[ng-controller]').attr('ng-controller'));
				$('#tableZoom table').dataTable({
					"scrollCollapse": true,
					"paging":         true,
					"iDisplayLength": 5,
					"bSort": true,
					"bInfo" : false,
					"bFilter" : false, 
					"bAutoWidth": false,
					"bFilter" : false,               
					"bLengthChange": false,
					"bRetrieve":true,
					"bDestroy":false,
					"dom": '<"dataTableContainer"t><p>',
					"initComplete": function () {
						var api = this.api();
						window.createDataTables();
					}
				});
				//$('#tableZoom .dataTables_filter, #tableZoom .dataTables_length, #tableZoom .dataTables_info').remove();
				
				
				var tableModal = $('#tableZoom');
				//Set the popup window to center
				tableModal.css('top', winH / 2 - tableModal.height() / 2);
				tableModal.css('left', winW / 2 - tableModal.width() / 2);

				//transition effect
				tableModal.fadeIn(2000);
				var heading=$(this).closest('.tableHeading').find('li.active').html()
				window.hhh=$(this);
				if(typeof heading==='undefined'){
					heading=$(this).closest('.AcquisitionPanel ').find('.heading span').html()
				}
				if(typeof heading==='undefined'){
					heading=$(this).closest('.ContainerBox').find('.heading span').html()
				}
				if(typeof heading==='undefined'){
					heading=$(this).closest('.AcquisitionPanel').find('.heading .subTitle').html()
				}
				$('#tableZoom .modalheading h2').html(heading);
				
			});
			
						
			$('.box-list>li').on('click', function(){
				if($('.summaryTitle').text().trim() == "Summary")
					return false;
				var arrow = $(this).attr('data-rel');
				$(this).find('.arrow-blue-down').remove();
				if(arrow == "arrowTrue")
					$(this).addClass('selected').append('<span class="arrow-blue-down">'+'<img src="images/arrow_down_blue.png">'+'</span>').siblings('li').removeClass('selected').find('.arrow-blue-down').remove();
				else
					$(this).addClass('selected');
			});
		
		$('.transparentMask').on('click', function(e) {
			$('.options-filter').stop().hide();
			$('.transparentMask').hide();
			$rootScope.$broadcast('menuSave');
		});
		$(".filter-option-menu").on('click', function(e){
			$(this).siblings('.options-filter').show();
			$('.transparentMask').show();
			
			//Get the screen height and width
			var maskHeight = $(document).height();
			var maskWidth = $(window).width();

			//Set height and width to mask to fill up the whole screen
			$('.transparentMask').css({ 'width': maskWidth, 'height': maskHeight });
		});
        
	};
	
	
	this.addDonutCircle = function(containerId, options) {
		var defaultOptions = {
			id:         containerId,
			percentage: 87,
			radius:     90,
			width:      8,
			number:     87,
			text:       '%',
			colors:     ['#eee', '#72c02c'],
			duration:   2000
		};
		options = $.extend({}, defaultOptions, options);
		Circles.create(options);
	};
}]);