/**
 * This JavaScript file is to perform camera related operations.
 * @author Pruthvi Onkar
 */
var CameraFunctions = (function() {
	return {
		
		getPhotoFromLibrary : function(){
			
			 navigator.camera.getPicture(CameraFunctions.onPhotoURISuccess, CameraFunctions.onFail,{ quality: 50, 
		        destinationType: navigator.camera.DestinationType.NATIVE_URI,
		        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
		        correctOrientation: true,
		        targetWidth: 50,
		        targetHeight: 50
		        });
		},
		
		openCameraForImageCapture : function(){
			
			 navigator.camera.getPicture(CameraFunctions.onPhotoURISuccess, CameraFunctions.onFail,{ quality: 50, 
		        destinationType: navigator.camera.DestinationType.NATIVE_URI,
		        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		        correctOrientation: true,
		        targetWidth: 50,
		        targetHeight: 50
		        });

		},
		 
		onPhotoURISuccess : function(imageURI) {
			
				console.log(imageURI);
				Utils.addReceipt(imageURI);
				//need to transfer to expenseType page
				Utils.loadPageWithAnimation('expenseType', function() {
					Utils.saveCurrentPageObject(MainPage);
					ExpenseType.init();
				});
		},
		 
		onFail : function(){
			console.log("Failed to get image uri");
			}

	};
}());