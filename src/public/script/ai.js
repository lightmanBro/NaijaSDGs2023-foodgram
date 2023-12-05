class FoodOrderSystem {
    constructor(vendors, userAllergens) {
        this.vendors = vendors;
        this.orders = [];
        this.userAllergens = userAllergens;
    }

    displayAvailableMeals() {
        this.vendors.forEach(vendor => {
            console.log(`\nVendor: ${vendor.name}`);
            vendor.meals.forEach(meal => {
                console.log(`${meal.name} - $${meal.price}`);
            });
        });
    }

    //Will pass vendor id instead of vendor index
    /*Here will take in location of the user in relative to the vendors,*/ 
    placeOrder(vendorIndex, mealIndex) {
        const vendor = this.vendors[vendorIndex];
        const selectedMeal = vendor.meals[mealIndex];
        console.log('vendorIndex:', vendorIndex);
        console.log('mealIndex:', mealIndex);
        console.log('this.vendors:', this.vendors);
        console.log('vendor:', vendor);

        if (selectedMeal.allergens.some(allergen => this.userAllergens.includes(allergen))) {
            console.log("Warning: This meal contains allergens. Consider choosing a different meal.");
            return;
        }

        this.orders.push({
            vendor: vendor.name,
            meal: selectedMeal.name,
            price: selectedMeal.price,
            foodClasses: selectedMeal.foodClasses
        });

        console.log(`\nOrder placed: ${selectedMeal.name} from ${vendor.name}`);
    }

    planMealsForWeek(budget, days) {
        const dailyBudget = budget / days;
        const dailyOrders = [];

        for (let day = 1; day <= days; day++) {
            let remainingBudget = dailyBudget;
            const dailyMeals = [];

            this.vendors.forEach(vendor => {
                vendor.meals.forEach(meal => {
                    if (
                        meal.price <= remainingBudget
                        && meal.foodClasses.includes('protein')
                        && meal.foodClasses.includes('carbohydrates')
                        && !meal.allergens.some(allergen => this.userAllergens.includes(allergen))
                    ) {
                        dailyMeals.push({
                            vendor: vendor.name,
                            meal: meal.name,
                            price: meal.price
                        });
                        remainingBudget -= meal.price;
                    }
                });
            });

            dailyOrders.push(dailyMeals);
        }

        return dailyOrders;
    }
}

// Example usage
//fetching the vendor list from the database and their foods data too.
const vendorsList = [
    { name: 'Vendor A', meals: [
        { name: 'Jollof Rice', price: 5, foodClasses: ['carbohydrates'], allergens: ['nuts', 'shellfish'] },
        // { name: 'Boiled Chicken', price: 5, foodClasses: ['protein', 'carbohydrates'], allergens: ['dairy'] }
    ] },
    {
        name: 'Mama Bee Kitchen', meals: [
            { name: 'Grilled Chicken', price: 8, foodClasses: ['protein', 'carbohydrates'], allergens: ['dairy'] },
            { name: 'Boiled Chicken', price: 5, foodClasses: ['protein', 'carbohydrates'], allergens: ['dairy'] }
        ]
    },
    {
        name: 'Vendor B', meals: [
            { name: 'Vegetable Soup', price: 4, foodClasses: ['vegetables'], allergens: ['gluten'] },
            { name: 'Fish Stew', price: 7, foodClasses: ['protein'], allergens: ['dairy'] }
        ]
    }
];

//The user allergies list
const userAllergens = ['gluten'];

const foodOrderSystem = new FoodOrderSystem(vendorsList, userAllergens);
foodOrderSystem.displayAvailableMeals();

// User clicks "Accept" button
foodOrderSystem.placeOrder(2, 0);  // Example: Ordering Grilled Chicken from Vendor A

// Planning meals for a week
const weeklyOrders = foodOrderSystem.planMealsForWeek(50);
console.log("\nWeekly Meal Plan:");
weeklyOrders.forEach((dailyMeals, day) => {
    console.log(`Day ${day + 1}: ${dailyMeals.map(meal => meal.meal + ' from ' + meal.vendor).join(', ')}`);
});
