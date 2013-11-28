/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var SelectTrip = (function() {
	return {
		init : function() {
			console.log("selectTrip :: init");
			
			//Test data
			data = new Array("Melbourne ANZ (01-10-13/03-10-13)",
					"ANZ Pitt St Meeting (25-09-13)",
					"NCEVER Adelaide Go Live Meeting (27-09-13)",
					"Canberra DoD RFD (10-09-13)",
					"Melbourne ANZ (07-09-13/13-09-13)",
					"Melbourne ANZ (01-09-13/13-09-13)");
			
			//Populate trip list
			var tripUL=document.getElementById("tripList");
			
			for(var i=0; i<data.length; i++){
				tripLI = document.createElement("li");
				tripLI.setAttribute("data-trip", data[i]);
				tripLI.setAttribute("class", "tripSelect");
				tripAnchor = document.createElement("a");
				tripAnchor.appendChild(document.createTextNode(data[i]));
				tripLI.appendChild(tripAnchor);
				tripUL.appendChild(tripLI);
			}
			
			$('#tripList').listview('refresh');
			
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation(function() {
					alert("Gone back");
				});
			});
			
			$('.newTrip').on('click',function() {
				// Add create new trip function
				Utils.loadPageWithAnimation('chargeTo', function() {
					Utils.saveCurrentPageObject(SelectTrip);
					ChargeTo.init();
				});
			});
			
			$('.finishLater').on('click',function() {
				// Add function for requirement of the Finish this later button
				Utils.loadPageWithAnimation('mainPage', function() {
					Utils.saveCurrentPageObject(SelectTrip);
					MainPage.init();
				});
			});
			
			// Move to home screen after trip is selected
			$('.tripSelect').on('click', function() {
				Utils.loadPageWithAnimation("mainPage", function() {
					Utils.saveCurrentPageObject(SelectTrip);
					// Save selection here - to be done
					MainPage.init();
				});
			});
			
			
			
		}
	};
}());

