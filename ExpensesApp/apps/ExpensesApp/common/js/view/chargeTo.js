/**
 * This is the JavaScript controller for charge to
 * @author Katie Barnett and Shasha Pendit
 */

var ChargeTo = (function() {
	return {
		init : function() {
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
<<<<<<< Upstream, based on origin/master
=======
			
			// Move to next page after expense type is selected
			$('.accountDetails').on('click', function() {
				Utils.loadPageWithAnimation("accountDetails", function() {
					Utils.saveCurrentPageObject(ChargeTo);
					// Save selection here - to be done
					accountDetails.init();
				});
			});
			
			// trigger add client code modal
			$('.btnShowModal').on('click', function() 
					{
				$('.dialog-confirm').dialog();
					Utils.saveCurrentPageObject(ChargeTo);
					// Save selection here - to be done
					ChargeTo.init();
			});
>>>>>>> 575fc8d visual design updates - as per expense type screen
		}
	};
	
});
			




