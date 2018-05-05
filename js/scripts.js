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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {

            // Calculate total income and expenses 
            calculateTotal("exp");
            calculateTotal("inc");

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        profitContainer: ".income__list",
        lossContainer: ".expenses__list",
        budgetLabel: ".converter__value",
        incomeLabel: ".converter__income--value",
        expensesLabel: ".converter__expenses--value",
        percentageLabel: ".converter__expenses--percentage"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Profit or loss
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text

            if(type === "inc") {
                element = DOMStrings.profitContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp") {
                element = DOMStrings.lossContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },

        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
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

    var updateCalculationController = function() {
        
        // Calculate the budget
        calculationCtrl.calculateBudget();

        // Return the budget
        var budget = calculationCtrl.getBudget();

        // Display the budget on user interface controller
        userInterfaceController.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // Get the field input data
        input = userInterfaceCtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            // Add the item to the calculation controller
            newItem = calculationController.addItem(input.type, input.description, input.value);

            // Add the item to the user interface controller
            userInterfaceController.addListItem(newItem, input.type);

            // Clear the fields
            userInterfaceController.clearFields();

            // Calculate and update budget
            updateCalculationController();
        }
    };

    return {
        init: function() {
            console.log("Its works!");
            userInterfaceController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            eventListenersConfiguration();
        }
    };

})(calculationController, userInterfaceController);

applicationController.init();