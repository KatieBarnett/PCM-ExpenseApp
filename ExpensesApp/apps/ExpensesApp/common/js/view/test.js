var Test = (function() {
	return {
		init : function() {
			console.log("Test :: init");
			$('#test').on('click', function() {
				Utils.loadPageWithAnimation("mainPage", function() {
					Utils.saveCurrentPageObject(Test);
					MainPage.init();
				});
			});
			
			$('#backToProcessTrips').on('click', function() {
				Utils.goBackWithAnimation(null);
			});
		}
	};
}());