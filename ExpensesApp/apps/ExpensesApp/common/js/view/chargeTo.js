/**
 * This is the JavaScript controller for charge to
 * @author Katie Barnett
 */

var ChargeTo = (function() {
	return {
		init : function() {
			console.log("ChargeTo :: init");
			$('.back').on('click', function() {
				Utils.goBackWithAnimation(function() {
					alert("Gone back");
				});
			});
			$('.accountDetails').on('click', function() {
				Utils.loadPageWithAnimation("accountDetails", function() {
					Utils.saveCurrentPageObject(ChargeTo);
					AccountDetails.init();
				});
			});
			
			
		}
	};
}());

