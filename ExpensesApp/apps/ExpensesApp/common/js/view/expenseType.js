/**
 * This is the JavaScript controller for expense type
 * @author Katie Barnett and Michael Bunn
 */

var ExpenseType = (function() {
	return {
		init : function(expenseID) {
			console.log("ExpenseType :: init");

			//draw thumbNail with latest receipt
			Utils.getThumbNail(Utils.getReceipt(0), document.getElementById('receiptThumb'));
		    
		    $('#receiptThumb').on('click', function(){
		    	Utils.getFullImage(0, ExpenseType);
		    });
			
		    // Populate list of expenses
		    var group = 0;
		    var currentGroup = 0;
		    var expenseTypes = DB.getExpenseTypes();
		    
		    expenseUL = document.getElementById("expenseList");
		    
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
		    
			// Navigation buttons functionality
			$('.back').on('click', function() {
				Utils.goBackWithAnimation();
			});
			$('.finishLater').on('click',function() {
				// If expense has not previously been saved, save it then return to main page
				if (expenseID == null) {
					DB.addExpense(null, null, Utils.getReceipt(0), null, function(expenseID) {
						Utils.loadPageWithAnimation("mainPage", function() {
							Utils.saveCurrentPageObject(ExpenseType);
							MainPage.init();
						});	

					});	
				} else {
					Utils.saveCurrentPageObject(ExpenseType);
					MainPage.init();
				}	
			});
			
			// After expense type is selected, create or update expense record and pass id to next screen
			$('.chargeTo').on('click', function() {
				var selectedType = $(this).attr("data-expense");
				if (expenseID == null) {
					DB.addExpense(selectedType, null, Utils.getReceipt(0), null, function(expenseID) {
						Utils.loadPageWithAnimation("chargeTo", function() {
							console.log(expenseID);
							Utils.saveCurrentPageObject(ExpenseType);
							ChargeTo.init(expenseID);
						});	

					});	
				} else {
					DB.getExpense(expenseID, function(expense){
						DB.updateExpense(expense["expenseID"], selectedType, expense["accountProjectCode"], 
								expense["receipt"], expense["tripID"], function () {
							Utils.loadPageWithAnimation("chargeTo", function() {
								Utils.saveCurrentPageObject(ExpenseType);
								ChargeTo.init(expense["expenseID"]);
							});	
						});

					});
				}
				 
			});				
		}
	};
}());

