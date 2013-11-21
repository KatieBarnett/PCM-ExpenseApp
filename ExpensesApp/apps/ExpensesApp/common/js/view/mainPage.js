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
			
			// Add handlers
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