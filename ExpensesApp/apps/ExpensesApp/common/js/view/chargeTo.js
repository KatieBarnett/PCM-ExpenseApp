
/**
 * This is the JavaScript controller for charge to
 * @author Katie Barnett and Shasha Pendit
 */

var ChargeTo = (function() {
	return {
		// expenseTypeID is passed in from previous screen
		init : function(expenseID) {
			console.log("ChargeTo :: init");
			
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			$('.finishLater').on('click',function() {
				// Add function for requirement of the Finish this later button
				Utils.loadPageWithAnimation('processTrips', function() {
					Utils.saveCurrentPageObject(ChargeTo);
					processTrips.init();
				});
			});
			
			// Move to next page after expense type is selected
			$('.tripExpenses').on('click', function() {
				Utils.loadPageWithAnimation("tripExpenses", function() {
					Utils.saveCurrentPageObject(ChargeTo);
					// Save selection here - to be done
					tripExpenses.init();
				});
			});
			
			// trigger add client code modal
			$('.btnShowModal').on('click', function() {
				console.log("Function called");
				/**$('.dialog-confirm').dialog("unhide");*/
				(".dialog-confirm").popup("open");
					Utils.saveCurrentPageObject(ChargeTo);
					// Save selection here - to be done
					ChargeTo.init();
			});

		}
	};
	
}());
			





			



