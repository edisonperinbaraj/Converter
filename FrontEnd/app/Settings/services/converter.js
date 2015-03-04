angular.module('Settings')

.service('DataConversionService',['UtilitiesService',function (UtilitiesService) {
	
	this.toGetPermissionsForRole  = function(data) {
		var finalData = [];
		var module = [];
		var group = [];
		var section = [];
		var entity = [];
		var depthIndexArray = ['module', 'group', 'section', 'entity'];

		function recurse(data, depth){
			var tempArray = [];
			$.each(data, function (key, obj) {
            	tempArray.push({
            		entityId: obj[depthIndexArray[depth]+'Id'],
            		entity: obj[depthIndexArray[depth]+'Name'],
            		isEdit: obj[depthIndexArray[depth]+'Permission'].writePermission,
            		isView: obj[depthIndexArray[depth]+'Permission'].readPermission,
            		children: []
            	});
            	if(obj[depthIndexArray[depth+1]+'List'] && obj[depthIndexArray[depth+1]+'List'].length > 0){
            		tempArray[key].children = recurse(obj[depthIndexArray[depth+1]+'List'], depth+1);
            	}
            });
            return tempArray;
        }
       // console.log('DATATAAAA', recurse(data, 0));
        finalData = recurse(data, 0);
        return finalData;
	}
	this.toGetUpdatePermissionsForRole  = function(data) {
		var finalData = [];
		var depthIndexArray = ['module', 'group', 'section', 'entity'];
		function recurse(data, depth){
			var tempArray = [];
			var permissions = {};
			$.each(data, function (key, obj) {
				var tempObj = {};
				tempObj[depthIndexArray[depth]+'Id'] =  obj.entityId;
				tempObj[depthIndexArray[depth]+'Name'] =  obj.entity;
				permissions['readPermission'] = obj.isView;
				permissions['writePermission'] = obj.isEdit;
				tempObj[depthIndexArray[depth]+'Permission'] = permissions;
				if(obj.children && obj.children.length > 0){
            		tempObj[depthIndexArray[depth+1]+'List'] = recurse(obj.children, depth+1);
            	}
				tempArray.push(tempObj);
            });
			return tempArray;
        }
        finalData = recurse(data, 0);
        return finalData;
	}
	//converting for audit trail setup
	this.toGetAuditTrailSetup  = function(data) {
		$.each(data.moduleList, function(index, obj){
			data.moduleList[index].selected = false;
		})
		$.each(data.activityList, function(index, obj){
			data.activityList[index].selected = false;
		})
        return data;
	}
	//converting userlist for audit trail setup
	this.toGetAuditTrailUserList  = function(data) {
		var finalData = [];
		$.each(data.userList, function(index, obj){
			var tempObj = {};
			tempObj.userName = obj.userName;
			tempObj.userId = obj.userId;
			tempObj.selected = false;
			finalData.push(tempObj);
		})
        return finalData;
	}
// targets table conversion
	this.toGetTargetsTableData  = function(data) {
		var targetValues = [];
		targetValues.push(data);
		return targetValues;
	}
	
	
}])