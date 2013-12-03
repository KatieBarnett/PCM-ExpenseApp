/**
 * This is the common utilities that will be used across the different pages on the application.
 * @author Andrew Lee
 */

var Utils = (function() {
	// Variable that will store all the page history so back can be implemented as a hardware button.
	var pageHistory = [];
	var callbackFunction = "";
	var objectHistory = [];
	var receipts = [];
	return {
		/**
		 * Method that will load the desired page with params and callback
		 * @param pageToLoad the page to be loaded.
		 * @param params The parameters to the load the page with.
		 * @param callback The function to callback to once the page has finished loading.
		 */
		loadPage : function(pageToLoad, callback) {
			if (typeof pageToLoad === "string") {
				// Add the loaded page to the history so going back can be performed
				pageHistory.push(pageToLoad);
				$(PageChangeHelper.getCurrentContainer()).load('pages/' + pageToLoad + '.html', function() {
					// Reload the dynamic CSS from jQuery mobile once the page has loaded into active page.
					$.mobile.activePage.trigger('pagecreate');
					callback();
				});
			} else {
				alert("Error: page cannot be loaded");
			}
		},
		
		/**
		 * Method that will load the previous page
		 */
		goBack : function(callback) {
			pageHistory.pop();
			var page = pageHistory[pageHistory.length-1];
			if(pageHistory.length < 1) {
				if (confirm("Are you sure to exit?")) {
					if(navigator.app) {
						navigator.app.exitApp();
						return false;
					}
				}
			}
			$(PageChangeHelper.getCurrentContainer()).load('pages/' + page + '.html', function() {
				// Reload the dynamic CSS from jQuery mobile once the page has been loaded into active page.
				$.mobile.activePage.trigger('pagecreate');
				
				var test = Utils.getCurrentPageObject();
				test.init();
				callback();
			});
		},
		
		/**
		 * This method will load the desired page similar to loadPage, but will
		 * also animate the page loading process.
		 * @param pageToLoad the page to be loaded
		 * @param callback the call back functionality once the page has loaded.
		 */
		loadPageWithAnimation : function (pageToLoad, callback) {
			// Do the animation of moving the content pane off screen.
			console.log("Utils :: loadPageWithAnimation");
			callbackFunction = callback;
			// Toggle the current container to the other one so the movement can be completed.
			PageChangeHelper.toggleCurrentContainer();
			
			// Change the active page so the CSS can be reloaded for jQuery mobile. Remove transition effects so it
			// does not flash on screen when the page is changing.
			$.mobile.changePage(PageChangeHelper.getCurrentContainer(), {changeHash: false, transition: "none"});
			
			// Call the load page function
			Utils.loadPage(pageToLoad, function() {
				var currentContainer = PageChangeHelper.getCurrentContainer();
				// Move the container off screen on the right so it can be animated right to left.
				$(currentContainer).css('left','100%');
				$(currentContainer).css('display', 'block');
				// Move the other container off screen to the left
				$(PageChangeHelper.getOtherContainer()).animate({left:"-100%"}, 500);
				// Move the current container into the centre of the screen and then hide the other container
				$(currentContainer).animate({left:"0%"}, 500, function() {
					$(PageChangeHelper.getOtherContainer()).css('display','none');
					// Execute the call back function if it exists
					if (callbackFunction == null) {
						alert("Missing callback function. Need init");
					} else {
						callbackFunction();
					}
				});
			});
		},
		
		/**
		 * Method that will go back to the previous page with an sliding animation.
		 * @param callback The callback function once the animation has been completed.
		 */
		goBackWithAnimation : function(callback) {
			console.log("Utils :: goBackWithAnimation");
			callbackFunction = callback;
			// Toggle the current container to the other one so the transition can be completed.
			PageChangeHelper.toggleCurrentContainer();
			
			// Change the active page so the CSS can be reloaded for jQuery mobile. Remove transition effects so it
			// does not flash on screen when the page is changing.
			$.mobile.changePage(PageChangeHelper.getCurrentContainer(), {changeHash: false, transition: "none"});
			
			// Call the function to load the previous page
			Utils.goBack(function() {
				var currentContainer = PageChangeHelper.getCurrentContainer();
				// Move the current container to the left of the centre so it can be animated from left to right
				$(currentContainer).css('left','-100%');
				$(currentContainer).css('display','block');
				// Move the other container off screen going to the right
				$(PageChangeHelper.getOtherContainer()).animate({left:'100%'}, 500);
				$(currentContainer).animate({left:'0%'}, 500, function() {
					$(PageChangeHelper.getOtherContainer()).css('display','none');
					// Execute the call back function
					if (callbackFunction != null) {
						callbackFunction();
					}
				});
			});
		},
		
		saveCurrentPageObject : function(obj) {
			objectHistory.push(obj);
		},
		
		getCurrentPageObject : function() {
			var previousObject = objectHistory.pop();
			return previousObject;
		},
		
		getFullImage: function(ref, page) {
			var imageData = receipts[ref];
			console.log('loading viewReceipt');
			//load viewReceiptPage
			Utils.loadPageWithAnimation('viewReceipt', function() {
				Utils.saveCurrentPageObject(page); 
				//change this to dynamically retrieve current page
				ViewReceipt.init(imageData);
			});
		},
		
		getReceipt : function(ref){
			return receipts[ref];
		},
		
		addReceipt : function(receiptUri){
			receipts.push(receiptUri);
		},
			 		
		getThumbNail : function(uri, canvas) {
			if(uri) {
				var imageObj = new Image();
				imageObj.src = uri;
				var context = canvas.getContext('2d');
			    imageObj.onload = function(){
			        context.drawImage(imageObj, 0, 0, 75, 75);
			    };
			}
		}
	};
} ());
