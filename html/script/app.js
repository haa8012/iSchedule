/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
var app = angular.module('myApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl : '../html//partials/home-view.html',
			controller : ''
		}).
		
		when('/Candidate', {
			templateUrl : '../html/partials/candidate-list.html',
			controller: 'candidateListController'
		}).
		
		when('/Candidate/:id', {
			templateUrl : '../html/partials/candidate-detail.html',
			controller : 'candidateDetailsController'
		}).
		
		
		when('/New', {
			templateUrl : '',
			controller : ''
		}).
		
		when('/EditCandidate/:id', {
			templateUrl : '../html/partials/edit-candidate.html',
			controller : 'candidateDetailsController'
		})

        .otherwise({
            redirectTo : '/'
        })
}])
.controller('candidateListController', ['$scope','CandidateFactory', function($scope, CandidateFactory){

	$scope.candidateList = CandidateFactory.getList();
	

	$scope.more = function(){
		CandidateFactory.getmore();
	};
	
	$scope.delete = function(id){
		//console.log("delete at" + id)
		if(confirm("You're about to delete something\nPress Ok to continue")){
			CandidateFactory.deleteCandidate(id);
			
		}
	}
	$scope.title = "Candidate list";
	
}])

.controller('candidateDetailsController', ['$scope', '$routeParams', 'CandidateFactory', 'InterviewFactory', 
	function($scope, $routeParams, CandidateFactory, InterviewFactory){
	    var id = parseInt($routeParams.id) - 1;
	
	 $scope.candidate = CandidateFactory.getSingle(id);
	
	$scope.interview = InterviewFactory.getSingle(id);
	
	$scope.title = "Candidate Details";
	
	}])

//CANDIDATE FACTORY
.factory('CandidateFactory', [function(){
	var numberPerPage = 20;
    var startPage = 0;
	
	var Candidate = [];	
    var CandidatePerPage = [];
	$.ajax({
		async : false,
		url : '../html/JSON/Candidate.json',
		success : function(data){
			Candidate = data;
		}
	});	
	
	var getMore = function(){
		for (var i = startPage; i < numberPerPage; i++) {
	        CandidatePerPage.push(Candidate[i]);
	    }
	    startPage += 20;
	    numberPerPage += 20;
		
		console.log(startPage);
		console.log(numberPerPage);
	};
	getMore();
	return{
		getList : function(){
			return CandidatePerPage;
		},
		
		getSingle : function(id){
			return Candidate[id];
		},
		
		getmore : function(){
			getMore();
		},
		
		createCandidate : function(candidate){
			Candidate.push(candidate);
		},
		
		deleteCandidate : function(id){
			console.log(id)
			//Candidate.splice(id, 1);
			CandidatePerPage.splice(id, 1)
		}
	}
}])

///INTERVIEW FACTORY
.factory('InterviewFactory',['$http',function($http){
	
    var factory = [];
	
    $.ajax({
		async : false,
		url : '../html/JSON/Interview.json',
		success : function(data){
			factory = data;
		}
	});
	
	return {
		getList : function(){
			return factory;
		},
		getSingle : function(id){
			return factory[id];
		}
	}
}])

.directive('titleDirrective', function(){
	return {
		template : "Tittle"
	}
});
