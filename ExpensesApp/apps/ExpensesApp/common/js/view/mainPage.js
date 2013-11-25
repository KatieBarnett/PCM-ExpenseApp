/**
 * JavaScript file that will handle loading and executing items related to the login page.
 * @author Andrew Lee
 */

var MainPage = (function() {
	return {
		init : function() {
			console.log("MainPage :: init");
			
			// Add handlers
			$('#processTrip').on('click',function() {
				// Load the new page
				Utils.loadPageWithAnimation('processTrips', function() {
					Utils.saveCurrentPageObject(MainPage);
					ProcessTrips.init();
				});
			});
			$('#addExpense').on('click',function() {
				// Display the attachment modal
				displayAttachmentOptions();
			});
			$('#closeAttachmentOptions').on('click',function() {
				// Close the attachment modal
				closeAttachmentOptions();
			});		
			$('#openCamera').on('click',function() {
				// Close the attachment modal
				CameraFunctions.openCameraForImageCapture();
			});	
			$('#noReceipt').on('click',function() {
				// Load the new page
				Utils.loadPageWithAnimation('expenseType', function() {
					Utils.saveCurrentPageObject(MainPage);
					ExpenseType.init();
				});
			});
		}
	};
}());

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

function openCameraForImageCapture(){

	 navigator.camera.getPicture(onPhotoURISuccess, onFail,{ quality: 50, 
	   destinationType: navigator.camera.DestinationType.NATIVE_URI,
	   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	   correctOrientation: true,
	   targetWidth: 50,
	   targetHeight: 50
	   });

}

function onPhotoURISuccess(imageURI) {
	console.log(imageURI);
}

function onFail(){
	console.log("Failed to get image uri");
}
