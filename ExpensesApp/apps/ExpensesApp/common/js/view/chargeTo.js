
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
			
			//draw thumbNail with latest receipt
			Utils.getThumbNail(Utils.getReceipt(0), document.getElementById('receiptThumb'));
		    
		    $('#receiptThumb').on('click', function(){
		    	Utils.getFullImage(0, ChargeTo);
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
				Utils.loadPageWithAnimation("processTrips", expenseID, function() {
					Utils.saveCurrentPageObject(ChargeTo);
					ProcessTrips.init();
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
				console.log("Function called");
				/**$('.dialog-confirm').dialog("unhide");*/
				$(".dialog-confirm").popup("uhide");
					Utils.saveCurrentPageObject(ChargeTo);
					// Save selection here - to be done
					ChargeTo.init();
			});

		}
	};
	
	
	(function( $ ) {
	    $.widget( "custom.combobox", {
	      _create: function() {
	        this.wrapper = $( "<span>" )
	          .addClass( "custom-combobox" )
	          .insertAfter( this.element );
	 
	        this.element.hide();
	        this._createAutocomplete();
	        this._createShowAllButton();
	      },
	 
	      _createAutocomplete: function() {
	        var selected = this.element.children( ":selected" ),
	          value = selected.val() ? selected.text() : "";
	 
	        this.input = $( "<input>" )
	          .appendTo( this.wrapper )
	          .val( value )
	          .attr( "title", "" )
	          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
	          .autocomplete({
	            delay: 0,
	            minLength: 0,
	            source: $.proxy( this, "_source" )
	          })
	          .tooltip({
	            tooltipClass: "ui-state-highlight"
	          });
	 
	        this._on( this.input, {
	          autocompleteselect: function( event, ui ) {
	            ui.item.option.selected = true;
	            this._trigger( "select", event, {
	              item: ui.item.option
	            });
	          },
	 
	          autocompletechange: "_removeIfInvalid"
	        });
	      },
	 
	      _createShowAllButton: function() {
	        var input = this.input,
	          wasOpen = false;
	 
	        $( "<a>" )
	          .attr( "tabIndex", -1 )
	          .attr( "title", "Show All Items" )
	          .tooltip()
	          .appendTo( this.wrapper )
	          .button({
	            icons: {
	              primary: "ui-icon-triangle-1-s"
	            },
	            text: false
	          })
	          .removeClass( "ui-corner-all" )
	          .addClass( "custom-combobox-toggle ui-corner-right" )
	          .mousedown(function() {
	            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
	          })
	          .click(function() {
	            input.focus();
	 
	            // Close if already visible
	            if ( wasOpen ) {
	              return;
	            }
	 
	            // Pass empty string as value to search for, displaying all results
	            input.autocomplete( "search", "" );
	          });
	      },
	 
	      _source: function( request, response ) {
	        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
	        response( this.element.children( "option" ).map(function() {
	          var text = $( this ).text();
	          if ( this.value && ( !request.term || matcher.test(text) ) )
	            return {
	              label: text,
	              value: text,
	              option: this
	            };
	        }) );
	      },
	 
	      _removeIfInvalid: function( event, ui ) {
	 
	        // Selected an item, nothing to do
	        if ( ui.item ) {
	          return;
	        }
	 
	        // Search for a match (case-insensitive)
	        var value = this.input.val(),
	          valueLowerCase = value.toLowerCase(),
	          valid = false;
	        this.element.children( "option" ).each(function() {
	          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
	            this.selected = valid = true;
	            return false;
	          }
	        });
	 
	        // Found a match, nothing to do
	        if ( valid ) {
	          return;
	        }
	 
	        // Remove invalid value
	        this.input
	          .val( "" )
	          .attr( "title", value + " didn't match any item" )
	          .tooltip( "open" );
	        this.element.val( "" );
	        this._delay(function() {
	          this.input.tooltip( "close" ).attr( "title", "" );
	        }, 2500 );
	        this.input.data( "ui-autocomplete" ).term = "";
	      },
	 
	      _destroy: function() {
	        this.wrapper.remove();
	        this.element.show();
	      }
	    });
	  })( jQuery );
	 
	  $(function() {
	    $( "#combobox" ).combobox();
	    $( "#toggle" ).click(function() {
	      $( "#combobox" ).toggle();
	    });
	  });

	  function closeAttachmentOptions(){
			$('.needs').animate({paddingTop:'5px'}, 500, function() { 
				$('.have').css("display","block");
				});
			
	  }
	
	
}());
			

			



