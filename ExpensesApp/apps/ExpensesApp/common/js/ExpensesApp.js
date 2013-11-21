/**
* @license
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

function wlCommonInit(){

	/*
	 * Application is started in offline mode as defined by a connectOnStartup property in initOptions.js file.
	 * In order to begin communicating with Worklight Server you need to either:
	 * 
	 * 1. Change connectOnStartup property in initOptions.js to true. 
	 *    This will make Worklight framework automatically attempt to connect to Worklight Server as a part of application start-up.
	 *    Keep in mind - this may increase application start-up time.
	 *    
	 * 2. Use WL.Client.connect() API once connectivity to a Worklight Server is required. 
	 *    This API needs to be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 *    Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	
	// Common initialization code goes here

}

$(document).ready(function() {
	// Load the login page
	Utils.loadPage("mainPage", function() {
		// Call the init function
		MainPage.init();
	});
	
	// TODO: Change this to binding it for Android back button.
	// Currently emulated ENTER key as the back button.
	$(document).keypress(function(e) {
		if (e.which == 13) {
			Utils.goBackWithAnimation(null);
		}
	});
	
	$('#content-page-2').css('display', 'none');
});

/*
 * Try not to have global functions as below. Use closures and each page should have it's own JavaScript file
 * that will handle the page functionality.
 */
function displayAttachmentOptions(){
	$('.attachReceipt').css('display','block');
	$('.attachReceipt').animate({bottom:'0px'}, 500);
}
function closeAttachmentOptions(){
	$('.needs').animate({paddingTop:'5px'}, 500, function() { 
		$('.have').css("display","block");
		});
	
	$('.attachReceipt').animate({bottom:'-210px'}, 500, function() { 
		$('.attachReceipt').css("display","none");
	});
}

			