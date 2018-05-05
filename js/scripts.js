// Immediately-invoked function expression in the form of a budget
var calculationController = (function() {

    var Loss = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Loss.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Loss.prototype.getPercentage = function() {
        return this.percentage;
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

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }

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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: ".converter__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".converter__title--month"
    };

    var formatNumber = function(num, type) {
        var numbSplit, int, dec, type, sign;

        num = Math.abs(num);
        num = num.toFixed(2);

        numbSplit = num.split(".");

        int = numbSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, int.length);
        }

        dec = numbSplit[1];

        return (type === "exp" ? "-" : "+") + " " + int + "." + dec;

    };

    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp") {
                element = DOMStrings.lossContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {

                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "---";
                }
            });
        },

        displayMonth: function() {
            var now, months, month, year;

            now = new Date();
            // var may = new Date(2018, 5, 5);

            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + " " + year;
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + "," + 
                DOMStrings.inputDescription + "," +
                DOMStrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle("red-focus");
            });

            document.querySelector(DOMStrings.inputButton).classList.toggle("red");

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

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener("change", userInterfaceController.changedType);
    };

    var updateCalculationController = function() {
        
        // Calculate the budget
        calculationCtrl.calculateBudget();

        // Return the budget
        var budget = calculationCtrl.getBudget();

        // Display the budget on user interface controller
        userInterfaceController.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calculate percentages
        calculationCtrl.calculatePercentages();

        // Read percentages from the budget controller
        var percentages = calculationCtrl.getPercentages();

        // Update the UI with the new percentages
        userInterfaceController.displayPercentages(percentages);

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

            // Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            // Inc-1
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the data structure
            calculationController.deleteItem(type, ID);

            // Delete the item from the UI
            userInterfaceController.deleteListItem(itemID);

            // Update and show the new budget
            updateCalculationController();

            // Calculate and update percentages
            updatePercentages();
        };
    };

    return {
        init: function() {
            console.log("Its works!");
            userInterfaceController.displayMonth();
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