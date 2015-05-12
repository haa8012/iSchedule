/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>

var path = "../html/";
var app = angular.module('myApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl : path + 'partials/home-view.html',
			controller : 'homeController'
		}).
		
		when('/Candidate', {
			templateUrl : path + 'partials/candidate-list.html',
			controller: 'candidateListController'
		}).
		
		when('/Candidate/:id', {
			templateUrl : path + 'partials/candidate-detail.html',
			controller : 'candidateDetailsController'
		}).
		
		
		when('/CandidateFilter/:id', {
			templateUrl : path + 'partials/candidate-list.html',
			controller : 'CandidateFilter'
		}).
		
		when('/EditCandidate/:id', {
			templateUrl : path + 'partials/edit-candidate.html',
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
	
.controller('CandidateFilter', ['$scope', '$routeParams', 'CandidateFactory', function($scope, $routeParams, CandidateFactory){
		var filterBySuccess = $routeParams.id;
		var success;
		if(filterBySuccess == '2')
		{
			success = false;
		}
		else if(filterBySuccess == '1')
		{
			success = true;
		}
		else{
			
		}
		$scope.candidateList = CandidateFactory.getFilterList(success);
		
		console.log(filterBySuccess)
}])

.controller('homeController', ['$scope','CandidateFactory', function($scope, CandidateFactory)
{
	
	///Angular Function that check when the partial view is loaded
    ///Then you can do DOM Manipulation

    $scope.candidateList = CandidateFactory.getInitial();
	$scope.$on('$viewContentLoaded', function(){
				
		var chart = new Chartist.Line('.ct-chart', {
		  labels: ['jan', 'feb', 'march', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec'],
		  series: [
		    [1, 5, 10, 0, 5, 12,6, 6, 1,10,3,5],
		    [10, 15, 7, 1, 2, 7, 11, 3, 2, 7, 6],
            [3,12,5,3,6,12,4,8,10,2,16,12]
		  ]
		}, {
		  // Remove this configuration to see that chart rendered with cardinal spline interpolation
		  // Sometimes, on large jumps in data values, it's better to use simple smoothing.
		  lineSmooth: Chartist.Interpolation.simple({
		    divisor: 2
		  }),
		  fullWidth: true,
		  chartPadding: {
		    right: 20
		  },
		  low: 0
		});
	})
	
	///
}])

//CANDIDATE FACTORY
.factory('CandidateFactory', ['InterviewFactory', function(InterviewFactory){
	var numberPerPage = 20;
    var startPage = 0;
	
	var Candidate = [];	
	var CandidateFilter = [];
	var InitialCandidate = [];
	
	var InterviewList = InterviewFactory.getList();
	
    var CandidatePerPage = [];
	$.ajax({
		async : false,
		url : 'JSON/Candidate.json',
		success : function(data){
			Candidate = data;
		}
	});	
	
	
	///function to get candidate base on interview success
	///get the interview list and check which one is marked the same as the param value
	///if found match push the candidate[interview match location ] to the candidatefliter
	var filter = function(value){
		
		///Convert the string into boolean value
		
		for(var i = 0; i < InterviewList.length; i++)
		{
			//console.log(InterviewList[i].result + " before with " + value) 
			if(InterviewList[i].result == value){
				console.log(value)
				//console.log(InterviewList[i].result)
				CandidateFilter.push(Candidate[i]);
				//console.log(CandidateFilter[i])
			}
			
		}
	}
	
	
	
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

	getInitial = function () {
	    for (var i = 0; i < 5; i++) {
	        InitialCandidate.push(Candidate[i]);
	    }
	}

	getInitial();
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
		},
		getFilterList : function(value){
			///Call the filter function to initialize the value
			CandidateFilter = [];
			filter(value);
			return CandidateFilter;
			///
		},
		getInitial: function () {
		    return InitialCandidate;
		}
	}
}])

///INTERVIEW FACTORY
.factory('InterviewFactory',['$http',function($http){
	
    var factory = [];
	
    $.ajax({
		async : false,
		url : 'JSON/Interview.json',
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

$(function () {
    var chart = new Chartist.Line('.ct-chart', {
        labels: ['jan', 'feb', 'march', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec'],
        series:
		 [
			 {
				 className : 'all-candidate',
				 data : [1, 5, 10, 0, 5, 12, 6, 6, 1, 10, 3, 5]
			 },
			 {
				 classname : 'success-candidate',
				 data : [10, 15, 7, 1, 2, 7, 11, 3, 2, 7, 6]
			 },
			 
			 {
				 classname : 'fail-candidate',
				 data :  [3, 12, 5, 3, 6, 12, 4, 8, 10, 2, 16, 12]
			 }
          
		  
        ]
	
    }, {
        // Remove this configuration to see that chart rendered with cardinal spline interpolation
        // Sometimes, on large jumps in data values, it's better to use simple smoothing.
        lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
        }),
        fullWidth: true,
        chartPadding: {
            right: 20
        },
        low: 0
    });
})
