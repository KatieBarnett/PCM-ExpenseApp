/**
 * This is the JavaScript controller for process trip
 * @author Andrew Lee
 */

var TripExpenses = (function() {
	return {		
		_expenseData : [],
		init : function(selectedTrip, fromHistory) {
			console.log("TripExpenses :: init");
			
			var emailAttachments = new Array();
			var expenseBody = "";
			
			
			var headingPublished = false;
			
			// Get the selected trip from the DB with the details
			TripExpenses._getTrip(selectedTrip, function(tripName, tripStart, tripEnd) {
				// Publish trip details
				TripExpenses._fillTitles(tripName, tripStart, tripEnd);
			});
			
			DB.getTripExpenses(selectedTrip, function(data) {
				// Save the expense object internally
				TripExpenses._expenseData = data;
				
				var expenseTypes = DB.getExpenseTypes();
				var expenseList = document.getElementById("expenseList");
				
				var count = 1;
				for (var i=0; i<expenseTypes.length; i++){
					for (var j=0; j<data.length; j++){
						if (expenseTypes[i]["expenseTypeID"] == data[j]["expenseTypeID"]){
							// Publish list divider for each existing expense type
							if (headingPublished == false){
								expenseLI = document.createElement("li");
								expenseLI.setAttribute("data-role", "list-divider");
								expenseLI.appendChild(document.createTextNode(expenseTypes[i]["expenseTypeID"]));
								expenseList.appendChild(expenseLI);
								headingPublished = true;
							}
							expenseLI = document.createElement("li");
							expenseLI.setAttribute("data-expense", data[j]["expenseID"]);
							expenseLI.setAttribute("class", "expenseItem");
							expenseAnchor = document.createElement("a");
							if (data[j]["accountProjectName"] == null){
								expenseAnchor.appendChild(document.createTextNode("Please complete the expense questions"));
							} else {
								expenseAnchor.appendChild(document.createTextNode(data[j]["accountProjectName"]));
								if (data[j]["accountProjectCode"] != null){
									expenseAnchor.appendChild(document.createTextNode("(" + data[j]["accountProjectCode"]+ ")" ));
								}
							}
							receiptThumbnail = document.createElement("img");
							if (data[j]["receipt"] == "undefined"){
								receiptThumbnail.setAttribute("src", "images//no-receipt.gif");
							} else {
								receiptThumbnail.setAttribute("src", data[j]["receipt"]);
								// Add the image to the array of attachments
								emailAttachments[count - 1] = data[j]["receipt"];
							}
							expenseAnchor.appendChild(receiptThumbnail);
							expenseLI.appendChild(expenseAnchor);
							expenseList.appendChild(expenseLI);
							
							// Build the email body while we are here
							expenseBody = expenseBody + "<tr><td>" + count + "</td><td>" + expenseTypes[i]["expenseTypeID"] + "</td>" +
							"<td>" + data[j]["accountProjectName"] + " - " + data[j]["accountProjectCode"] + "</td>" +
							"<td>" + data[j]["receipt"] + "</td></tr>";	
							count++;
						}
					}
					headingPublished = false;
					
				}
				$('#expenseList').listview('refresh');
				
				// Move to next page after expense type is selected, pass expenseTypeID
				$('.expenseItem').on('click', function() {
					var expenseID = $(this).attr("data-expense");
					Utils.loadPageWithAnimation("editExpense", selectedTrip, function() {
						Utils.saveCurrentPageObject(TripExpenses);
						EditExpense.init(expenseID);
					});
				});
			});
			
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			// Attach modal handler to the screen.
			TripExpenses._modalHandler(selectedTrip);
			
			// Handler for when the send details button is clicked
			$('#sendTripDetailsBtn').on('click', function() {
				$('.sendDetailsContainer').css('display','block');
				$('.sendDetailsContainer').animate({bottom:'0px'}, 500);
				
				// Handler for when the cancel button is clicked
				$('#cancelSendDetailsBtn').on('click', function() {
					$('.sendDetailsContainer').animate({bottom:'-284px'}, 500, function() { 
						$('.sendDetailsContainer').css("display","none");
					});
				});
				
				// Handler for when the submit button is clicked
				$('#submitTripDetailsBtn').on('click', function() {
					TripExpenses._sendTrip(selectedTrip, expenseBody, emailAttachments);
				});
			});
			
			// If the previous page was from the history list, call function
			if (fromHistory) {
				TripExpenses._changeToHistory(selectedTrip);
			}
		},
		
		/**
		 * Function that will attach all the handlers required by the modal. It will also
		 * grab refreshed data from the database to display to the user.
		 * @param selectedTrip the Trip ID.
		 */
		_modalHandler : function(selectedTrip) {
			$('#editTrip').on('click', function() {
				// Get the new information from the data base and then populate the fields in the modal.
				TripExpenses._getTrip(selectedTrip, function(tripName, tripStart, tripEnd) {
					// Prefil the details on the modal
					$('#editTripDescription').val(tripName);
					$('#editStartDate').val(tripStart);
					$('#editEndDate').val(tripEnd);
					
					// Bring up the modal
					$('#editTripModal').popup("open");
				});
		
				// Handler to close the popup
				$('#cancelEditTrip').on('click', function() {
					$('#editTripModal').popup("close");
				});
				
				// Handler for when the submit button is pressed
				$('#submitEditTrip').on('click', function() {
					var tripDescription = $('#editTripDescription').val();
					var tripStartDate = $('#editStartDate').val();
					var tripEndDate = $('#editEndDate').val();
					
					// Submit the update to the DB
					DB.updateTrip(selectedTrip, tripDescription, tripStartDate, tripEndDate, function() {
						// Close the modal
						$('#editTripModal').popup("close");
						
						// Clear the current title
						TripExpenses._removeTitles();
						
						// Reload the current page
						TripExpenses._fillTitles(tripDescription, tripStartDate, tripEndDate);
					});
				});
			});
		},
		
		/**
		 * Function that will clear the trip name, start and end dates on screen
		 * @param none
		 */
		_removeTitles : function() {
			$('#tripName').empty();
			$('#tripStart').empty();
			$('#tripEnd').empty();
		},
		
		/**
		 * Function that will populate the title
		 * @param tripName the title of the trip
		 * @param tripStart the start date of the trip
		 * @param tripEnd the end date of the trip
		 */
		_fillTitles : function(tripName, tripStart, tripEnd) {
			$('#tripName').html(tripName);
			$('#tripStart').html(tripStart);
			$('#tripEnd').html(tripEnd);
		},
		
		/**
		 * Function that will get the data from the DB and then will complete
		 * the call back function as specified.
		 * @param selectedTrip the trip ID
		 * @param callback the callback function
		 */
		_getTrip : function(selectedTrip, callback) {
			console.log(selectedTrip);
			DB.getUnprocessedTrip(selectedTrip, function(data) {
				var tripName = data.tripName;
				var tripStart = data.startDate;
				var tripEnd = data.endDate;
				
				if (callback) {
					callback(tripName, tripStart, tripEnd);
				}
			});
		},
		
		/**
		 * Function that will take the expense data, format it into a prefilled email for the user
		 * to send it to desired email address entered.
		 * @param selectedTrip
		 */
		_sendTrip : function(selectedTrip, expenseBody, emailAttachments) {
			// Get the trip name that is being emailed.
			var emailSubject = "Expenses for " + $('#tripName').html();
			
			// Build the body of the email
			
			var emailBody = "<html><head></head>Please find attached the expense receipts for the trip <span>" + $('#tripName').html() + "</span> for the period <span>" + $('#tripStart').html() + "</span> to <span>" + $('#tripEnd').html() + "</span>." + 
			"<br/><br/>" +
			"<table><thead><tr><th>Type</th><th>Charge To</th><th>Receipt</th></tr></thead><tbody>";

			emailBody = emailBody  + expenseBody + "</tbody></table></html>" + emailAttachments;
			
			// Get the entered in email address
			var emailAddress = $('#sendTripEmailAddress').val();
			if (emailAddress.length > 1) {
				var callback = function() {
					// Check if the email was sent properly
					var onComplete = function(returnValue) {
						// Have the alert confirm if the email was sent?
						if (returnValue > 0 && returnValue <= 3) {
							alert("Email sent");
							
							// Update the trip to be processed
							DB.processTrip(selectedTrip, Utils.getTodaysDate(), function() {
								// Go to the main page after trip has been processed
								Utils.loadPage("mainPage", function() {
									MainPage.init();
								});
							});
						}
					};
					
					/*
					 * To use the email composer plugin, the following arguments are as follows:
					 * showEmailComposerWithCallback(callback, subject, body, to, cc, bcc, boolean HTML, attachments)
					 */
					window.plugins.emailComposer.showEmailComposerWithCallback(
							onComplete,
							emailSubject, 
							emailBody, 
							[emailAddress],
							[],
							[],
							true,
							[]);
		
				};
				
				// Save the email address to the DB
				DB.logTrip(selectedTrip, emailAddress, Utils.getTodaysDate(), callback);
			}
		},
		
		/**
		 * Function that will change certain elements to match the trip details when arriving from the
		 * history list page.
		 * @param none
		 */
		_changeToHistory : function(selectedTrip) {
			// Display the hidden email log button
			$('#emailLogBtnArea').removeClass("hidden");
			
			// Change the text in the send email button
			$('#sendTripDetailsBtn').text("Resend Trip Details").button('refresh');
			
			// Find the processed date of the trip and print it to screen
			DB.getProcessedDate(selectedTrip, function(trip) {
				$('#processedDate').html("Originally submitted: " + trip.originalProcessDate);
			});
			
			// Attach handler for when email log is clicked
			$('#emailLogBtn').on('clicked', function() {
				alert("Email log clicked, not yet implemented!");
			});
		}
	};
}());

