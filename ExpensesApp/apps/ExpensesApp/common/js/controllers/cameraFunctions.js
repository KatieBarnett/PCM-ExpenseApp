/**
 * This JavaScript file is to perform camera related operations.
 * @author Pruthvi Onkar
 */
var CameraFunctions = (function() {
	return {
		
		getPhotoFromLibrary : function(){
			
			 navigator.camera.getPicture(CameraFunctions.onPhotoURISuccess, CameraFunctions.onFail,{ quality: 45, 
		        destinationType: navigator.camera.DestinationType.FILE_URI,
		        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
		        correctOrientation: true,
		        encodingType : navigator.camera.EncodingType.JPEG,
		        targetWidth: 1024,
		        targetHeight: 1024
		        });
		},
		
		openCameraForImageCapture : function(){
			
			navigator.camera.getPicture(CameraFunctions.onPhotoURISuccess, CameraFunctions.onFail,{ quality: 45, 
		        destinationType: navigator.camera.DestinationType.FILE_URI,
		        sourceType: navigator.camera.PictureSourceType.Camera,
		        correctOrientation: true,
		        encodingType : navigator.camera.EncodingType.JPEG,
		        targetWidth: 1024,
		        targetHeight: 1024
		        });

		},
		 
		onPhotoURISuccess : function(imageURI) {
			
				console.log(imageURI);
				Utils.addReceipt(imageURI);
				//need to transfer to expenseType page
				Utils.loadPageWithAnimation('expenseType', null, function() {
					Utils.saveCurrentPageObject(MainPage);
					ExpenseType.setReceiptURI(imageURI);
				});
		},
		 
		onFail : function(){
			console.log("Failed to get image uri");
		}

	};
}());