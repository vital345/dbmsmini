var tApp = angular.module('todoApp', ['ngRoute'],function($interpolateProvider){
	$interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
tApp.controller('TodoController', ['$scope', '$http', '$window', '$route', function($scope, $http, $window, $route) {
	$scope.login = function(){
		$http({
			url: '/login',
			method: 'POST',
			data: JSON.stringify({
				'emailaddress':$scope.login.emailaddress,
				'password':$scope.login.password
			}),
			headers: {'Content-Type':'application/json'}
		}).then(function(response){

			if(response.status == 200){
                console.log(response.data['message']);
                $window.location.reload();
			}
			else{
                console.log(response.data['message']);
			}
		});
	}

	$scope.signup = function(){
		console.log('register');
		$http({
			url: '/register',
			method: 'POST',
			data: JSON.stringify({
				'username':$scope.signup.username,
                'password':$scope.signup.password,
                'emailaddress':$scope.signup.emailaddress,
                'firstname' : $scope.signup.firstname,
                'lastname':$scope.signup.lastname
			}),
			headers: {'Content-Type':'application/json'}
		}).then(function(response){

			console.log(response.data.message);
			if(response.data.message == "Username already taken.."){
                console.log(response.data.message);
                swal('Awww no!!',response.data.message, 'error');
			}else if(response.data.message == "Email address already taken.."){
				swal('Awww no!!',response.data.message, 'error');
			}
			else{
				swal('Good job!','Now you can log in!!','success');
			}
			
		});
	}

	$scope.logout = function(){
		$http({
			url: '/logout',
			method: 'GET',
			headers: {'Content-Type':'application/json'}
		}).then(function(response){

			if(response.status == 200){
				$window.location.reload();
			}
			else{

			}
		});
	}
	$scope.saveTask = function(data){
		console.log(data);
		console.log('save tasks');
		$http({
			url: '/task',
			method: 'POST',
			data:{
				'title':data.title,
                'description':data.content,
                'remainders' : data.remainder,
				'completed':false,
				'date':data.duedate,
                'repeats':{
                    'd_repeats' : data.repeats.daily,
                    'm_repeats' : data.repeats.monthly,
                    'y_repeats' : data.repeats.yearly
                },
                'priority' : {
                    'red': data.priority.red,
                    'yellow':data.priority.yellow,
                    'green':data.priority.green
                },
                'project' :
                {
                    'personal' : data.project.personal,
                    'family':data.project.family,
                    'work':data.project.work,
                    'shopping':data.project.shopping
                }

			},
			headers:{'Content-Type':'application/json'}
		}).then(function(response) {
			if(response.status == 200){
				$scope.tasks = response.data.tasks;
				$scope.beforeTasksChanged = angular.copy(response.data.tasks);
				swal('Way to go!','You have added a new task!!','success');
				setTimeout(()=>$window.location.reload(), 2000);
				// $window.location.reload();
				
			}
			else{
				swal('Aww NOOO!',"We couldn't add it for you! Please try again!", 'error')
			}
		})
	}
	$scope.getTasks = function(){
		console.log('gettasks');
		$http({
			url: '/task',
			method: 'GET',
			headers: {'Content-Type':'application/json'}
		}).then(function(response){
            console.log(response.data.Tasks);
			$scope.tasks = response.data.Tasks;
			$scope.beforeTasksChanged = angular.copy(response.data.Tasks); // makes a copy of the data for comparison
		});
	}
	$scope.saveEdit = function(data){
		console.log('saveEdit');

		$http({
			url:`/task/${data.id}`,
			method: 'POST',
			data: {
                'id':data.id,
                'title':data.title,
                'description':data.content,
                'remainders' : data.remainder,
                'completed':data.completed,
                'repeats':{
                    'd_repeats' : data.daily,
                    'm_repeats' : data.month,
                    'y_repeats' : data.year
                },
                'priority' : {
                    'red': data.red,
                    'yellow':data.yellow,
                    'green':data.green
                },
                'project' :
                {
                    'personal' : data.personal,
                    'family':data.family,
                    'work':data.work,
                    'shopping':data.shopping
				},
				
			}
		})


		$("#"+data+"_title").attr("readonly","readonly");
		$("#"+data+"_save").removeClass('text-success');
		$("#"+data+"_save").hide();
	}

	$scope.saveChanges = function(index,data) {
		console.log('saveChanges');
		// console.log($scope.beforeTasksChanged[index].priority);
		// console.log($scope.beforeTasksChanged[index].project);
		console.log(data.priority);
		console.log(data.project);
		console.log(data.repeats);
		if($scope.beforeTasksChanged[index].title != data.title || $scope.beforeTasksChanged[index].description != data.description ||$scope.beforeTasksChanged[index].priority != data.priority ||  $scope.beforeTasksChanged[index].project != data.project || $scope.beforeTasksChanged[index].repeats != data.repeats){
			$http({
				url:`/task/${data.id}`,
				method: 'PUT',
				data: {
                    'title':data.title,
                    'description':data.description,
                    'remainders' : data.remainder,
                    'completed':data.completed,
                    'repeats':{
                        'd_repeats' : data.repeats.daily,
                        'm_repeats' : data.repeats.monthly,
                        'y_repeats' : data.repeats.yearly
                    },
                    'priority' : {
                        'red': data.priority.red,
                        'yellow':data.priority.yellow,
                        'green':data.priority.green
                    },
                    'project' :
                    {
                        'personal' : data.project.personal,
                        'family':data.project.family,
                        'work':data.project.work,
                        'shopping':data.project.shopping
                    }
				},
				headers: {'Content-Type':'application/json'}
			}).then(function(response){
				console.log(response);
				if(response.data.status == 200 || response.status == 200){
					console.log(response);
					$scope.tasks = response.data.tasks;
					$scope.beforeTasksChanged = angular.copy(response.data.tasks);
					swal("Awesome job!", "You just edited a task!", "success")
				}
				else{
					// alert failed
					swal("ohh no!", "We couldn't edit that task! Please try again!", "error")
				}
			})
		}
	}
	$scope.removeTask = function(index,data){
		swal({
		  title: "Are you sure?",
		  text: "You will not be able to undo this process!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, delete it!",
		  closeOnConfirm: false
		},
		function(){
			$http({
				url:`/task/${data.id}`,
				method:'DELETE',
				data:{'id':data.id},
				headers:{'Content-Type':'application/json'}
				}).then(function(response) {
				if(response.status == 200){
					$scope.tasks = response.data.tasks;
					$scope.beforeTasksChanged = angular.copy(response.data.tasks);
					swal("Yippee!", "You just deleted a task! Way to go champ!", "success")
				}
				else{
					swal("ohhh no!", "We couldn't delete the task! Please try again!", "error")
				}
			});
		});
	}

	$scope.markAsCompleted = function(index, data){
		console.log('markAsCompleted');
			$http({
				url : `/task/${data.id}`,
				method : 'PUT',
				data : {
					'task_id' : data.id,
					'completed' : data.completed,
				},
				headers: {'Content-Type':'application/json'}
			}).then(function(response){
				if(response.status == 200){
					console.log(response.status);
					// $scope.removeTask(data.id);
					$scope.tasks = response.data.tasks;
					$scope.beforeTasksChanged = angular.copy(response.data.tasks);
					swal("Awesome job!", "You just completed a task!", "success")
				}
				else{
					swal("ohh no!", "We couldn't edit that task! Please try again!", "error")
				}
			});
		}

}]);