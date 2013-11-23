/**
 * JS Module containing the client side DB
 */
var DB = (function() {
	
	// Set the database name, version, display name and size
	var db = window.openDatabase("expensesDB", "1.0", "Expenses DB", 1000000);
	
	// Holds results from the database
	var expenseTypes = new Array();
	var chargeAccounts = new Array();
	
	// Error callback function for DB transactions
	function errorCB(err) {
		console.log("Error processing SQL: " + err.message);
	}
	
	// Success callback function for DB transactions
	function successCB(funct) {
		console.log(funct + "() success function");
	}

	function buildLists(callbackFunction) {
		expenseTypes.length = 0;
		chargeAccounts.length = 0;
		
		db.transaction(function(tx) {
			// Populate expense types
			tx.executeSql('SELECT * FROM ExpenseTypes', [], function(tx, results) {
				console.log("Populating expenseTypes array with " + results.rows.length + " results");
				for (var i = 0; i < results.rows.length; i++) {
					expenseTypes.push(results.rows.item(i)["expenseTypeID"]);
					console.log(expenseTypes);
				}
			}, errorCB);
			
			// Populate charge account codes
			tx.executeSql('SELECT * FROM ChargeAccounts', [], function(tx, results) {
				console.log("Populating chargeAccounts array with " + results.rows.length + " results");
				for (var i = 0; i < results.rows.length; i++) {
					chargeAccounts.push(results.rows.item(i)["chargeAccountID"]);
					console.log(chargeAccounts);
				}
			}, errorCB);			
		}, errorCB, function() {
			console.log("buildFilterCriteriaLists() success func: caling callback");
			callbackFunction();
		});
	}
	
	return {
		/**
		 * Initialise the database
		 */
		initDB : function(callbackFunction) {
			console.log("initDB() executed");
			// Create the database tables
			db.transaction(function(tx) {
				console.log("creating expense table");
				tx.executeSql('CREATE TABLE IF NOT EXISTS ExpenseTypes(' + 
									'expenseTypeID varchar(50) NOT NULL PRIMARY KEY' +
									')');
				console.log("creating chargeAccounts table");
				tx.executeSql('CREATE TABLE IF NOT EXISTS ChargeAccounts(' + 
									'chargeAccountID varchar(50) NOT NULL PRIMARY KEY' +
									')');						
				console.log("creating accountProjects table");
				tx.executeSql('CREATE TABLE IF NOT EXISTS AccountProjects(' + 
									'accountProjectCode varchar(20) NOT NULL PRIMARY KEY,' +
									'accountProjectName varchar(100) NOT NULL,' +
									'chargeAccountID varchar(50),' +
									'FOREIGN KEY(chargeAccountID) REFERENCES ChargeAccounts(chargeAccountID)' +
									')');
				console.log("creating trips table");
				tx.executeSql('CREATE TABLE IF NOT EXISTS Trips(' + 
									'tripID integer NOT NULL PRIMARY KEY AUTOINCREMENT,' +
									'tripName varchar(100),' +
									'startDate date,' +
									'endDate date,' +
									'processed boolean DEFAULT FALSE' +
									')');
				console.log("creating logs table");
				tx.executeSql('CREATE TABLE IF NOT EXISTS Logs(' + 
									'logID integer NOT NULL PRIMARY KEY AUTOINCREMENT,' +
									'tripID integer,' +
									'email varchar(50),' +
									'submitDate date,' +
									'FOREIGN KEY(tripID) REFERENCES Trips(TripID)' +
									')');
				console.log("creating expenses table");
				tx.executeSql('CREATE TABLE IF NOT EXISTS Expenses(' + 
									'expenseID integer PRIMARY KEY AUTOINCREMENT,' + 
									'expenseTypeID varchar(50),' +
									'accountProjectCode varchar(20),' +
									'receipt varchar(150),' +
									'tripID integer,' +
									'FOREIGN KEY(expenseTypeID) REFERENCES ExpenseTypes(expenseTypeID),' +
									'FOREIGN KEY(accountProjectCode) REFERENCES AccountProjects(accountProjectCode),' +
									'FOREIGN KEY(tripID) REFERENCES Trips(tripID)' +
									')');
				console.log("ALL TABLES CREATED");
			}, errorCB, function() {
				console.log('initDB() success function');
				var isEmpty = false;
				// Check if there is data in the DB, if not, load data
				db.transaction(function(tx) {
					console.log("Check if ExpenseTypes table is empty");
					tx.executeSql('SELECT COUNT(*) AS numResults FROM ExpenseTypes', [], function(tx, results) {
						if (results.rows.item(0).numResults == 0) {
							console.log("DB is empty");
							isEmpty = true;
						} else {
							console.log("DB is not empty");
						}
					}, errorCB);
				}, errorCB, function() {
					console.log("DB.initDB() success function");
					if (isEmpty) {
						console.log("loading DB");
						// Load data into ExpenseTypes and ChargeAccount tables
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Public Transportation")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Air Fare")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Car Rental")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Hotel")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Other Travel Expenses")');
						// TODO add remaining expense types
						tx.executeSql('INSERT INTO ChargeAccounts VALUES ("Services Project (BMS)")');
						tx.executeSql('INSERT INTO ChargeAccounts VALUES ("Non-Project International (ICA)")');
						tx.executeSql('INSERT INTO ChargeAccounts VALUES ("SAP WBSElement")');
					} else {
						console.log("Building data lists");
						buildLists(callbackFunction);
					}
				});
			});
		},
		
		/**
		 * Retrieves all expense types
		 * 
		 * @return Array of expense types
		 */
		getExpenseTypes : function(callback) {
			return expenseTypes;
		},
		
		/**
		 * Retrieves all charge account codes
		 * 
		 * @return Array of charge account codes
		 */
		getChargeAccountCodes : function(callback) {
			return chargeAccounts;
		},
		
		/**
		 * Retrieves all account/project codes
		 * 
		 * @return Array of account/project codes
		 */
		getAccountsAndProjects : function(callback) {
			db.transaction(function(tx) {
				console.log("Retrieving accounts/projects list");
				var query = 'SELECT accountProjectCode, accountProjectName FROM AccountProjects';
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					var accountsProjectsList = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the account/project
						var singleAccountProject = {
								ID : row.id
						};
						// Map each value to the single trip
						$.each(Util.getValues("accountProjectCode, accountProjectName"), function(index, value) { // TODO test
							singleAccountProject[value] = row[value];
						});
						console.log("Account/project: " + singleAccountProject);
						accountsProjectsList.push(singleAccountProject);
					}
					// Run the call function
					callback(accountsProjectsList);
				}, errorCB);
			}, errorCB, successCB('getAccountsAndProjects'));
		},
		
		/**
		 * Retrieves all unprocessed trips for Process Trips screen
		 * 
		 * @return Array of unprocessed trips
		 */
		getUnprocessedTrips : function(callback) {	
			db.transaction(function(tx) {
				console.log("Retrieving unprocessed trips list");
				var query = 'SELECT tripName, startDate, endDate FROM Trips WHERE processed=false';
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					var unprocessedTripsList = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the unprocessed trip
						var singleUnprocessedTrip = {
								ID : row.id
						};
						// Map each value to the single trip
						$.each(Util.getValues("tripName, startDate, endDate"), function(index, value) { // TODO test
							singleUnprocessedTrip[value] = row[value];
						});
						console.log("Unprocessed trip: " + singleUnprocessedTrip);
						unprocessedTripsList.push(singleUnprocessedTrip);
					}
					// Run the call function
					callback(unprocessedTripsList);
				}, errorCB);
			}, errorCB, successCB('getUnprocessedTrips'));
		},
		
		/**
		 * Retrieves all processed trips for History screen
		 * 
		 * @return Array of processed trips
		 */
		getProcessedTrips : function(callback) {
			db.transaction(function(tx) {
				console.log("Retrieving processed trips list");
				var query = 'SELECT tripName, startDate, endDate FROM Trips WHERE processed=true';
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					var processedTripsList = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the processed trip
						var singleProcessedTrip = {
								ID : row.id
						};
						// Map each value to the single trip
						$.each(Util.getValues("tripName, startDate, endDate"), function(index, value) { // TODO test
							singleProcessedTrip[value] = row[value];
						});
						console.log("Processed trip: " + singleProcessedTrip);
						processedTripsList.push(singleProcessedTrip);
					}
					// Run the call function
					callback(processedTripsList);
				}, errorCB);
			}, errorCB, successCB('getProcessedTrips'));
		},
		
		/**
		 * Retrieves all processed trips logs
		 * 
		 * @return Array of logs
		 */
		getLogs : function(callback) {
			db.transaction(function(tx) {
				console.log("Retrieving logs list");
				var query = 'SELECT tripName, startDate, endDate FROM Trips WHERE processed=true';
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					var logsList = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the log
						var singleLog = {
								ID : row.id
						};
						// Map each value to the single trip
						$.each(Util.getValues("tripName, startDate, endDate"), function(index, value) { // TODO test
							singleLog[value] = row[value];
						});
						console.log("Log: " + singleLog);
						logsList.push(singleLog);
					}
					// Run the call function
					callback(logsList);
				}, errorCB);
			}, errorCB, successCB('getLogs'));
		},				
		
		/**
		 * Retrieves all charge codes
		 * 
		 * @return Array of charge codes
		 */
		getChargeCodes : function(callback) {
			db.transaction(function(tx) {
				console.log("Retrieving charge codes list");
				var query = 'SELECT * FROM ChargeAccounts';
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					var chargeCodesList = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the charge code
						var singleChargeCode = {
								ID : row.id
						};
						console.log("Charge code: " + singleChargeCode);
						chargeCodesList.push(singleChargeCode);
					}
					// Run the call function
					callback(chargeCodesList);
				}, errorCB);
			}, errorCB, successCB('getChargeCodes'));
		},
				
		addClientCode : function(apCode, apName, chargeCode, callback) {
			db.transaction(function(tx) {
				console.log("adding client code");
				tx.executeSql('INSERT INTO AccountProjects VALUES (' + apCode + ',' + apName + ',' + chargeCode + ')');
			}, errorCB, successCB('addClientCode'));
		},
		
		addTrip : function(tName, tStart, tEnd, callback) {
			db.transaction(function(tx) {
				console.log("creating new trip (trip name: " + tName + ", tripStartDate: " + tStart + ", tripEndDate: " + tEnd);
				tx.executeSql('INSERT INTO Trips (tripName, startDate, endDate) VALUES (' + tName + ',' + tStart + ',' + tEnd + ')');
			}, errorCB, successCB('addTrip'));						
		},
		
		updateTrip : function(tid, callback) {
			db.transaction(function(tx) {
				console.log("editting trip: " + tid);
				tx.executeSql('UPDATE tripName, startDate, endDate FROM Trips WHERE tripID=' + tid); //TODO
			}, errorCB, successCB('editTrip'));
		},
		
		/**
		 * Retrieves details of a single trip
		 * 
		 * @param tripID
		 * 			Unique ID of trip
		 * 
		 * @return A trip object
		 */
		getTripDetails : function(tid, callback) {
			db.transaction(function(tx) {
				console.log("Retrieving details of trip: " + tid);
				var query = 'SELECT tripName, startDate, endDate, expenseType, accountCode, accountName FROM Trips INNER JOIN Expenses ON Trips.tripID = Expenses.tripID WHERE tripID=' + tid;
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					// TODO Revise commented code below
					/*var tripEmailLogs = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the log
						var singleEmailLog = {
								ID : row.id
						};
						// Map each value to the single trip
						$.each(Util.getValues("email, submitDate"), function(index, value) { //TODO test
							singleEmailLog[value] = row[value];
						});
						console.log("Log: " + singleEmailLog);
						tripEmailLogs.push(singleEmailLog);
					}
					// Run the call function
					callback(tripEmailLogs); */
				}, errorCB);
			}, errorCB, successCB('getTripDetails'));
		},

		/**
		 * TODO - To be revised
		 */
		sendTrip : function(tid, emailAddress, callback) {
			db.transaction(function(tx) {
				console.log("set trip as 'processed'");
				tx.executeSql('UPDATE Trips SET processed=true WHERE tripID=' + tid);
				tx.executeSql('INSERT INTO Logs (logID, tripID, email, submitDate) VALUES (null, ' + tid + ',' + emailAddress + ',' + Util.getDate());
			}, errorCB, successCB('sendTrip'));
		},
		
		/**
		 * Adds an expense
		 * 
		 * @param //TODO
		 */
		addExpense : function(eid, apcode, receipt, tid, callback) {
			db.transaction(function(tx) {
				console.log("add expense");
				tx.executeSql('INSERT INTO Expenses (eid, apcode, receipt, tid) VALUES (null, ' + eid + ',' + apcode + ',' + receipt + ',' + tid);
			}, errorCB, successCB('addExpense'));
		},
		
		/**
		 * Retrieves an expense
		 * 
		 * @param eid
		 * 			The unique ID of an expense
		 */
		getExpense : function(eid, callback) {
			db.transaction(function(tx) {
				console.log("get expense details");
				tx.executeSql('SELECT expenseType, accountProjectName SET processed=true WHERE expenseID=' + eid);	 //TODO
			}, errorCB, successCB('getExpense'));
		},
		
		/**
		 * Updates an expense
		 * 
		 * @param eid
		 * 			The unique ID of an expense
		 */
		updateExpense : function(eid, callback) {
			// TODO
		},
 		
		/**
		 * Deletes an expense
		 * 
		 * @param eid
		 * 			The unique ID of an expense
		 */
		deleteExpense : function(eid, callback) {
			db.transaction(function(tx) {
				console.log("Deleting expense");
				//TODO
				tx.executeSql('DELETE * FROM Expenses WHERE expenseID=' + eid); 
			}, errorCB, successCB('deleteExpense'));
		},
				
		/**
		 * Retrieves all unassociated expenses
		 */
		getUnassociatedExpenses : function(callback) {
			// TODO
		},
		
		/**
		 * Retrieves two most recently used email addresses
		 */
		getRecentlyUsedEmails : function(callback) {
			db.transaction(function(tx) {
				console.log("Retrieving recently used email addresses");
				// TODO
				//tx.executeSql('SELECT DISTINCT email FROM Logs WHERE tripID=' + tid + ' ORDER BY ' + submitDate);
			}, errorCB, successCB('getRecentlyUsedEmails'));
		},
		
		/**
		 * Retrieves email logs for a single trip
		 * 
		 * @param tripID
		 * 			The unique ID of a trip
		 */
		getTripEmailLogs : function(tripID, callback) {
			db.transaction(function(tx) {
				console.log("Retrieving email logs for specified trip");
				var query = 'SELECT email, submitDate FROM Logs WHERE tripID=' + tripID; //TODO test
				tx.executeSql(query, function(tx, results) {
					console.log("Rows found: " + results.rows.length);
					var tripEmailLogs = new Array();
					for (var i = 0; i < results.rows.length; i++) {
						var row = results.rows.item(i);
						// Setup new object and the unique ID to the log
						var singleEmailLog = {
								ID : row.id
						};
						// Map each value to the single trip
						$.each(Util.getValues("email, submitDate"), function(index, value) { //TODO test
							singleEmailLog[value] = row[value];
						});
						console.log("Log: " + singleEmailLog);
						tripEmailLogs.push(singleEmailLog);
					}
					// Run the call function
					callback(tripEmailLogs);
				}, errorCB);
			}, errorCB, successCB('getChargeCodes'));
		}
	};
}());