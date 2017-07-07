angular.module('updateItemModule',['serviceModule'])
.controller('updateItem',function($rootScope,$scope,$state,$stateParams,$http,user){
	$scope.item = $stateParams.item ;
	// console.log("price = "+$scope.item.price+" "+typeof($scope.item.price)+" "+$scope.item.price.length)
	// console.log("stockInHand = "+$scope.item.availableStock+" "+typeof($scope.item.availableStock))
	if ( $scope.item.barCode === "BARCODE NOT DEFINED")
		$state.go('dashboard')

	$scope.toUpper = function(modelName){
		if ( modelName === "itemBarCode"){
			$scope.itemBarCode = $scope.itemBarCode.toUpperCase() ;
		} else if ( modelName === "itemName" ){
			if ( $scope.itemBarCode === undefined || $scope.itemBarCode === "" ){
				$rootScope.same = true ;
			}
			$scope.itemName = $scope.itemName.toUpperCase() ;
			if ( $rootScope.same == true ){
				$scope.itemBarCode = $scope.itemName
			}
		}
	}

	$scope.checkNumber = function(modelName){
		var key = event.keyCode ;
		if ( (key >= 48 && key <= 57) || key == 8 || (key >= 96 && key <= 105) || key == 110 || key == 190 )
			valid = true ;
		else 
			valid = false ;

		if ( modelName === "totalStock" ){
			if ( !valid ){
				$scope.totalStock = $rootScope.temp ;
			} else if ( valid && $scope.totalStock == undefined ){
				$rootScope.temp = '' ;
			} else if ( valid && $scope.totalStock.length >= 1 && $scope.totalStock != undefined ){
				$rootScope.temp = $scope.totalStock ;
			}
		} else if ( modelName === "stockInHand"){
			if ( !valid ){
				$scope.stockInHand = $rootScope.temp ;
			} else if ( valid && $scope.stockInHand == undefined ){
				$rootScope.temp = '' ;
			} else if ( valid && $scope.stockInHand.length >= 1 && $scope.stockInHand != undefined ){
				$rootScope.temp = $scope.stockInHand ;
			}
		} else if ( modelName === "price"){
			if ( !valid ){
				$scope.price = $rootScope.temp ;
			} else if ( valid && $scope.price == undefined ){
				$rootScope.temp = '' ;
			} else if ( valid && $scope.price.length >= 1 && $scope.price != undefined ){
				$rootScope.temp = $scope.price ;
			}
		}
	}
	$scope.rst = function(val){
		if(val === "same")
			$rootScope.same = false ;
		else if ( val === "valid")
			$rootScope.valid = true ;
		else if ( val === "temp")
			$rootScope.temp = '' ;
	}	

	$scope.submit = function(){
		if(!checkEquality()){
			if($scope.itemBarCode != undefined && $scope.itemName != undefined && $scope.price != '' ){
				if($scope.itemBarCode.length >= 2 && $scope.itemName.length >= 2 && $scope.price >= 1 ){
					if ( $scope.stockInHand != undefined && $scope.stockInHand != '' ){
						if ( $scope.totalStock != undefined && $scope.totalStock != '' ){
							if ( $scope.totalStock < $scope.stockInHand ){
								$scope.errorMsg = "!! AVAILABLE STOCK CANT BE MORE THAN TOTAL STOCK !!"
								showToast("error")
								return ;
							}
						} else {
							$scope.errorMsg = "** ENTER BOTH STOCK VALUES **"
							showToast("error")
							return ;
						}
					}
					$scope.errorMsg = "LOADING"
					showLoading();
					var data = "barcode=" + $scope.itemBarCode + "&name=" + $scope.itemName + "&price=" + $scope.price
					if ( $scope.stockInHand != undefined && $scope.stockInHand != '' )
						data += "&stockInHand="+$scope.stockInHand ;
					if ( $scope.totalStock != undefined && $scope.totalStock != '' )
						data += "&totalStock="+$scope.totalStock ;
					data += "&token="+user.getToken()
					console.log(data)
					update(data)
					.then(function(res){
						showToast("success");
						setTimeout(function() { $state.go('view_stock') ; }, 500);
					},function(err){
						console.log("from main err= "+err)
						showToast("error");
					})
				}
				else{
					$scope.errorMsg = "SOME VALUES ARE TOO SHORT" ;
					showToast("normal");
				}
			} else {
				$scope.errorMsg = "!! ERROR ADDING ITEM !!"
				showToast("error");
			}
		} else {
			$scope.errorMsg = "!! THERE ARENT ANY CHANGES TO UPDATE !!"
			showToast("error")
			return ;
		}
	}

	var checkEquality = function(){
		if (
				$stateParams.item.barCode == $scope.itemBarCode &&
				$stateParams.item.name == $scope.itemName && 
				$stateParams.item.price == $scope.price && 
				$stateParams.item.availableStock == $scope.stockInHand &&
				$stateParams.item.totalStock == $scope.totalStock  
			) return true ;
		else  return false ;
	}

	var update = function( dataObj ){
		return new Promise(function(resolve,reject){
			$http({
				url : "/updateItem/"+$stateParams.item.barCode,
				method : 'PUT',
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				},
				data : dataObj
			})
			.then(function(response){
				if ( response.data.status === "SXS" ){
					$scope.errorMsg = "ITEM SUCCESSFULLY UPDATED"
					resolve("SUCCESS")
				} else {
					if (response.data.status === "REDUNDANT") {
						$scope.errorMsg = "ITEM WITH NEW BARCODE ALREADY EXISTS"
					} else {
						$scope.errorMsg = "!! ERROR ADDING ITEM !!"
					}
					reject ("ERROR1") 
				}
			},function(err){
				$scope.errorMsg = "!! ERROR ADDING ITEM !!"
				reject ("ERROR2") 
			})
	})
	}
})