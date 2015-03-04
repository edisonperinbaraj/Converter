angular.module("Settings")

.controller("usersInit",['$scope','CustomService' ,function ($scope, CustomService) {

    angular.element(document).ready(function () {
        setTimeout(function () { CustomService.appInit() }, 1);
    });

}])

.controller("usersListController",['$scope','UtilitiesService','DataService','RequestConstantsFactory','$rootScope',
                                   function ($scope, UtilitiesService, DataService, RequestConstantsFactory, $rootScope) {

    $scope.dataLoaded = false;
    $scope.options = UtilitiesService.getDataTableOptions();
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var userListActionsEdit;
    var userListActionsDelete;
    //To load the table when 'edit' functionality is done
    $rootScope.$on('usersDataChange', function (event, data) {
        $scope.addData(data);
    });

    $scope.addData = function (data) {
        try {
            $scope.error = false;
            $scope.dataLoaded = true;
            $scope.options.aaData = [];
            if (!data) {
                throw "noDataError";
            }
            $.each(data.userList, function (key, obj) {
                userListActionsEdit = "<a class='editleft' title='Edit' name='modal' href='#' data-id='" + obj.userId + "' data-modal='#editUsersDialog'></a>";
                userListActionsDelete = "<a class='delete' title='Delete' name='modal' data-id='" + obj.userId + "' href='#' data-modal='#deleteUserDialog'></a>";
                if($scope.isUsersEditable){
                	 $scope.options.aaData.push([obj.userName, obj.fName, obj.lName, obj.emailId, obj.dept, obj.role, userListActionsEdit + userListActionsDelete]);
                }else{
                	 $scope.options.aaData.push([obj.userName, obj.fName, obj.lName, obj.emailId, obj.dept, obj.role]);
                }
               
            })
        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    };

    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if(msg){
        	if(msg instanceof Object){
        		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
        	} else {
                $scope.errorMsg = msg;
        	}
        }
    }
    var requestData = {};

    var cacheKey = "userList" + JSON.stringify(requestData);
    function loadUsersData() {
        var func = $scope.addData;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getUsersListData(requestData, func, $scope.fail);
    }

    loadUsersData();
}])

.controller("rolesListController",['$scope' ,'UtilitiesService','DataService','RequestConstantsFactory','$rootScope',
                                   function ($scope, UtilitiesService, DataService, RequestConstantsFactory,$rootScope) {
	
    $scope.dataLoaded = false;
    $scope.options = UtilitiesService.getDataTableOptions();
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    //To load the table when any kind of 'edit' functionality is done
    $rootScope.$on('rolesDataChange', function (event, data) {
        $scope.addData(data);
    });
    var roleListActionsPermission;
    var roleListActionsEdit;
    var roleListActionsDelete;

    $scope.addData = function (data) {
        try {
        	var roleNames = [];
            $scope.error = false;
            $scope.dataLoaded = true;
            $scope.options.aaData = [];
            if (!data) {
                throw "noDataError";
            }
            $.each(data.roleList, function (key, obj) {
            	roleNames.push(obj.roleName);
            })
            //broadcasting roles names for the add role dialog box
            $rootScope.$broadcast('roleNames', roleNames);
            $.each(data.roleList, function (key, obj) {
                roleListActionsPermission = "<a class='editDialog lmargin' title='Edit' name='modal' href='#' data-id='" + obj.roleId + "' data-modal='#editPermissionsDialog'>Edit</a>";
                roleListActionsEdit = "<a class='edit vm  zmargin' title='Edit' name='modal' href='#' data-id='" + obj.roleId + "' data-modal='#editRoleDialog'></a>";
                roleListActionsDelete = "<a class='delete vm  zmargin' title='Delete' name='modal' data-id='" + obj.roleId + "' href='#' data-modal='#deleteRoleDialog'></a>";
               
                if($scope.isUsersEditable){
                	 $scope.options.aaData.push([obj.roleName, obj.roleDescription, roleListActionsPermission, roleListActionsEdit + roleListActionsDelete]);
               }else{
            	   $scope.options.aaData.push([obj.roleName, obj.roleDescription]);
               }
            })
        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    };

    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if(msg){
        	if(msg instanceof Object){
        		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
        	} else {
                $scope.errorMsg = msg;
        	}
        }
    }

    var requestData = {};

    var cacheKey = "roleList" + JSON.stringify(requestData);
    function loadRolesData() {
        var func = $scope.addData;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getRolesListData(requestData, func, $scope.fail);
    }

    loadRolesData();
}])

