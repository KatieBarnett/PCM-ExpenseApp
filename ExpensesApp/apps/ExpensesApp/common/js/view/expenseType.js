/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var ExpenseType = (function() {
	return {
		init : function() {
			console.log("ExpenseType :: init");

			// do it locally for now 
			var uri = Utils.getReceipt(0);
			var imageObj = new Image();
			imageObj.src = uri;
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			canvas.width = 75;
			canvas.height = 100;
			canvas.id = "newCanvas";
			canvas.class= "receiptThumbUpdate";
			
		    imageObj.onload = function(){
		        context.drawImage(imageObj, 0, 0, 75, 100);
		    };
		    
		    $('.receiptThumb').replaceWith(canvas);
		    $('#newCanvas').on('click', function(){
		    	Utils.getFullImage(0, ExpenseType);
		    });
			
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			$('.finishLater').on('click',function() {
				// Add function for requirement of the Finish this later button
				Utils.loadPageWithAnimation('chargeTo', function() {
					Utils.saveCurrentPageObject(ExpenseType);
					ChargeTo.init();
				});
			});
			
			// Move to next page after expense type is selected
			$('.chargeTo').on('click', function() {
				Utils.loadPageWithAnimation("chargeTo", function() {
					Utils.saveCurrentPageObject(ExpenseType);
					// Save selection here - to be done
					ChargeTo.init();
				});
			});				
		}
	};
}());

