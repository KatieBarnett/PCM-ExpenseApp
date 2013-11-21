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
						// Load ExpenseTypes and ChargeAccount tables with data
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Public Transportation")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Air Fare")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Car Rental")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Hotel")');
						tx.executeSql('INSERT INTO ExpenseTypes VALUES ("Other Travel Expenses")');
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
		getExpenseTypes : function() {
			return expenseTypes;
		},
		
		/**
		 * Retrieves all charge account codes
		 * 
		 * @return Array of charge account codes
		 */
		getChargeAccountCodes : function() {
			return chargeAccounts;
		},
		
		/**
		 * Retrieves all account/project codes
		 * 
		 * @return Array of account/project codes
		 */
		getAccountProjects : function() {

		},
		
		/**
		 * Retrieves all unprocessed trips
		 * 
		 * @return Array of unprocessed trips
		 */
		getUnprocessedTrips : function() {	
		},
		
		/**
		 * Retrieves all processed trips
		 * 
		 * @return Array of processed trips
		 */
		getProcessedTrips : function() {
		},
		
		/**
		 * Retrieves all logs
		 * 
		 * @return Array of logs
		 */
		getLogs : function() {
		},				

		
		// Populate account/projects list
		tx.executeSql('SELECT accountProjectCode, accountProjectName FROM AccountProjects', [], function(tx, results) {
			console.log("Populating accountProjects array with " + results.rows.length + " results");
			for (var i = 0; i < results.rows.length; i++) {
				accountProjects.push({accountProjectCode: results.rows.item(i)["accountProjectCode"], 
									  accountProjectName: results.rows.item(i)["accountProjectName"]
				});
				console.log(accountProjects);
			}
		}, errorCB);			
		
		// Populate unprocessed trips
		tx.executeSql('SELECT tripName, startDate, endDate FROM Trips WHERE processed=false', [], function(tx, results) {
			console.log("Populating unprocessedTrips array with " + results.rows.length + " results");
			for (var i = 0; i < results.rows.length; i++) {
				tripsUnprocessed.push({tripName: results.rows.item(i)["tripName"], 
									   startDate: results.rows.item(i)["startDate"],
									   endDate: results.rows.item(i)["endDate"]
				});
				console.log(expenseTypes);
			}
		}, errorCB);
		
		// Populate processed trips
		tx.executeSql('SELECT tripName, startDate, endDate FROM Trips WHERE processed=true', [], function(tx, results) {
			console.log("Populating processedTrips array with " + results.rows.length + " results");
			for (var i = 0; i < results.rows.length; i++) {
				tripsProcessed.push({tripName: results.rows.item(i)["tripName"], 
									 startDate: results.rows.item(i)["startDate"],
									 endDate: results.rows.item(i)["endDate"]
				});
				console.log(tripsProcessed);
			}
		}, errorCB);

		// Populate trips log
		tx.executeSql('SELECT tripName, startDate, endDate, email, submitDate FROM Logs INNER JOIN Trips ON Logs.tripID = Trips.tripID WHERE processed=true', [], function(tx, results) {
			console.log("Populating tripsLog array with " + results.rows.length + " results");
			for (var i = 0; i < results.rows.length; i++) {
				tripsLog.push({tripName: results.rows.item(i)["tripName"], 
							   startDate: results.rows.item(i)["startDate"],
							   endDate: results.rows.item(i)["endDate"],
							   email: results.rows.item(i)["email"],
							   submitDate: results.rows.item(i)["submitDate"]
				});
				console.log(tripsLog);
			}
		}, errorCB);
		
		addClientCode : function(apCode, apName, chargeCode) {
			db.transaction(function(tx) {
				console.log("adding client code");
				tx.executeSql('INSERT INTO AccountProjects VALUES (' + apCode + ',' + apName + ',' + chargeCode + ')');
			}, errorCB, successCB('addClientCode'));
		},
		
		getClientCode : function(callback) {
			db.transaction(function(tx) {
				console.log("getting client code");
				tx.executeSql('SELECT INTO Logs');
			});
		},
		
		/** TODO editClientCode - currently not in scope **/
		/** TODO deleteClientCode - currently not in scope **/
		
		addTrip : function(tName, tStart, tEnd) {
			db.transaction(function(tx) {
				console.log("creating new trip (trip name: " + tName + ", tripStartDate: " + tStart + ", tripEndDate: " + tEnd);
				tx.executeSql('INSERT INTO Trips (tripName, startDate, endDate) VALUES (' + tName + ',' + tStart + ',' + tEnd + ')');
			}, errorCB, successCB('addTrip'));						
		},
		
		editTrip : function(tid) {
			db.transaction(function(tx) {
				console.log("editting trip: " + tid);
				tx.executeSql('UPDATE tripName, startDate, endDate FROM Trips WHERE tripID=' + tid); //TODO
			}, errorCB, successCB('editTrip'));
		},
		
		
