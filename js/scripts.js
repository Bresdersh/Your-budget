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

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item for "exp" and "inc"
            if(type === "exp") {
                newItem = new Loss(ID, des, val);
            } else if(type === "inc") {
                newItem = new Profit(ID, des, val);
            }

            // Redirection to the data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// Immediately-invoked function expression the user interface controller
var userInterfaceController = (function() {

    var DOMStrings = {
        inputType: ".insert__type",
        inputDescription: ".insert__description",
        inputValue: ".insert__value",
        inputButton: ".insert__btn",
        profitContainer: '.income__list',
        lossContainer: '.expenses__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Profit or loss
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text

            if(type === "inc") {
                element = DOMStrings.profitContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp") {
                element.DOMStrings.lossContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

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
        var input, newItem;

        // Get the field input data
        input = userInterfaceCtrl.getInput();

        // Add the item to the calculation controller
        newItem = calculationController.addItem(input.type, input.description, input.value);

        // Add the item to the user interface controller
        userInterfaceController.addListItem(newItem, input.type);

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