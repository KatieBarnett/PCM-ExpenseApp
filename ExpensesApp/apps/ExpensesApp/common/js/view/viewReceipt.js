var ViewReceipt = (function() {
	return {
		init : function(ref) {
			console.log("viewReceipt :: init");
			
			// do it locally for now 
			var uri = ref;
			var imageObj = new Image();
			imageObj.src = uri;
			var canvas = document.getElementById('fullReceiptImage');
			var context = canvas.getContext('2d');
			canvas.width = $( window ).width()-5;
			canvas.height = $( window ).height()-100;
			canvas.id = "newCanvas";
			
			context.drawImage(imageObj, 0, 0, $(window).width()-5, $(window).height())-100;
			
			$('#backToPreviousPage').on('click', function() {
				Utils.goBackWithAnimation();
			});
		}
	};
}());