/**
 * This JavaScript file is to perform camera related operations.
 * @author Pruthvi Onkar
 */
var CameraFunctions = (function() {
	return {
		openCameraForImageCapture : function(){
			
			 navigator.camera.getPicture(onPhotoURISuccess, onFail,{ quality: 50, 
		        destinationType: navigator.camera.DestinationType.NATIVE_URI,
		        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		        correctOrientation: true,
		        targetWidth: 50,
		        targetHeight: 50
		        });

		},
		 
		  onPhotoURISuccess : function(imageURI) {
				console.log(imageURI);
				
		},
		 
		onFail : function(){
			console.log("Failed to get image uri");
			}

	};
}());