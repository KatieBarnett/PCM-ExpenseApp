/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var ExpenseType = (function() {
	return {
		init : function() {
			console.log("ExpenseType :: init");
			
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation(function() {
					alert("Gone back");
				});
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

