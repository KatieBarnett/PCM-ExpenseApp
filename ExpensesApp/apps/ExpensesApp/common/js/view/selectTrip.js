/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var SelectTrip = (function() {
	return {
		init : function(expenseID) {
			console.log("selectTrip :: init");
			// For testing purposes
			if (!expenseID) {
				expenseID = 13;
			}
			
			//testing data
			DB.addTrip("Melbourne ANZ", "01-10-13", "03-10-13", function() {
			});
			DB.addTrip("ANZ Pitt St Meeting", "25-09-13", "25-09-13", function() {
			});
			
			//draw thumbNail with latest receipt or saved receipt if it exists
			DB.getExpense(expenseID, function(expense){

				if ((expense["receipt"] == null) || (expense["receipt"] == undefined)){
					console.log("Receipt not saved");
					receipt = Utils.getReceipt(0);
				} else {
					receipt = expense["receipt"];
				}

				Utils.getThumbNail(receipt, document.getElementById('receiptThumb'));

				$('#receiptThumb').on('click', function(){
					Utils.getFullImage(0, ExpenseType);
				});


				DB.getUnprocessedTrips(function(data){
					// Build the list
					SelectTrip._buildList(data);
					
					// On Selection of trip, move to next screen
					$('#tripList').on('click', '.tripSelected', function() {
						var selectedTrip = $(this).attr("data-trip");
						if (expenseID != null) {
							DB.getExpense(expenseID, function(expense){
								DB.updateExpense(expense["expenseID"], expense["expenseTypeID"], expense["accountProjectCode"], 
										expense["receipt"], selectedTrip, function () {
									Utils.loadPageWithAnimation("mainPage", expenseID, function() {
										Utils.saveCurrentPageObject(SelectTrip);
										MainPage.init();
									});
								});
							});	
						} else {
							// This should not be required after completion of ChargeTo screen
							Utils.loadPageWithAnimation("mainPage", expenseID, function() {
								Utils.saveCurrentPageObject(SelectTrip);
								MainPage.init();
							});
						}
					});
				});

				$('#tripList').listview('refresh');

				// Navigation buttons functionality
				$('.back').on('click', function() {
					Utils.goBackWithAnimation(function() {
					});
				});

				// Handler for when the new trip button is clicked
				$('#newTrip').on('click', function() {
					$('#descriptionErrorMsg').addClass('hidden');
					// Clear any value in the inputs
					$('#tripDescription').val("");
					$('#startDate').val("");
					$('#endDate').val("");
					
					$("#addTripModal").popup("open");
				});
				
				// Handler for when the cancel button is clicked on the modal
				$('#cancelAddTrip').on('click', function(){
				    console.log("close modal");
				    $("#addTripModal").popup("close");
				});
				
				// Handler for when the submit button is clicked on the modal
				$('#submitAddTrip').on('click', function() {
					if ($('#tripDescription').val().length > 1) {
						var tripDescription = $('#tripDescription').val();
						var	startDate = $('#startDate').val();
						var	endDate = $('#endDate').val();
							
						var callback = function(newTripID) {
							// Clear the list so the list can be repopulated on screen
							SelectTrip._removeList();
							
							// Query the DB for the information to rebuild the list
							DB.getUnprocessedTrips(function(data) {
								// Build the list
								SelectTrip._buildList(data);
								
								// Refresh the page so the scrolling will still work on the page.
								$.mobile.activePage.trigger('pagecreate');
								
								// Close the modal once completed
								$('#addTripModal').popup("close");
							});
						};
	
						DB.addTrip(tripDescription, startDate, endDate, callback);
					} else {
						console.log("empty text box detected");
						$('#descriptionErrorMsg').removeClass('hidden');  
					}
				});

				$('.finishLater').on('click',function() {
					Utils.loadPageWithAnimation('mainPage', expenseID, function() {
						Utils.saveCurrentPageObject(SelectTrip);
						MainPage.init();
					});
				});
			});
		},
		
		/**
		 * Function to build the list of trips into the list DOM
		 * @param data the returned data from the DB
		 */
		_buildList : function(data) {
			//Populate trip list
			var tripUL=document.getElementById("tripList");
			
			// Build the list divider
			$('<li>', {"data-role":"list-divider", text: "Trips"}).appendTo("#tripList");

			for(var i=0; i<data.length; i++){
				tripLI = document.createElement("li");

				tripAnchor = document.createElement("a");
				tripAnchor.appendChild(document.createTextNode(data[i]["tripName"]));
				tripLI.setAttribute("class", "tripSelected");
				tripLI.setAttribute("data-trip", data[i]["tripID"]);
				tripLI.appendChild(tripAnchor);
				tripDates = document.createElement("p");
				tripDates.appendChild(document.createTextNode(data[i]["startDate"]));
				tripDates.appendChild(document.createTextNode("/"));
				tripDates.appendChild(document.createTextNode(data[i]["endDate"]));
				tripLI.appendChild(tripDates);
				tripUL.appendChild(tripLI);
			}
			
			// Refresh the list view
			$('#tripList').listview('refresh');
		},
		
		/**
		 * Function to clear the list DOM to prepare for new list to be generated.
		 * @param none
		 */
		_removeList : function() {
			$('#tripList').empty();
		}
	};
}());

