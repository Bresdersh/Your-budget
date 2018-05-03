// Immediately-invoked function expression in the form of a budget
var calculationController = (function() {

    var Loss = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Profit = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

})();

// Immediately-invoked function expression the user interface controller
var userInterfaceController = (function() {

    var DOMStrings = {
        inputType: ".insert__type",
        inputDescription: ".insert__description",
        inputValue: ".insert__value",
        inputButton: ".insert__btn"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Profit or loss
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();

// Immediately-invoked function expression the application controller
var applicationController = (function(calculationCtrl, userInterfaceCtrl) {

    var eventListenersConfiguration = function() {

        // Collection data from the DOM
        var DOM = userInterfaceController.getDOMStrings();
        
        // Basic button options
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);

        // The event of pressing the keyboard button
        document.addEventListener("keypress", function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            };
        });
    }

    var ctrlAddItem = function() {

        // Get the field input data
        var input = userInterfaceCtrl.getInput();

        // Add the item to the calculation controller

        // Add the item to the user interface controller

        // Calculate the budget

        // Display the budget on user interface controller
    };

    return {
        init: function() {
            console.log("Its works!");
            eventListenersConfiguration();
        }
    };

})(calculationController, userInterfaceController);

applicationController.init();