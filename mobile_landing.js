
'use strict';

angular.module('angie').controller('MobileVersionHrController', function($scope,$rootScope, $http){
	
	$scope.currentStep = 1;
	$scope.stepLength = 8;
	$scope.readyToSend = 0;
    $scope.phoneError = 0;
	$scope.currentPhone = 1;
	$scope.phoneLength = 4;
	$scope.windowWidth = $(window).width();
	$scope.windowHeight = $(window).height();
	$scope.mobileOS = 'unknown';

	$scope.linkToApp = '';
	$scope.linkToAppTarget = '';

	$scope.$tBlock = $('.MobileVersionHr_banner.Slide_1_banner');
	$scope.$tBg = $('#Slide.m_1');
	

	$scope.init = function(){

		$scope.mobileOS = $scope.detectMobileOS();

		if( $scope.mobileOS == 'ios' ){
			$scope.linkToApp = 'https://itunes.apple.com/ru/app/poisk-sotrudnikov-superjob/id981030971?l=ru&mt=8';
			$scope.linkToAppTarget = 'itunes_store';

			$scope.adjustHeaderMobile($scope.windowHeight);
		}
		else if( $scope.mobileOS == 'android' ) {
			$scope.linkToApp = 'market://details?id=ru.superjob.employer';
			$scope.linkToAppTarget = '';

			$scope.adjustHeaderMobile($scope.windowHeight);
		}

		$scope.windowResize();

		$scope.mouseWheellDetect();
		$scope.phone = '';

		$('.MobileVersionHr_send_input').inputmask( {
			mask: '+7 999 999 99 99',
			showMaskOnHover: true,
			showMaskOnFocus: true,
			placeholder: ' ',
			clearMaskOnLostFocus: false,
			autoUnmask: true
		});

	};

	/* Весь ресайз */
	$scope.windowResize = function(){

		$(window).resize(function(){

			$scope.$apply(function(){
				$scope.mobileOS = $scope.detectMobileOS();
				$scope.windowWidth = $(window).width();
				$scope.windowHeight = $(window).height();
			})

			var tBlockHeight = $scope.$tBlock.height();
			$scope.$tBg.css('background-position', 'center ' + (-1 * tBlockHeight));


			if( $scope.mobileOS == 'ios' || $scope.mobileOS == 'android' ){
				$scope.adjustHeaderMobile($scope.windowHeight);
			}
		});

	};

	$scope.getNumber = function(num) {
	    return new Array(num);   
	};

	/* Подгоняем высоту хедера */
	$scope.adjustHeaderMobile = function(windowHeight){
		$('.Slide_1_header').height(windowHeight);
		
	};

	$scope.scrolling = function () {


		var nextStep = $scope.currentStep + $scope.stepDir;

		if( 1 <= nextStep && $scope.stepLength >= nextStep) {

			$scope.$apply(function(){

				$scope.stepDir;
				$scope.currentStep = nextStep;

			});	
						
		}

	}

	$scope.mouseWheellDetect = function(){
		
		if( $scope.mobileOS != 'ios' && $scope.mobileOS != 'android' && $scope.windowWidth > 1024){
			$('.MobileVersionHr').on('mousewheel DOMMouseScroll', function(e) {
				clearTimeout($.data($scope, 'timer'));

				$.data($scope, 'timer', setTimeout(function() {

					var wheelDelta;
					e.preventDefault();

					if (e.type == 'mousewheel') {
        				wheelDelta = (e.originalEvent.wheelDelta * -1);
        			}
    				else if (e.type == 'DOMMouseScroll') {
    					wheelDelta = 40 * e.originalEvent.detail;
    				}
					
					if( wheelDelta < 0 ) {
			        		$scope.stepDir = -1;
			    		}
			    		else {
			        		$scope.stepDir = 1;
			    		}

			    	$scope.scrolling();  	
					
					}, 150));
			});	
		}
		
	}

	$scope.detectMobileOS = function(){

		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		console.log(userAgent);

		if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ){
			return 'ios';
		}
		else if( userAgent.match( /Android/i ) ){
			return 'android';
		}
		else if( userAgent.match( /IEMobile/i ) || userAgent.match( /iemobile/i ) || userAgent.match( /SymbianOS/i ) || $('html').hasClass('lt-ie9')) {
			window.location.replace("/registration.html");
		}
		else{
			return 'unknown'
		}

	};

    $scope.sendAgain = function(){
        $scope.readyToSend = 1;
        $scope.sendOk = -1;
    }

	$scope.sendingPhone = function(){
        if (!$scope.phone)
        {
            return;
        }
		$scope.sending = 1;

        $http({
            method  : 'POST',
            url     : "/hr/mobile/sms",
            data : {"phone" : $scope.phone}
        })
            .success(function(data) {
                $scope.sending = 0;
                $scope.sendOk = data.sendOk;
                $scope.readyToSend = data.readyToSend;

            }).error(function() {
                $scope.sending = 0;
                $scope.sendOk = 0;
                $scope.readyToSend = -1;
            });


	};

	$scope.leftSwipe = function() {
		$scope.swipeDir = 1;
		$scope.swipe();
	};

	$scope.rightSwipe = function() {
		$scope.swipeDir = -1;
		$scope.swipe();
	};

	$scope.swipe = function(){

		var nextPhone = $scope.currentPhone + $scope.swipeDir;

		if( nextPhone >= 1 && nextPhone <= $scope.phoneLength ) {
			
			$scope.currentPhone = nextPhone;
		}

	};

	$scope.changeActivePhone = function(index){
		if( $scope.windowWidth < 1025 ){
			$scope.currentPhone = index + 1;
		}
		else {
			$scope.currentStep = index + 3;
		}
		
		
	};

	$scope.init();

});


$(function(){
    $(document).on('shareThisLoaded', function(){
        $('.Slide_3_GroundFloor_socials').show();
    });
})

