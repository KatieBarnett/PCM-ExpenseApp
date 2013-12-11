
/**
 * This is the JavaScript controller for charge to
 * @author Katie Barnett and Shasha Pendit
 */

var ChargeTo = (function() {
	return {
		// expenseTypeID is passed in from previous screen
		init : function(expenseID) {
			console.log("ChargeTo :: init");
			console.log("expenseID is "+expenseID);
			
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
				
			//draw thumbNail with latest receipt
			Utils.getThumbNail(Utils.getReceipt(0), document.getElementById('receiptThumb'));
		    
		    $('#receiptThumb').on('click', function(){
		    	Utils.getFullImage(0, ChargeTo);
		    	console.log("receipt built");
		    });
			
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			$('#closeAttachmentOptions').on('click',function() {
				// Close the attachment modal
				closeAttachmentOptions();
			});
			$('.finishLater').on('click',function() {
				// Add function for requirement of the Finish this later button

				Utils.loadPageWithAnimation('mainPage', expenseID, function() {

					Utils.saveCurrentPageObject(ChargeTo);
					MainPage.init();
				});
			});
			
			// Move to next page after expense type is selected
			$('.selectTrip').on('click', function() {
				Utils.loadPageWithAnimation("selectTrip", expenseID, function() {
					Utils.saveCurrentPageObject(ChargeTo);
					// Save selection here - to be done
					SelectTrip.init(expenseID);
				});
			});
			
			
			// trigger add client code modal
			$('.btnShowModal').on('click', function() {

				$( ".ui-select div" ).addClass( "ui-icon-alt" ); /*change the icon colour of the select*/
				$('#descriptionErrorMsg').addClass('hidden');
				  console.log("Function called");
				// Clear any value in the inputs
				$('#accDescription').val("");
				$('#accID').val("");
				$('#combobox').val("");
				$("#popupDialogue").popup("open");
					
			});
			
			// Handler for when the cancel button is clicked on the modal
			$('#cancelAddCode').on('click', function(){
			    console.log("close modal");
			    $("#addTripModal").popup("close");

			});
           
			// Handler for when the submit button is clicked on the modal
			$('#submitAddCode').on('click', function(event) {
				event.preventDefault();
				console.log("add button clicked");
				if ($('#accDescription').val().length > 1) {
					var apName = $('#accDescription').val();
					var	apCode = $('#accID').val();
					var chargeCode = $('#combobox').val();
						
					var callback = function(newCodeID) {
						// Clear the list so the list can be repopulated on screen
						ChargeTo._removeCodeList();
						
						// Query the DB for the information to rebuild the list
						DB.getClientCodes(function(data) {
							// Build the list
							ChargeTo._buildCodeList(data);
							
							// Refresh the page so the scrolling will still work on the page.
//							$.mobile.activePage.trigger('pagecreate');
							
							// Close the modal once completed
							$('#popupDialogue').popup("close");
						});
					};

					DB.addClientCode(apCode, apName, chargeCode, callback);
				} else {
					console.log("empty text box detected");
					$('#descriptionErrorMsg').removeClass('hidden');  
				};
			});
			
			});
		
	},
	
	/**
	 * Function to build the list of codes into the list DOM
	 * @param data the returned data from the DB
	 */
	_buildCodeList : function(data) {
		
		
		//build list divider
		$('<li>', {"data-role":"list-divider", text: "Charge To:"}).appendTo("#selectCodeList");
		
		//populate rest of list
		
		for (var i=0; i<data.length; i++){
			//Populate Client Code list
			var chargeToLI = $('<li>', {"data-code" : data[i].accountProjectCode});
			$('<a>', { "class" : "selectCode", "data-icon" : "arrow-r", text : data[i].accountProjectCode }).appendTo(chargeToLI);
			chargeToLI.appendTo('#selectCodeList');
		
	
		}
		
		// Refresh the list view
		$('#selectCodeList').listview('refresh');
	},
	
	/**
	 * Function to clear the list DOM to prepare for new list to be generated.
	 * @param none
	 */
	_removeCodeList : function() {
		$('#selectCodeList').empty();
	
	
	}
	
	};
	
			
}());
			

			



