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
					Utils.loadPageWithAnimation('mainPage', function() {
						Utils.saveCurrentPageObject(SelectTrip);
						MainPage.init();
					});
				});


			});


		}
	};
}());