/*		// Populate charge account codes
		tx.executeSql('SELECT * FROM ChargeAccounts', [], function(tx, results) {
			console.log("Populating chargeAccounts array with " + results.rows.length + " results");			
			for (var i = 0; i < results.rows.length; i++) {
				chargeAccounts.push(results.rows.item(i)["chargeAccountID"]);
				console.log(chargeAccounts);
			}
		}, errorCB);
		
		
		getTrip : function(tid) {
			db.transaction(function(tx) {
				console.log("getting details of trip: " + tid);
				tx.executeSql('SELECT tripName, startDate, endDate, expenseType, accountCode, accountName FROM Trips INNER JOIN Expenses ON Trips.tripID = Expenses.tripID WHERE tripID=' + tid, [], function(tx, results) {
					console.log("Populating  array with " + results.rows.length + " results");			
					for (var i = 0; i < results.rows.length; i++) {
						chargeAccounts.push(results.rows.item(i)["chargeAccountID"]);
						console.log(chargeAccounts);
					}
				});
			}, errorCB, successCB('getTrip'));
		},
		*/
		sendTrip : function(tid, emailAddress) {
			db.transaction(function(tx) {
				console.log("set trip as 'processed'");
				tx.executeSql('UPDATE Trips SET processed=true WHERE tripID=' + tid);
				tx.executeSql('INSERT INTO Logs (logID, tripID, email, submitDate) VALUES (null, ' + tid + ',' + emailAddress + ',' + Util.getDate());
			}, errorCB, successCB('sendTrip'));
		},
		
		addExpense : function(eid, apcode, receipt, tid) {
			db.transaction(function(tx) {
				console.log("add expense");
				tx.executeSql('INSERT INTO Expenses (eid, apcode, receipt, tid) VALUES (null, ' + eid + ',' + apcode + ',' + receipt + ',' + tid);
			}, errorCB, successCB('addExpense'));
		},
		
		getExpense : function(eid) {
			db.transaction(function(tx) {
				console.log("get expense details");
				tx.executeSql('SELECT expenseType, accountProjectName SET processed=true WHERE expenseID=' + eid);	 //TODO
			}, errorCB, successCB('getExpense'));
		},
		
		/** TODO EditExpense **/
 		
		deleteExpense : function(eid) {
			db.transaction(function(tx) {
				console.log("deleting expense");
				tx.executeSql('DELETE * FROM Expenses WHERE expenseID=' + eid); //TODO
			}, errorCB, successCB('deleteExpense'));
		},
		
		getRecentEmailAddresses : function() {
			db.transaction(function(tx) {
				console.log("getting 2 most recent email addresses");
				tx.executeSql('SELECT DISTINCT email FROM Logs WHERE tripID=' + tid + ' ORDER BY ' + submitDate);
			}, errorCB, successCB('getRecentEmailAddresses'));
		}
	};
}());