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

					//Populate trip list
					var tripUL=document.getElementById("tripList");

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

					$('#tripList').listview('refresh');

					// On Selection of trip, move to next screen
					$('.tripSelected').on('click', function() {
						var selectedTrip = $(this).attr("data-trip");
						if (expenseID != null) {
							DB.getExpense(expenseID, function(expense){
								DB.updateExpense(expense["expenseID"], expense["expenseTypeID"], expense["accountProjectCode"], 
										expense["receipt"], selectedTrip, function () {
									Utils.loadPageWithAnimation("mainPage", function() {
										Utils.saveCurrentPageObject(SelectTrip);
										MainPage.init();
									});
								});
							});	
						} else {
							// This should not be required after completion of ChargeTo screen
							Utils.loadPageWithAnimation("mainPage", function() {
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

				$('#newTrip').on('click', function() {
					console.log("Function called");
					$('#descriptionErrorMsg').addClass('hidden');  
					$("#addTripModal").popup("open");
					
					
					$('#submitAddTrip').on('click', function() {
						if ($('#tripDescription').val().length > 1) {
							console.log("Submit button clicked");
							var tripDescription = $('#tripDescription').val();
							var	startDate = $('#startDate').val();
							var	endDate = $('#endDate').val();
								
							var callback = function() {
								$("#addTripModal").popup("close");
							};
		
							DB.addTrip(tripDescription, startDate, endDate, callback);
							
						} else {
							console.log("empty text box detected");
							$('#descriptionErrorMsg').removeClass('hidden');  
						}
					});
					
					
					$('#cancelAddTrip').on('click', function(){
					    console.log("close modal");
					    $("#addTripModal").popup("close");
					});
				
				});

				$('.finishLater').on('click',function() {
					Utils.loadPageWithAnimation('mainPage', function() {
						Utils.saveCurrentPageObject(SelectTrip);
						MainPage.init();
					});
				});


			});


		}
	};
}());

