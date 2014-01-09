/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var SelectTrip = (function() {
	return {
		init : function(expenseID) {
			console.log("selectTrip :: init");
			
			//draw thumbNail with latest receipt or saved receipt if it exists
			DB.getExpense(expenseID, function(expense){
				var receipt = expense["receipt"];
				Utils.getThumbNail(receipt, $('#receiptTripThumb')[0]);

				$('.receiptThumb').on('click', function(){
					Utils.getFullImage(receipt, expenseID, ExpenseType);
				});

				DB.getUnprocessedTrips(function(data){
					// Build the list
					SelectTrip._buildList(data);
					
					// On Selection of trip, move to next screen
					$('#tripList').on('click', '.tripSelected', function() {
						var selectedTrip = $(this).attr("data-trip");
						DB.getExpense(expenseID, function(expense){
							DB.updateExpense(expense["expenseID"], expense["expenseTypeID"], expense["accountProjectCode"], 
									expense["receipt"], selectedTrip, function () {
								Utils.loadPage("mainPage", function() {
									Utils.saveCurrentPageObject(SelectTrip);
									MainPage.init();
								});
							});
						});
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
					$('.opacity').css('display', 'block');
				});
				
				// Handler for when the cancel button is clicked on the modal
				$('#cancelAddTrip').on('click', function(){
				    $("#addTripModal").popup("close");
				    $('.opacity').css('display', 'none');
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
								$('.opacity').css('display', 'none');
							});
						};
	
						DB.addTrip(tripDescription, startDate, endDate, callback);
					} else {
						console.log("empty text box detected");
						$('#descriptionErrorMsg').removeClass('hidden');  
					};
				});

				$('.finishLater').on('click',function() {
					DB.getExpense(expenseID, function(expense){
						DB.updateExpense(expense["expenseID"], expense["expenseTypeID"], expense["accountProjectCode"], 
								expense["receipt"], expense["tripID"], function () {
							Utils.loadPage("mainPage", function() {
								Utils.saveCurrentPageObject(SelectTrip);
								MainPage.init();
							});
						});
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
				if (data[i]["startDate"]) {				
					tripDates.appendChild(document.createTextNode(data[i]["startDate"]));						
				}
				if (data[i]["startDate"] && data[i]["endDate"]) {
					tripDates.appendChild(document.createTextNode("/"));
				} else if (!data[i]["startDate"] && !data[i]["endDate"]) {
					tripDates.appendChild(document.createTextNode("No trip dates specified."));
				}
				if (data[i]["endDate"]) {
					tripDates.appendChild(document.createTextNode(data[i]["endDate"]));
				}
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