.controller("usersModalController",['$scope' ,'$q','ngTreetableParams','$element','DataService','$rootScope','RequestConstantsFactory','UtilitiesService','DataConversionService',
                                    function ($scope, $q, ngTreetableParams, $element, DataService, $rootScope, RequestConstantsFactory, UtilitiesService, DataConversionService) {

    var requestConstants = RequestConstantsFactory['USERS'];
    var notifyRequestConstants = RequestConstantsFactory['NOTIFICATION'];
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    //When editUser modal is clicked
    $rootScope.$on('userEdit', loadEditUserData);
    //When editRole modal is clicked
    $rootScope.$on('roleEdit', loadEditRoleData);
    //on clicking the users delete button
    $rootScope.$on('userDelete', getDeleteUserId);
    //on clicking the users delete button
    $rootScope.$on('roleDelete', getDeleteRoleId);
    //When addUser button is clicked
    $rootScope.$on('loadAddUser', loadAddUserDialog);
    //When addRoles button is clicked
    $rootScope.$on('loadAddRole', loadAddRoleDialog);
    //When the 'edit' in role table is clicked
    $rootScope.$on('permissionEdit', function (object, id) {
        $scope.showError = false;
        $scope.savingUserRole = false;
        $scope.error = false;
        $scope.permissionRoleId = id;
        //request for list permission role
        listPermissionRoleRequest[requestConstants.ROLE_ID] = $scope.permissionRoleId;
        //again to load tree table
        $scope.deferred.resolve($scope.permissionData);
        $scope.permissionValues.refresh();
    });

    $rootScope.$on('roleNames', function(event, roleNames){
        $scope.roles = roleNames;
    });
    $scope.dataLoaded = true;
    $scope.savingUserList = false;
    $scope.savingUserRole = false;
    var userId;
    var roleId;
    var deleteUserRequest = {};
    var deleteRoleRequest = {};
    var editUsersSaveRequest = {};
    var editRolesSaveRequest = {};
    var addUsersRequest = {};
    var addRolesRequest = {};
    var listPermissionRoleRequest = {};
    var updatePermissionRoleRequest = {};
    var permissionList = [];
    
    //for data in 'edit permissions'
    $scope.addData = function (data) {
        $scope.permissionData = data;
        $scope.deferred.resolve(data);
    };

    $scope.permissionValues = new ngTreetableParams({
        getNodes: function (parent) {
            $scope.deferred = $q.defer();
            if (parent == null) {
                loadPermissionsForRole(listPermissionRoleRequest);
            }
            return parent ? parent.children : $scope.deferred.promise;
        },
        getTemplate: function (node) {
            node.modelVar = getModelName(node.entityId);
            return 'tree-node';
        },

        options: {
            onNodeExpand: function () {
                console.log('Node expanded', arguments);
                //$scope.$apply();
            }
        }
    });
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        $scope.savingUserList = false;
        $scope.savingUserRole = false;
        if(msg){
        	if(msg instanceof Object){
        		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
        	} else {
                $scope.errorMsg = msg;
        	}
        }
    }
    $scope.checkBoxClicked = function (entityId, action) {
        //On checkbox click, due to model binding limitation with plugin,
        //we have to manually recurse through the data and enable/disable 
        //the permissions.
        var currentAction = null;
        function recurse(data, forceAction) {
            $.each(data, function (key, obj) {
                if (obj.entityId == entityId || forceAction == true) {
                    if (currentAction != null) {
                        obj[action] = currentAction;
                    } else {
                        obj[action] = !obj[action];
                        currentAction = obj[action];
                    }
                    recurse(obj.children, true);
                }
                if (obj.children && obj.children.length > 0)
                    recurse(obj.children, false);
                else {
                    return;
                }
            });
        }
        recurse($scope.permissionData, false);
        console.log("Changed Permissions", $scope.permissionData, arguments);
    }

    $scope.updatePermissions = function () {
        $scope.savingUserRole = true;
        permissionList = DataConversionService.toGetUpdatePermissionsForRole($scope.permissionData);
        updatePermissionRoleRequest[requestConstants.ROLE_ID] = $scope.permissionRoleId;
        updatePermissionRoleRequest[requestConstants.ROLE_PERMISSION_LIST] = permissionList;
        updatePermission(updatePermissionRoleRequest);
    }
    //Set the datas to scope to populate the edit user modal
    $scope.editUserSuccess = function (userTableData) {
        try {
            $scope.dataLoaded = true;
            $scope.error = false;
            if (!userTableData) {
                throw "noDataError";
            }
            //Set the scope variables to show data in editUser modal
            $.each(userTableData.userList, function (index, eachRow) {
                if (eachRow.userId == userId) {
                    $scope.userName = eachRow.userName;
                    $scope.password = eachRow.password;
                    $scope.firstName = eachRow.fName;
                    $scope.lastName = eachRow.lName;
                    $scope.emailId = eachRow.emailId;
                    $scope.department = eachRow.dept;
                    $.each($scope.roles, function (key, eachRole) {
                        if (eachRow.role == eachRole) {
                            $scope.selectedRole = $scope.roles[key];
                        }
                    })
                }
                $element.find(":selected").trigger('change');

            });
        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    };
    //Creating request when  save button is clicked in 'edit' user modal
    $scope.usersEditSave = function () {
        $scope.savingUserList = true;
        if(!$scope.userListForm.$valid){
			$('form').addClass("formError");
			$scope.savingUserList = false;
			return false;
		}else{
			$('form').removeClass("formError");
		}
        $scope.dataLoaded = false;
        //Request
        editUsersSaveRequest[requestConstants.USER_ID] = userId;
        editUsersSaveRequest[requestConstants.PASSWORD] = $scope.password;
        editUsersSaveRequest[requestConstants.USER_NAME] = $scope.userName;
        editUsersSaveRequest[requestConstants.FIRST_NAME] = $scope.firstName;
        editUsersSaveRequest[requestConstants.LAST_NAME] = $scope.lastName;
        editUsersSaveRequest[requestConstants.EMAIL_ID] = $scope.emailId;
        editUsersSaveRequest[requestConstants.DEPARTMENT] = $scope.department;
        editUsersSaveRequest[requestConstants.ROLE] = $scope.selectedRole;

        //function call
        usersEditSave(editUsersSaveRequest);
    };
    //Creating request when  save button is clicked in 'edit' role modal
    $scope.editRoleSave = function () {
        $scope.savingUserRole = true;
        if(!$scope.editRoleForm.$valid){
			$('form').addClass("formError");
			 $scope.savingUserRole = false;
			return false;
		}else{
			$('form').removeClass("formError");
		}
        var permissions = [];
        var entityObject = {};
        $scope.dataLoaded = false;
        //Request
        editRolesSaveRequest[requestConstants.ROLE_NAME] = $scope.roleName;
        editRolesSaveRequest[requestConstants.ROLE_DESCRIPTION] = $scope.description;

        //function call
        rolesEditSave(editRolesSaveRequest);
    };
    //When 'ok' button is clicked in delete user modal
    $scope.deleteUser = function () {
        $scope.savingUserList = true;
        deleteUser(deleteUserRequest);
    }
    //When 'ok' button is clicked in delete role modal
    $scope.deleteRole = function () {
        $scope.savingUserRole = true;
        deleteRole(deleteRoleRequest);
    }
    //sucess function for users
    $scope.success = function (data) {
        try {
            $scope.dataLoaded = true;
            $scope.error = false;
            if (!data) {
                throw "noDataError";
            }
            if (data.status == 'OK') {
                $scope.showError = false;
                $rootScope.$broadcast('usersDataChange', data);
                $('#mask, .window').hide();
                UtilitiesService.getNotifyMessage("User List Updated Successfully", notifyRequestConstants.SUCCESS);
                $scope.savingUserList = false;
            }
            else {
                $scope.showError = true;
                $scope.savingUserList = false;
            }
        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    };
    //sucess function for roles
    $scope.roleSuccess = function (data) {
        try {
            console.log("roleData:", data)
            $scope.dataLoaded = true;
            $scope.error = false;
            if (!data) {
                throw "noDataError";
            }
            if (data.status == 'OK') {
                $scope.showError = false;
                $rootScope.$broadcast('rolesDataChange', data);
                $('#mask, .window').hide();
                UtilitiesService.getNotifyMessage("User Role Updated Successfully", notifyRequestConstants.SUCCESS);
                $scope.savingUserRole = false;
            }
            else {
                $scope.showError = true;
                $scope.savingUserRole = false;
            }
        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    };
    //Creating request when add button is clicked in 'add' user modal
    $scope.addUser = function () {
        $scope.savingUserList = true;
        if(!$scope.userAddForm.$valid){
			$('form').addClass("formError");
			$scope.savingUserList = false;
			return false;
		}else{
			$('form').removeClass("formError");
		}
        $scope.dataLoaded = false;
        //Request
        addUsersRequest[requestConstants.USER_NAME] = $scope.addUserName;
        addUsersRequest[requestConstants.FIRST_NAME] = $scope.addFirstName;
        addUsersRequest[requestConstants.LAST_NAME] = $scope.addLastName;
        addUsersRequest[requestConstants.EMAIL_ID] = $scope.addEmailId;
        addUsersRequest[requestConstants.PASSWORD] = $scope.addPassword;
        addUsersRequest[requestConstants.DEPARTMENT] = $scope.addDepartment;
        addUsersRequest[requestConstants.ROLE] = $scope.addSelectedRole;
        //function call
        addUsers(addUsersRequest);
    };

    //Creating request when add button is clicked in 'add' role modal
    $scope.addRole = function () {
        $scope.savingUserRole = true;
        if(!$scope.addRoleForm.$valid){
			$('form').addClass("formError");
			$scope.savingUserRole = false;
			return false;
		}else{
			$('form').removeClass("formError");
		}
        var permissions = [];
        var entityObject = {};
        $scope.dataLoaded = false;
        //Request
        addRolesRequest[requestConstants.ROLE_NAME] = $scope.addRoleName;
        addRolesRequest[requestConstants.ROLE_DESCRIPTION] = $scope.addDescription;
//        entityObject[requestConstants.ROLE_ENTITY_ID] = "";
//        entityObject[requestConstants.ROLE_ENTITY_NAME] = "";
//        entityObject[requestConstants.ROLE_READ_PERMISSION] = true;
//        entityObject[requestConstants.ROLE_WRITE_PERMISSION] = false;
//        permissions.push(entityObject);
//        addRolesRequest['permissions'] = permissions;
        console.log("REQUEST", addRolesRequest)
        //function call
        addRoles(addRolesRequest);
    };

    //Set the datas to scope to populate the edit role modal
    $scope.editRoleSuccess = function (roleTableData) {
        try {
            $scope.dataLoaded = true;
            $scope.error = false;
            if (!roleTableData) {
                throw "noDataError";
            }
            //Set the scope variables to show data in editRole modal
            $.each(roleTableData.roleList, function (index, eachRow) {
                if (eachRow.roleId == roleId) {
                    $scope.roleName = eachRow.roleName;
                    $scope.description = eachRow.roleDescription;
                }
                $scope.$apply();
            });
        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    };
    //Success function for permission update
    $scope.updatePermissionSuccess = function (data) {
        try {
            $scope.dataLoaded = true;
            $scope.error = false;
            if (data.status == 'OK') {
                $scope.showError = true;
                $('#mask, .window').hide();
                UtilitiesService.getNotifyMessage("Permissions Updated Successfully", notifyRequestConstants.SUCCESS);
                $scope.savingUserRole = false;
            } else {
                $scope.showError = true;
                $scope.savingUserRole = false;
            }

        } catch (e) {
        	  $scope.fail(errorConstants.DATA_ERR);
        }
    }

    //Get name of model variable generated dynamically.
    var getModelName = function (entityId) {
        var indexArray = [];
        var modelStr = "permissionData";
        var temp = "";
        var found = false;
        function recurse(data, depthCtr) {
            $.each(data, function (key, obj) {
                indexArray[depthCtr] = key;
                if (obj.entityId == entityId) {
                    found = true;
                    return false;
                }
                if (obj.children && obj.children.length > 0) {
                    if (!recurse(obj.children, depthCtr + 1)) {
                        if (found) {
                            return false;
                        }
                        else {
                            indexArray.pop();
                        }
                    }
                }
            });
        }
        recurse($scope.permissionData, 0);

        for (var index = 0; index < indexArray.length; index++) {
            if (indexArray.length == 1 || index == 0)
                modelStr += "[" + indexArray[0] + "]";
            else
                modelStr += ".children[" + indexArray[index] + "]";
        }
        return modelStr;
    }



    function loadPermissionsForRole(requestData) {
    	if(jQuery.isEmptyObject(requestData)){
    		return false;
    	}
        var cacheKey = "permissionRole" + JSON.stringify(requestData);
        var func = $scope.addData;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getPermissionForRole(requestData, func, $scope.fail);
    }

    /*--------For modal data-------*/
    //To get the data for edit users modal 
    function loadEditUserData(object, id) {
        $scope.showError = false;
        $scope.error = false;
        $scope.savingUserList = false;
        $scope.$apply();
        var requestData = {};
        userId = id;
        var func = $scope.editUserSuccess;
        DataService.getUsersListData(requestData, func, $scope.fail);
    }
    //to add the users
    function addUsers(requestData) {
        var func = $scope.success;
        DataService.addUsers(requestData, func, $scope.fail);
    }
    //to add roles
    function addRoles(requestData) {
        var func = $scope.roleSuccess;
        DataService.addRoles(requestData, func, $scope.fail);
    }
    //to save the edited users
    function usersEditSave(requestData) {
        var func = $scope.success;
        DataService.editUsersSave(requestData, func, $scope.fail);
    }
    //to save the edited roles
    function rolesEditSave(requestData) {
        var func = $scope.roleSuccess;
        DataService.editRolesSave(requestData, func, $scope.fail);
    }

    //to update the permission for role
    function updatePermission(requestData) {
        var func = $scope.updatePermissionSuccess;
        DataService.updatePermissionForRole(requestData, func, $scope.fail);
    }
    //To get the data for edit roles modal 
    function loadEditRoleData(object, id) {
        $scope.showError = false;
        $scope.error = false;
        $scope.savingUserRole = false;
        var requestData = {};
        roleId = id;
        var func = $scope.editRoleSuccess;
        DataService.getRolesListData(requestData, func, $scope.fail);
    }
    //to delete the particular User
    function deleteUser(requestData) {
        var func = $scope.success;
        DataService.deleteUser(requestData, func, $scope.fail);
    }
    //to delete the particular Role
    function deleteRole(requestData) {
        var func = $scope.roleSuccess;
        DataService.deleteRole(requestData, func, $scope.fail);
    }
    //To get the data for delete User 
    function getDeleteUserId(object, id) {
        $scope.showError = false;
        $scope.error = false;
        $scope.savingUserList = false;
        $scope.$apply();
        var deleteUserId = id;
        deleteUserRequest[requestConstants.USER_ID] = deleteUserId;
    }
    //To get the data for delete Role 
    function getDeleteRoleId(object, id) {
        $scope.showError = false;
        $scope.error = false;
        $scope.savingUserRole = false;
        $scope.$apply();
        var deleteRoleId = id;
        deleteRoleRequest[requestConstants.ROLE_ID] = deleteRoleId;
    }
    //To load add user dialog
    function loadAddUserDialog() {
        $scope.showError = false;
        $scope.error = false;
        $scope.savingUserList = false;
        $scope.$apply();
    }
    //To load add roles dialog
    function loadAddRoleDialog() {
        $scope.showError = false;
        $scope.error = false;
        $scope.savingUserRole = false;
        $scope.$apply();
    }
}])