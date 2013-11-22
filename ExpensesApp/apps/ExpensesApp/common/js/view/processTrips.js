/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var ProcessTrips = (function() {
	return {
		init : function() {
			console.log("ProcessTrips :: init");
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			$('.forward').on('click', function() {
				Utils.loadPageWithAnimation("test", function() {
					Utils.saveCurrentPageObject(ProcessTrips);
					Test.init();
				});
			});
		}
	};
}());

