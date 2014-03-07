var errorLogs = angular.module('errorLogs', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/logs')
		.success(function(data) {
			$scope.logs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createLog = function() {
		var d = new Date().getTime();
		$scope.formData.date = d.toString();

		//preserve newlines in textarea
		var description = $scope.formData.description;
		$scope.formData.description = description.replace(/\r?\n/g, '<br />');
		$http.post('/api/logs', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.logs = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a error-log after checking it
	$scope.deleteLog = function(id) {
		$http.delete('/api/logs/' + id)
			.success(function(data) {
				$scope.logs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// view a error-log by id
	$scope.viewLog = function(id) {
		/*$http.get('/api/logs/' + id)
			.success(function(data) {
				$scope.errlog = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});*/

		var arr = $scope.logs;
		$scope.errlog = arr.find({_id : id});
		$('#myModal').modal('show');
	};

}
