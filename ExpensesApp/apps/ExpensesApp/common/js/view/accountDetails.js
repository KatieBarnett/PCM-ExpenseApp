/**
 * This is the JavaScript controller for account details
 * @author Shasha Pendit
 */

var AccountDetails = (function() {
	return {
		init : function() {
			console.log("AccountDetails :: init");
			$('.back').on('click', function() {
				Utils.goBackWithAnimation(function() {
					alert("Gone back");
				});
			});
			
			$('.finishLater').on('click',function() {
				// Add function for requirement of the Finish this later button
				Utils.loadPageWithAnimation('chargeTo', function() {
					Utils.saveCurrentPageObject(ChargeTo);
					ChargeTo.init();
				});
			});
		}
	};
}());