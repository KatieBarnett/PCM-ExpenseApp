/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var ExpenseType = (function() {
	var expenseObject = null;
	var receiptURI = null;
	return {
		setReceiptURI : function(URI) {
			receiptURI = URI;
			this.init();
		},
		
		init : function(expenseID) {
			console.log("ExpenseType :: init");
			console.log(expenseID);
			// Get the expense object if it exists
			if (expenseID) {
				DB.getExpense(expenseID, function(expense) {
					expenseObject = expense;
				});
			}
			
			var thumbNailURI = "images/no-receipt.gif";
			//draw thumbNail with latest receipt
			if (expenseObject && expenseObject.receipt != 'undefined') {
				thumbNailURI = expenseObject.receipt;
			} else if (receiptURI) {
				thumbNailURI = receiptURI;
			}
			console.log(thumbNailURI);
			Utils.getThumbNail(thumbNailURI, $('.receiptThumb')[0]);
		    
		    $('.receiptThumb').on('click', function(){
		    	Utils.getFullImage(thumbNailURI, ExpenseType);
		    });
			
		    // Populate list of expenses
		    var group = 0;
		    var currentGroup = 0;
		    var expenseTypes = DB.getExpenseTypes();
		    
		    expenseUL = document.getElementById("expenseList");
		    
		    console.log("got the UL");
		    for (var i=0; i<expenseTypes.length; i++){
		    		
		    	group = expenseTypes[i]["expenseGroupID"];
		 
		    	// If parent of new sub group set up collapsible list item
		    	if (group > currentGroup) {
		    		expenseLI = document.createElement("li");
		    		expenseLI.setAttribute("class", "expenseTypeLI");
		    		expenseLI.setAttribute("data-role", "collapsible");
		    		expenseLI.setAttribute("data-iconpos", "right");
		    		expenseLI.setAttribute("data-theme", "d");
		    		parentText = document.createElement("h2");
		    		parentText.appendChild(document.createTextNode(expenseTypes[i]["expenseTypeID"]));
		    		expenseLI.appendChild(parentText);
		    		expenseSubUL = document.createElement("ul");
		    		expenseSubUL.setAttribute("data-role", "listview");
		    		currentGroup = group;
		    	}
		    	// If child of sub group add to collapsible list
		    	else if (group > 0){
		    		expenseSubLI = document.createElement("li");
		    		expenseSubLI.setAttribute("class", "chargeTo");
			    	expenseSubLI.setAttribute("data-expense", expenseTypes[i]["expenseTypeID"]);
			    	expenseSubLI.setAttribute("data-theme", "d");
		    		expenseA = document.createElement("a");
			    	expenseA.appendChild(document.createTextNode(expenseTypes[i]["expenseTypeID"]));
			    	expenseSubLI.appendChild(expenseA);
			    	expenseSubUL.appendChild(expenseSubLI);
			    	
			    	// If last of subgroup, close collapsible menu
			    	if (expenseTypes[i+1]["expenseGroupID"] != currentGroup){
			    		expenseLI.appendChild(expenseSubUL);
			    		expenseUL.appendChild(expenseLI);
			    	}
		    	}
		    	// If single type add to main list
		    	else {
		    		expenseLI = document.createElement("li");
		    		expenseLI.setAttribute("class", "expenseTypeLI");
		    		expenseLI.setAttribute("class", "chargeTo");
			    	expenseLI.setAttribute("data-expense", expenseTypes[i]["expenseTypeID"]);
		    		expenseA = document.createElement("a");
		    		expenseA.appendChild(document.createTextNode(expenseTypes[i]["expenseTypeID"]));
		    		expenseLI.appendChild(expenseA);
		    		expenseUL.appendChild(expenseLI);
		    	}
		    }
		    $('#expenseList').trigger('create');
		    $('#expenseList').listview('refresh');
		    
		    console.log("refresh list");
		    
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			
			$('.finishLater').on('click',function() {
				// If expense has not previously been saved, save it then return to main page
				if (expenseID == null) {
					DB.addExpense(null, null, thumbNailURI, null, function(expenseID) {
						Utils.loadPage("mainPage", function() {
							Utils.saveCurrentPageObject(ExpenseType);
							MainPage.init();
						});	
					});	
				} else {
					// Update the expense and then move to the main page
					DB.updateExpense(expenseObject["expenseID"], selectedType, expenseObject["accountProjectCode"], 
							expenseObject["receipt"], expenseObject["tripID"], function () {
						Utils.loadPage("chargeTo", function() {
							Utils.saveCurrentPageObject(ExpenseType);
							MainPage.init();
						});	
					});
				}	
			});
			
			// After expense type is selected, create or update expense record and pass id to next screen
			$('.chargeTo').on('click', function() {
				var selectedType = $(this).attr("data-expense");
				if (expenseID == null) {
					DB.addExpense(selectedType, null, thumbNailURI, null, function(newExpenseID) {
						Utils.loadPageWithAnimation("chargeTo", newExpenseID, function() {
							Utils.saveCurrentPageObject(ExpenseType);
							ChargeTo.init(newExpenseID);
						});	

					});	
				} else {
					console.log("expense ID is not null");
					DB.updateExpense(expenseObject["expenseID"], selectedType, expenseObject["accountProjectCode"], 
							expenseObject["receipt"], expenseObject["tripID"], function () {
						Utils.loadPageWithAnimation("chargeTo", expenseObject["expenseID"], function() {
							Utils.saveCurrentPageObject(ExpenseType);
							ChargeTo.init(expense["expenseID"]);
						});	
					});
				}	 
			});				
		}
	};
}());

